# Résumé technique de `video-saas`

## 1. Objectif du projet

`video-saas` est un backend de génération vidéo piloté par une IA externe.

L'IA discute avec l'utilisateur, comprend la vidéo demandée, puis utilise le serveur MCP pour :

1. créer ou inspecter un workspace vidéo ;
2. écrire le code Remotion ;
3. exécuter les actions autorisées ;
4. corriger une erreur ;
5. lancer le rendu ;
6. récupérer le résultat.

Le backend ne contient pas l'intelligence créative. Il expose des capacités contrôlées à Claude Desktop, Codex CLI ou à un autre client MCP.

## 2. Architecture générale

```text
Utilisateur
    ↓
Claude Desktop / Codex CLI / autre client MCP
    ↓  MCP stdio (JSON-RPC)
Server.ts
    ↓
Container.ts (injection de dépendances)
    ↓
McpVideoServer
    ↓
MCP Tools
    ↓
Services / VideoEngine / Repositories
    ↓
Workspace vidéo + Remotion
    ↓
output/*.mp4
```

Le client MCP lance le processus Node du serveur. La communication se fait par `stdin/stdout` via le transport stdio. Les logs ne doivent jamais polluer `stdout`, car ce flux est réservé aux messages MCP.

## 3. Les couches du projet

### `core/`

`core` contient uniquement les modèles et contrats partagés par plusieurs couches indépendantes.

#### `core/models/`

- `Video.ts` : modèle vidéo, statuts et DTO de création/modification.
- `Render.ts` : modèle de rendu, statuts, dates, chemin de sortie et erreur éventuelle.

#### `core/repository/`

Contrats des repositories vidéo :

- `CreateVideoRepository.ts`
- `GetVideoRepository.ts`
- `UpdateVideoRepository.ts`
- `DeleteVideoRepository.ts`

Ces fichiers définissent les ports utilisés par le domaine, sans dépendre du filesystem ou de Firebase.

#### `core/use-case/`

Contrats des cas d'utilisation :

- CRUD vidéo ;
- `GenerateVideoUseCase.ts`.

`GenerateVideoUseCase` reçoit :

```ts
{
  videoId: string;
  compositionId: string;
  outputPath: string;
}
```

### `package/domain/`

Cette couche contient les implémentations métier des use cases :

- `CreateVideoUseCaseImpl.ts`
- `GetVideoUseCaseImpl.ts`
- `UpdateVideoUseCaseImpl.ts`
- `DeleteVideoUseCaseImpl.ts`
- `GenerateVideoUseCaseImpl.ts`

Le domaine dépend des contrats Core, jamais des implémentations concrètes du filesystem ou de Remotion.

### `package/data/`

Cette couche contient la persistance concrète.

#### `package/data/database/LocalVideoStore.ts`

Stocke les vidéos dans `data/videos.json`.

Il :

- crée une vidéo ;
- lit une vidéo ;
- modifie une vidéo ;
- supprime une vidéo ;
- convertit les dates JSON en objets `Date`.

#### `package/data/repositories/`

Les repositories concrets délèguent au `LocalVideoStore` :

- `CreateVideoRepositoryImpl.ts`
- `GetVideoRepositoryImpl.ts`
- `UpdateVideoRepositoryImpl.ts`
- `DeleteVideoRepositoryImpl.ts`

### `package/services/video-engine/`

Cette couche contient les contrats et implémentations spécifiques au moteur vidéo.

#### Contrats

- `contracts/VideoEngine.ts` : façade principale du moteur.
- `contracts/WorkspaceManager.ts` : création, récupération et résolution de chemins workspace.
- `contracts/VideoBundler.ts` : contrat du bundling.
- `contracts/VideoRenderer.ts` : contrat du rendu.

#### Modèles

- `models/VideoWorkspace.ts` : identifiant et chemin d'un workspace.
- `models/RenderVideoInput.ts` : `videoId`, `compositionId` et `outputPath`.

#### `VideoEngineImpl.ts`

C'est une façade d'orchestration. Elle :

1. récupère le workspace ;
2. détermine `composition/MainVideo.tsx` ;
3. demande le bundling ;
4. demande le rendu ;
5. transforme les succès ou erreurs en modèle `Render`.

Elle ne contient pas directement les appels Remotion détaillés.

#### `GenerateVideoServiceImpl.ts`

Adaptateur entre le contrat Core `GenerateVideoService` et `VideoEngine`.

Il délègue la génération au moteur vidéo.

#### `runtime/RemotionBundlerImpl.ts`

Encapsule l'appel à `@remotion/bundler`.

#### `runtime/RemotionRendererImpl.ts`

Encapsule :

- `selectComposition` ;
- `renderMedia` ;
- le codec H.264 ;
- le chemin de sortie.

#### `workspace/WorkspaceManagerImpl.ts`

Sécurise les workspaces :

```text
package/services/video-engine/workspace/<videoId>/
```

Il empêche les chemins qui sortent du workspace.

### `package/services/mcp/`

Cette couche expose les capacités au client IA.

#### `Server.ts`

C'est le serveur MCP applicatif. Il reçoit par injection :

- l'instance `McpServer` ;
- le transport stdio ;
- les Tools.

Son constructeur enregistre les Tools. Sa méthode `start()` connecte le serveur au transport.

#### `WorkspaceFileService.ts`

Centralise les opérations filesystem sécurisées :

- lire ;
- écrire ;
- mettre à jour ;
- supprimer ;
- créer un dossier ;
- inspecter un dossier ;
- inspecter un asset.

Il utilise `WorkspaceManager` pour empêcher les sorties de workspace.

#### `WorkspaceExecutionService.ts`

Exécute uniquement une liste blanche de commandes `pnpm`.

Commandes autorisées :

- `pnpm --version` ;
- `pnpm -v` ;
- `pnpm exec tsc` ;
- `pnpm exec tsx` ;
- `pnpm exec remotion`.

Les métacaractères shell, arguments vides et arguments trop longs sont refusés.

Sous Windows, `pnpm` devient `pnpm.cmd`.

#### `RenderResultStore.ts`

Persiste les résultats dans :

```text
data/renders.json
```

Cela permet à `get_render_result` de retrouver un rendu après recréation du service ou redémarrage du serveur.

## 4. Les MCP Tools

Les Tools sont des capacités simples. Ils ne prennent pas de décisions créatives.

- `inspect_directory` : liste le contenu d'un dossier workspace.
- `create_directory` : crée un dossier dans un workspace.
- `read_file` : lit un fichier.
- `write_file` : crée ou écrit un fichier.
- `update_file` : met à jour un fichier existant.
- `delete_file` : supprime un fichier ou dossier.
- `inspect_asset` : lit les métadonnées d'un asset.
- `execute_code` : exécute une commande autorisée.
- `render_video` : bundle et rend une composition.
- `get_render_result` : récupère un résultat persistant.

### Règle de rendu

Les sources sont dans :

```text
package/services/video-engine/workspace/<videoId>/composition/MainVideo.tsx
```

Le rendu final est dans le dossier racine :

```text
output/<nom-du-fichier>.mp4
```

`RenderVideoTool` n'accepte que les chemins commençant par `output/` et empêche les sorties hors de ce dossier.

## 5. Structure Remotion obligatoire

Le VideoEngine bundle toujours :

```text
workspace/<videoId>/composition/MainVideo.tsx
```

Le fichier doit :

1. importer Remotion ;
2. définir le composant vidéo ;
3. définir une `Composition` avec :
   - `id="MainVideo"` ;
   - `component` ;
   - `durationInFrames` ;
   - `fps` ;
   - `width` ;
   - `height` ;
4. appeler `registerRoot(...)`.

Exemple minimal :

```tsx
import { AbsoluteFill, Composition, registerRoot } from "remotion";

const MainVideo = () => (
  <AbsoluteFill style={{ backgroundColor: "#111827" }} />
);

const Root = () => (
  <Composition
    id="MainVideo"
    component={MainVideo}
    durationInFrames={30}
    fps={30}
    width={320}
    height={180}
  />
);

registerRoot(Root);
```

Pour 15 secondes à 30 fps :

```text
durationInFrames = 15 × 30 = 450
```

## 6. `Container.ts`

`Container.ts` est le composition root.

Il :

1. calcule les chemins racine ;
2. enregistre les valeurs de configuration ;
3. enregistre les repositories ;
4. enregistre les use cases ;
5. enregistre le workspace manager ;
6. enregistre le VideoEngine ;
7. crée le serveur MCP ;
8. crée le transport stdio ;
9. enregistre les Tools ;
10. enregistre `McpVideoServer`.

Awilix utilise `InjectionMode.CLASSIC`. Les noms des paramètres de constructeurs doivent donc correspondre exactement aux noms des registrations.

Exemples :

```text
WorkspaceManagerImpl(workspaceRoot)
RenderResultStore(renderStorePath)
RenderVideoTool(videoEngine, renderResultStore, outputRoot)
McpVideoServer(mcpServer, transport, ...)
```

Les services, Tools et serveurs ne doivent pas créer leurs dépendances avec `new`.

## 7. Les deux fichiers `Server`

### `Server.ts` à la racine

C'est le point d'entrée du processus Node lancé par Claude Desktop, Codex ou un autre client MCP.

```ts
import { container } from "./Container.js";

const server = container.resolve("mcpVideoServer");
await server.start();
```

Il ne contient pas la logique des Tools. Il résout le serveur depuis le container et le démarre.

### `package/services/mcp/Server.ts`

C'est l'implémentation applicative de `McpVideoServer`.

Il :

- reçoit le serveur MCP et le transport ;
- reçoit les Tools injectés ;
- les enregistre ;
- appelle `mcpServer.connect(transport)`.

La séparation est volontaire :

```text
Server.ts racine
→ démarrage du processus

package/services/mcp/Server.ts
→ assemblage et démarrage du serveur MCP
```

## 8. Le dossier `package/services/mcp/client/`

### `McpStdioClient.ts`

Ce fichier est un client MCP générique basé sur le SDK officiel :

```text
@modelcontextprotocol/client
```

Il expose :

- `connect()` ;
- `listTools()` ;
- `callTool({ name, arguments })` ;
- `close()`.

`McpStdioClient` ne construit pas lui-même le SDK, le transport ou une autre dépendance. Il reçoit `Client` et `Transport` par injection. La composition du client MCP doit être faite par le composition root de l'application qui l'utilise. Aucun factory concret contenant des `new` ne doit être ajouté dans ce dossier.

Il sert surtout :

- aux smoke tests ;
- à une future application de chat ;
- à tout client Node voulant appeler ce serveur MCP.

Il ne contient aucune intelligence créative et ne dépend d'aucun fournisseur IA.

Claude Desktop et Codex CLI n'utilisent pas obligatoirement cette classe : ils utilisent directement leur propre client MCP, en lançant le même serveur stdio.

## 9. Lancement du serveur MCP

### PowerShell

```powershell
pnpm.cmd --dir "C:\Users\PROMOPlus\Documents\video-saas" exec tsx "C:\Users\PROMOPlus\Documents\video-saas\Server.ts"
```

### Claude Desktop

Configuration :

```json
{
  "mcpServers": {
    "video-saas": {
      "command": "pnpm.cmd",
      "args": [
        "--dir",
        "C:\\Users\\PROMOPlus\\Documents\\video-saas",
        "exec",
        "tsx",
        "C:\\Users\\PROMOPlus\\Documents\\video-saas\\Server.ts"
      ]
    }
  }
}
```

Après modification, redémarrer complètement Claude Desktop.

### Codex CLI

```powershell
codex.cmd mcp add video-saas -- pnpm.cmd --dir "C:\Users\PROMOPlus\Documents\video-saas" exec tsx "C:\Users\PROMOPlus\Documents\video-saas\Server.ts"
```

Pour utiliser les Tools qui écrivent :

```powershell
codex.cmd --approve-for-me -C "C:\Users\PROMOPlus\Documents\video-saas"
```

Dans cette version de Codex, `--approve-for-me` ne doit pas être combiné avec `--sandbox`.

## 10. Cycle complet d'une demande

Exemple : publicité de 15 secondes.

```text
Utilisateur
  ↓
Claude comprend la demande
  ↓
Claude appelle create_directory(videoId, "composition")
  ↓
Claude appelle write_file(..., "composition/MainVideo.tsx")
  ↓
Le serveur écrit dans le workspace sécurisé
  ↓
Claude appelle render_video(..., "output/video01.mp4")
  ↓
VideoEngine bundle MainVideo.tsx
  ↓
Remotion sélectionne MainVideo
  ↓
Remotion encode le MP4
  ↓
RenderResultStore sauvegarde data/renders.json
  ↓
Claude appelle get_render_result(renderId)
  ↓
Claude répond à l'utilisateur
```

En cas d'erreur :

1. `render_video` retourne un résultat `failed` ;
2. l'IA lit l'erreur ;
3. elle corrige uniquement `MainVideo.tsx` ;
4. elle peut relancer un rendu ;
5. elle récupère le résultat final.

## 11. Configuration importante

- Projet Node ESM : `"type": "module"`.
- TypeScript : `NodeNext`.
- Imports relatifs compilés : utiliser `.js`.
- Windows : utiliser `pnpm.cmd`, pas `pnpm` dans PowerShell.
- MCP serveur : `@modelcontextprotocol/server`.
- MCP client générique : `@modelcontextprotocol/client`.
- DI : Awilix en `InjectionMode.CLASSIC`.
- Rendu : Remotion 4.
- Codec : H.264.
- Persistance vidéo : `data/videos.json`.
- Persistance rendus : `data/renders.json`.
- Sources vidéo : `package/services/video-engine/workspace/<videoId>/`.
- Sorties finales : `output/`.

## 12. Erreurs importantes déjà rencontrées

### `registerRoot` absent

Remotion refuse un point d'entrée qui ne contient pas `registerRoot`.

Solution : enregistrer la racine dans `MainVideo.tsx`.

### Mauvais point d'entrée

Le moteur n'utilise pas `src/Root.tsx` ou `src/index.ts`.

Solution : toujours utiliser `composition/MainVideo.tsx`.

### Mauvais chemin de sortie

Le rendu ne doit pas être placé dans le workspace.

Solution : utiliser `output/<nom>.mp4`, à la racine du repository.

### `pnpm` non reconnu sous Windows

Solution : utiliser `pnpm.cmd`.

### `spawn EINVAL` avec un fichier `.cmd`

Pour un client Node de test sous Windows, utiliser le transport stdio officiel ou lancer le processus avec une configuration compatible Windows (`shell: true` dans les tests Node).

### Inspection excessive par l'agent

La solution est [AGENTS.md](C:/Users/PROMOPlus/Documents/video-saas/AGENTS.md), qui impose :

- lecture exclusive de ses propres consignes ;
- utilisation des Tools MCP ;
- interdiction de lire tout le projet ;
- un seul rendu ;
- correction limitée ;
- arrêt après la tâche.

## 13. Validation actuelle

Les validations réalisées comprennent :

- handshake MCP stdio ;
- découverte des 10 Tools ;
- appels filesystem réels ;
- appels depuis Codex CLI ;
- rendu en échec puis correction ;
- rendu Remotion final ;
- récupération via `get_render_result` ;
- persistance des rendus ;
- sortie finale dans le dossier racine `output/` ;
- `pnpm.cmd typecheck`.

## 14. Règle d'exploitation

Le serveur MCP fournit des capacités. L'IA externe prend les décisions.

Il ne faut pas :

- ajouter une logique créative dans les Tools ;
- faire dépendre le backend de Claude, Codex ou Gemini ;
- mélanger les fichiers du workspace avec les fichiers du projet ;
- permettre une commande shell arbitraire ;
- contourner les restrictions de chemins ;
- modifier la configuration globale pour résoudre une erreur locale de composition.
