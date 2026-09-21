# Vue d’ensemble du projet

`Video SaaS` est un backend de génération vidéo piloté par une IA externe via **MCP**.

L’IA externe ne produit pas directement le MP4. Elle utilise les Tools MCP du serveur pour :

1. créer un projet vidéo ;
2. enregistrer un brief libre ;
3. importer des assets ;
4. faire valider le projet ;
5. générer éventuellement une voix off ;
6. créer une timeline audio ;
7. écrire une composition Remotion dans le workspace ;
8. demander le rendu ;
9. récupérer le résultat.

L’architecture actuelle est organisée autour de quatre responsabilités principales :

```text
IA externe
   ↓ MCP / stdio
Tools MCP
   ↓
Use Cases
   ↓
Repositories / services techniques
   ↓
Stockage JSON, filesystem, ElevenLabs, Remotion
```

---

# 1. Racine du projet

## `Server.ts`

C’est le point d’entrée du serveur MCP.

Son rôle est très limité :

```ts
const server = container.resolve<McpVideoServer>("mcpVideoServer");
await server.start();
```

Il :

1. importe le conteneur d’injection ;
2. récupère l’instance de `McpVideoServer` ;
3. démarre la communication MCP avec le transport `stdio`.

L’IA externe démarre ce fichier avec :

```powershell
pnpm.cmd exec tsx Server.ts
```

Le serveur ne doit pas afficher de logs applicatifs sur `stdout`, car `stdout` est utilisé par le protocole MCP.

---

## `Container.ts`

C’est le **composition root** du projet.

Il configure Awilix et relie toutes les abstractions à leurs implémentations :

```text
Interface / contrat
        ↓
Implémentation concrète
        ↓
Enregistrement dans Container.ts
        ↓
Injection automatique dans les classes
```

Exemples :

```ts
videoBriefRepository: asClass(VideoBriefRepositoryImpl).singleton()
voiceService: asClass(VoiceServiceImpl).singleton()
videoEngine: asClass(VideoEngineImpl).singleton()
```

Le conteneur assemble :

- les repositories ;
- les services audio ;
- les services filesystem ;
- le moteur vidéo ;
- les Use Cases ;
- les Tools MCP ;
- le serveur MCP.

Il centralise également les chemins :

```text
data/video-briefs.json
data/asset-manifests.json
data/voice-overs.json
data/audio-timelines.json
data/production-plans.json
data/renders.json
output/
package/services/video-engine/workspace/
```

---

## `package.json`

Décrit les dépendances et les commandes principales :

```text
pnpm run dev       → démarre le serveur avec tsx
pnpm run build     → compile TypeScript
pnpm run typecheck → vérifie les types sans générer de fichiers
```

Les principales dépendances sont :

- `@modelcontextprotocol/server` : serveur MCP ;
- `@modelcontextprotocol/client` : client MCP générique éventuel ;
- `awilix` : injection de dépendances ;
- `remotion` : compositions vidéo ;
- `@remotion/bundler` : bundling des compositions ;
- `@remotion/renderer` : rendu MP4 ;
- `zod` : validation des entrées des Tools MCP ;
- `tsx` : exécution TypeScript directe.

---

## `AGENTS.md`

Ce fichier contient les règles opérationnelles pour l’IA externe.

Il décrit :

- la configuration MCP ;
- le transport `stdio` ;
- le flux de pré-production ;
- les règles de gestion des assets ;
- les extensions de fichiers obligatoires ;
- les polices disponibles ;
- les règles de synchronisation voix/vidéo ;
- les actions interdites ;
- le flux de rendu Remotion.

Il est actuellement la principale documentation comportementale destinée à l’agent qui utilise les Tools MCP.

---

## `PROJECT3.md`

C’est la mémoire technique du projet V3.

Il documente :

- l’évolution de l’architecture ;
- la génération audio ;
- ElevenLabs ;
- les problèmes historiques de rendu Remotion ;
- la gestion du staging ;
- les polices ;
- les décisions de simplification ;
- les couches supprimées ;
- les conventions d’architecture.

Certaines sections anciennes décrivent encore des étapes historiques ou des décisions précédentes. La structure actuelle du code et la section d’état final doivent être considérées comme la référence réelle.

---

## `PROJECT.md`

C’est le document de conception historique du projet.

Il contient notamment :

- la vision initiale ;
- l’architecture cible précédente ;
- les premières décisions MCP ;
- les explications sur le serveur externe ;
- des traces de l’ancien client MCP interne.

Il est utile pour comprendre l’historique, mais il contient des éléments qui ne correspondent plus entièrement à l’architecture actuelle, comme l’ancien `VideoPlan` ou `McpStdioClient`.

---

## `PROJECT2.md`

Document historique lié aux versions précédentes du pipeline V2.

Il ne représente pas nécessairement l’état réel actuel du code.

---

## `resume.md`

Fichier de résumé ou de reprise du projet. Il sert à conserver une synthèse opérationnelle des travaux précédents.

---

# 2. Couche `core`

Le dossier `core/` contient les éléments partagés entre les différentes couches.

Il ne dépend normalement pas de l’infrastructure concrète comme :

- Node.js ;
- ElevenLabs ;
- Remotion ;
- MCP ;
- le stockage JSON.

Il contient principalement :

```text
core/
├── models/
├── repository/
├── service/
└── use-case/
```

---

# 3. `core/models`

Le dossier `core/models/` contient les modèles métier partagés.

## `VideoBrief.ts`

Représente la demande vidéo principale.

Il contient :

```ts
{
  id,
  prompt,
  assetIds,
  status,
  createdAt,
  updatedAt
}
```

Le champ important est `prompt`.

Le système n’impose plus :

- de type de vidéo ;
- de formulaire produit ;
- de champs `problem`, `solution`, `company`, etc. ;
- de catalogue de formats métier.

Le prompt libre transmis par l’IA externe est la source principale de l’intention créative.

États principaux :

```text
incomplete
ready-for-confirmation
ready-for-generation
```

---

## `Asset.ts`

Représente un asset lié à une vidéo.

Un asset peut être :

- une image ;
- un logo ;
- une vidéo ;
- un fichier audio ;
- un autre fichier utilisé dans la composition.

Il contient notamment :

- son identifiant ;
- son `videoId` ;
- son nom ;
- son chemin ;
- son type ;
- ses métadonnées ;
- ses dates.

---

## `AssetManifest.ts`

Représente la liste des assets d’un projet vidéo.

```ts
{
  videoId,
  assets,
  updatedAt
}
```

Un projet possède un manifeste unique.

Il permet de vérifier que les assets appartiennent bien au bon `videoId`.

---

## `VoiceOver.ts`

Représente la voix off générée.

Il contient :

- le script ;
- le fournisseur ;
- le modèle ElevenLabs ;
- l’identifiant de voix ;
- la langue ;
- le chemin du MP3 ;
- `durationMs` ;
- `alignment` ;
- `segments` ;
- l’empreinte de génération ;
- le statut.

Les deux informations essentielles sont :

```text
durationMs
alignment / segments
```

`durationMs` indique la durée globale.

`alignment` contient un timing caractère par caractère.

`segments` devrait représenter des unités temporelles utilisables pour les scènes, généralement des mots ou des phrases.

---

## `AudioTimeline.ts`

Représente la timeline audio globale.

Elle regroupe :

- la voix off ;
- les segments de voix ;
- les pistes musicales ;
- la durée totale ;
- les dates de création et de mise à jour.

Elle ne crée pas directement les scènes visuelles. Elle fournit les données temporelles que la composition Remotion doit exploiter.

---

## `Music.ts`

Représente une piste musicale.

Elle contient notamment :

- le `videoId` ;
- l’asset associé ;
- le chemin du fichier ;
- la durée ;
- le début et la fin ;
- le volume ;
- le fade-in ;
- le fade-out ;
- la boucle ;
- le ducking pendant la narration.

---

## `ProductionPlan.ts`

Représente le plan de production audio final.

Il contient :

```ts
{
  id,
  videoId,
  voicePlan,
  musicPlan,
  audioTimeline,
  finalDurationMs,
  status,
  createdAt,
  updatedAt
}
```

Il ne contient plus de `VideoPlan`.

Le `ProductionPlan` est transmis à la composition Remotion comme `inputProps`.

---

## `Render.ts`

Représente le résultat d’un rendu.

Il conserve généralement :

- l’identifiant du rendu ;
- le `videoId` ;
- le chemin de sortie ;
- le statut ;
- les métadonnées du rendu ;
- les dates.

---

## `RenderVideoInput.ts`

Décrit les données nécessaires pour lancer un rendu :

```ts
{
  videoId,
  compositionId,
  outputPath,
  inputProps?
}
```

---

## `ValidationReport.ts`

Contient le résultat de validation d’un projet :

- statut ;
- possibilité de générer ;
- informations manquantes ;
- assets manquants ;
- avertissements.

---

## `VideoWorkspace.ts`

Représente les chemins du workspace d’une vidéo.

Le workspace contient notamment :

```text
workspace/<videoId>/
├── assets/
├── audio/
├── composition/
├── public/
└── autres fichiers générés
```

---

# 4. `core/repository`

Le dossier `core/repository/` contient les contrats de persistance.

Ce ne sont pas les implémentations.

Ils permettent au domaine de dire :

> J’ai besoin de sauvegarder ou de charger un objet métier.

sans savoir si les données sont stockées :

- dans JSON ;
- dans Firebase ;
- dans PostgreSQL ;
- dans Firestore ;
- dans une API distante.

C’est important pour la future migration vers Firebase.

## `VideoBriefRepository.ts`

Persiste et charge les briefs vidéo.

## `AssetManifestRepository.ts`

Persiste et charge les manifestes d’assets.

## `VoiceOverRepository.ts`

Persiste et charge les métadonnées des voix off.

## `AudioTimelineRepository.ts`

Persiste et charge les timelines audio.

## `ProductionPlanRepository.ts`

Persiste et charge les plans de production.

Il n’existe plus de repository `VideoPlan`.

---

# 5. `core/service`

## `WorkspaceManager.ts`

C’est le contrat partagé pour gérer les workspaces.

Il permet :

```ts
create(videoId)
get(videoId)
resolvePath(videoId, requestedPath)
```

Il est placé dans `core/service` car il est utilisé par plusieurs couches :

- Use Cases ;
- services audio ;
- services MCP ;
- moteur vidéo ;
- gestion des assets.

`resolvePath` est important pour empêcher qu’un chemin sorte du workspace de la vidéo.

---

# 6. `core/use-case`

Le dossier `core/use-case/` contient les contrats des cas d’utilisation.

Il définit ce que le système sait faire, sans définir comment.

## `CreateVideoProjectUseCase.ts`

Crée un nouveau projet vidéo.

## `UpdateVideoBriefUseCase.ts`

Met à jour le prompt et les assets associés au brief.

## `RegisterAssetUseCase.ts`

Enregistre un asset dans le workspace et le manifeste.

## `ValidateVideoProjectUseCase.ts`

Vérifie qu’un projet peut être confirmé.

## `ConfirmVideoProjectUseCase.ts`

Fait passer le brief à l’état `ready-for-generation`.

## `GenerateVoiceOverUseCase.ts`

Décrit la génération d’une voix off globale.

## `GetVoiceOverUseCase.ts`

Récupère les métadonnées de la voix off.

## `CreateProductionPlanUseCase.ts`

Construit le plan audio final.

## `GenerateVideoUseCase.ts`

Décrit le rendu direct d’une composition Remotion.

Il dépend maintenant directement du moteur vidéo, sans couche intermédiaire `GenerateVideoService`.

## `GenerateVideoProjectUseCase.ts`

Décrit la génération complète d’un projet confirmé.

---

# 7. Couche `package/domain`

Le dossier `package/domain/` contient les implémentations des Use Cases.

Cette couche orchestre le métier applicatif.

Elle ne contient pas les Tools MCP et ne connaît pas les détails du protocole MCP.

---

## `CreateVideoProjectUseCaseImpl.ts`

Effectue les opérations suivantes :

1. vérifie que `videoId` n’est pas vide ;
2. crée le workspace ;
3. crée un brief vide ;
4. crée un manifeste d’assets vide ;
5. persiste les deux objets.

---

## `UpdateVideoBriefUseCaseImpl.ts`

Met à jour le prompt libre du projet.

Il conserve les métadonnées existantes et modifie le statut du brief en fonction des données reçues.

---

## `RegisterAssetUseCaseImpl.ts`

Coordonne :

- l’import de l’asset ;
- sa copie dans le workspace ;
- sa vérification ;
- sa déclaration dans le manifeste ;
- l’association avec le `videoId`.

---

## `ValidateVideoProjectUseCaseImpl.ts`

Effectue directement la validation minimale.

Il vérifie :

```text
brief existant
manifest existant
prompt non vide
```

Les assets restent facultatifs et génèrent actuellement un avertissement si aucun asset n’est fourni.

Le précédent `VideoValidationService` a été supprimé car cette logique était trop petite pour justifier un service séparé.

---

## `ConfirmVideoProjectUseCaseImpl.ts`

1. charge le brief ;
2. appelle la validation ;
3. refuse la confirmation si le projet est incomplet ;
4. met le statut à `ready-for-generation`.

---

## `GenerateVoiceOverUseCaseImpl.ts`

Relie le contrat du Use Case à `VoiceServiceImpl.ts`.

---

## `GetVoiceOverUseCaseImpl.ts`

Charge une voix off depuis le repository.

Si la durée est absente, il peut mesurer le MP3 présent dans le workspace et réparer les métadonnées persistées.

---

## `CreateProductionPlanUseCaseImpl.ts`

Délègue la construction du plan à `ProductionPlanServiceImpl.ts`.

---

## `GenerateVideoUseCaseImpl.ts`

Appelle directement `VideoEngineImpl.ts`.

La couche inutile `GenerateVideoService` a été supprimée.

---

## `GenerateVideoProjectUseCaseImpl.ts`

Effectue les contrôles finaux avant le rendu :

1. vérifie que le brief existe ;
2. vérifie que le statut est `ready-for-generation` ;
3. charge le plan de production ;
4. vérifie que le plan est compatible avec un rendu ;
5. transmet le plan comme `inputProps` au moteur vidéo.

---

# 8. Couche `package/data`

Le dossier `package/data/` contient les implémentations des repositories.

Les implémentations sont directement dans `data`, sans sous-dossier `repositories`.

## `VideoBriefRepositoryImpl.ts`

Implémente le repository des briefs en utilisant `LocalVideoProjectStore.ts`.

## `AssetManifestRepositoryImpl.ts`

Implémente la persistance du manifeste d’assets.

## `VoiceOverRepositoryImpl.ts`

Implémente la persistance des métadonnées de voix off.

## `AudioTimelineRepositoryImpl.ts`

Implémente la persistance de la timeline audio.

## `ProductionPlanRepositoryImpl.ts`

Implémente la persistance du plan de production.

---

## `database/`

Contient le stockage JSON local.

### `LocalVideoProjectStore.ts`

C’est le stockage central local.

Il lit, écrit, sérialise et hydrate :

- les briefs ;
- les manifestes ;
- les voix off ;
- les timelines audio ;
- les plans de production.

Les dates sont converties :

```text
Date métier → chaîne ISO JSON
chaîne ISO JSON → Date métier
```

Ce stockage est conservé parce que les repositories pourront plus tard être remplacés par des implémentations Firebase sans modifier le domaine.

---

# 9. Couche `package/services`

Le dossier `package/services/` contient les services techniques.

```text
services/
├── asset/
├── audio/
├── mcp/
└── video-engine/
```

---

# 10. Service des assets

## `AssetService.ts`

Il gère l’import physique des assets.

Il accepte principalement :

```text
sourcePath
contentBase64
sourceUrl
```

Il :

1. vérifie l’origine de l’asset ;
2. conserve l’extension réelle ;
3. copie ou télécharge le fichier ;
4. le place dans le workspace du `videoId` ;
5. produit les métadonnées utilisées par le manifeste.

Les assets ne doivent jamais être mélangés entre deux workspaces.

---

# 11. Services audio

Le dossier `package/services/audio/` contient le pipeline vocal et musical.

## `contracts/ElevenLabsClient.ts`

C’est le contrat conservé pour l’intégration externe ElevenLabs.

Cette abstraction est utile parce qu’elle isole le fournisseur externe du reste de l’application.

Les anciens contrats internes :

- `VoiceService` ;
- `MusicService` ;
- `AudioTimelineService` ;
- `ProductionPlanService`

ont été supprimés car chacun ne possédait qu’une seule implémentation utile.

---

## `ElevenLabsClientImpl.ts`

Effectue les appels HTTP vers ElevenLabs.

Il gère :

- la synthèse vocale ;
- l’endpoint avec timestamps ;
- les paramètres de voix ;
- les tentatives ;
- l’alignement fournisseur ;
- la transcription Speech-to-Text ;
- la conversion de la réponse externe vers les modèles internes.

Son flux principal est :

```text
script
  ↓
ElevenLabs TTS
  ↓
audio_base64
  ↓
Buffer MP3
  ↓
durationMs + alignment
```

---

## `VoiceServiceImpl.ts`

Orchestre la génération de la voix off.

Il :

1. valide la demande ;
2. calcule une empreinte du script et des paramètres ;
3. cherche une voix existante ;
4. réutilise le cache si le résultat est valide ;
5. appelle ElevenLabs ;
6. écrit le MP3 dans :

```text
workspace/<videoId>/audio/voice-over.mp3
```

7. récupère l’alignement ;
8. utilise Speech-to-Text si l’alignement est absent ;
9. écrit les métadonnées dans :

```text
workspace/<videoId>/audio/voice-over.json
```

10. persiste le `VoiceOver`.

---

## `Mp3Duration.ts`

Mesure la durée réelle d’un MP3 en lisant ses trames MPEG.

Il sert de fallback lorsque ElevenLabs ne renvoie pas `durationMs`.

Cette durée est fiable pour la durée totale, mais elle ne permet pas à elle seule de construire une synchronisation scène par scène.

---

## `ElevenLabsTranscriptionMapper.ts`

Valide et convertit les mots horodatés issus du Speech-to-Text.

Il transforme une réponse fournisseur en segments internes :

```ts
{
  text,
  startMs,
  endMs,
  durationMs
}
```

---

## `MusicServiceImpl.ts`

Prépare une piste musicale.

Il vérifie :

- l’existence du fichier ;
- la durée ;
- le volume ;
- le fade-in ;
- le fade-out ;
- le loop ;
- le ducking.

Il ne rend pas la musique. Il construit sa configuration pour la timeline audio.

---

## `AudioTimelineServiceImpl.ts`

Construit la timeline audio.

Il vérifie :

- la présence d’une durée de voix ;
- la présence de segments horodatés ;
- l’appartenance au bon `videoId` ;
- le FPS ;
- les pistes musicales.

Il calcule :

```text
durée finale =
max(
  durée voix,
  durée cible,
  fin des pistes musicales
)
```

Puis :

```text
frames = round(seconds × fps)
```

Il produit :

- la timeline ;
- la durée voix en frames ;
- la durée finale en frames.

---

## `ProductionPlanServiceImpl.ts`

Assemble les éléments audio dans un `ProductionPlan`.

Il :

1. vérifie les appartenances au `videoId` ;
2. construit la timeline ;
3. génère une description de la voix ;
4. génère une description de la musique ;
5. calcule la durée finale ;
6. persiste ou met à jour le plan.

---

# 12. Couche MCP

Le dossier `package/services/mcp/` expose le backend à l’IA externe.

## `Server.ts`

Construit le serveur MCP applicatif.

Il reçoit toutes les dépendances injectées et enregistre les Tools :

- fichiers ;
- assets ;
- projets ;
- voix ;
- audio ;
- rendu.

Il ne contient pas la logique métier profonde.

---

## `contracts/McpTool.ts`

Contrat commun d’un Tool MCP.

Chaque Tool doit pouvoir s’enregistrer auprès de `McpServer`.

---

## `contracts/WorkspaceServices.ts`

Regroupe les types utilisés par les services MCP liés au workspace.

---

# 13. Tools MCP de projet

Chaque Tool MCP suit généralement ce schéma :

```text
Entrée JSON
   ↓
Validation Zod
   ↓
Appel du Use Case
   ↓
Sérialisation JSON
   ↓
Réponse MCP
```

## `CreateVideoProjectTool.ts`

Expose la création d’un projet vidéo.

## `UpdateVideoBriefTool.ts`

Expose la mise à jour du prompt libre.

## `ValidateVideoProjectTool.ts`

Expose la validation du projet.

## `ConfirmVideoProjectTool.ts`

Expose la confirmation du projet avant génération.

---

# 14. Tools MCP audio

## `GenerateVoiceOverTool.ts`

Reçoit :

```text
videoId
script
voiceId
language
model
outputFormat
voiceSettings
```

Puis appelle le Use Case de génération.

## `GetVoiceOverTool.ts`

Retourne :

- le MP3 ;
- `durationMs` ;
- `alignment` ;
- `segments` ;
- le chemin audio ;
- les métadonnées ElevenLabs.

C’est cet outil que l’IA externe doit appeler après `generate_voice_over`.

## `CreateProductionPlanTool.ts`

Reçoit :

- `videoId` ;
- `voiceOver` ;
- les pistes musicales ;
- le FPS ;
- une durée cible éventuelle.

Puis crée le plan audio.

---

# 15. Tools MCP de génération et de rendu

## `GenerateVideoProjectTool.ts`

Expose la génération d’un projet confirmé.

Il reçoit :

```text
videoId
compositionId
outputPath
```

Il :

1. vérifie le chemin de sortie ;
2. appelle le Use Case de génération ;
3. sauvegarde le résultat dans `RenderResultStore` ;
4. retourne le résultat MCP.

---

## `RenderVideoTool.ts`

Expose le rendu direct d’une composition.

Il est plutôt destiné au flux V1 ou aux cas où l’agent a déjà préparé la composition.

---

## `GetRenderResultTool.ts`

Retourne le résultat d’un rendu précédemment enregistré.

---

## `RenderResultStore.ts`

Persiste les résultats de rendu dans :

```text
data/renders.json
```

---

## `RenderOutputPathResolver.ts`

Vérifie et normalise le chemin du MP4 final.

Le fichier final doit être sous :

```text
output/
```

---

# 16. Tools MCP filesystem et workspace

## `InspectDirectoryTool.ts`

Liste le contenu autorisé d’un workspace.

## `CreateDirectoryTool.ts`

Crée un répertoire dans le workspace.

## `ReadFileTool.ts`

Lit un fichier du workspace.

## `WriteFileTool.ts`

Crée ou remplace un fichier du workspace.

## `UpdateFileTool.ts`

Met à jour un fichier existant.

## `DeleteFileTool.ts`

Supprime un fichier autorisé du workspace.

## `ExecuteCodeTool.ts`

Exécute une commande autorisée dans le contexte du workspace.

Il doit rester contrôlé pour empêcher l’exécution arbitraire hors périmètre.

## `WorkspaceFileService.ts`

Centralise les opérations de lecture, écriture, suppression et inspection des fichiers.

## `WorkspaceExecutionService.ts`

Centralise l’exécution des commandes dans le workspace.

Sous Windows, il adapte notamment les commandes `.cmd`, comme `pnpm.cmd`.

---

# 17. Tools MCP d’assets

## `RegisterAssetTool.ts`

Expose l’import d’un asset depuis :

- un chemin Windows ;
- du Base64 ;
- une URL HTTP/HTTPS.

## `UploadAssetChunkTool.ts`

Permet l’import fragmenté d’un fichier volumineux.

## `InspectAssetTool.ts`

Inspecte les informations d’un asset enregistré.

---

# 18. Moteur vidéo

Le dossier `package/services/video-engine/` est responsable de la préparation, du bundling et du rendu Remotion.

```text
video-engine/
├── contracts/
├── fonts/
├── implementations/
└── workspace/
```

---

## `contracts/`

### `VideoEngine.ts`

Expose :

```text
getWorkspace(videoId)
render(input)
```

La méthode inutile `execute()` a été supprimée.

### `VideoBundler.ts`

Décrit l’opération de bundling Remotion.

### `VideoRenderer.ts`

Décrit l’opération de rendu final.

### `index.ts`

Réexporte les contrats du moteur.

---

## `fonts/`

Le dossier `fonts/` contient les polices embarquées :

- `Nunito-Regular.ttf` ;
- `Nunito-Bold.ttf` ;
- `Nunito-Italic.ttf` ;
- `Luckybones-Bold.otf`.

Ces polices sont copiées dans le staging Remotion :

```text
public/fonts/
```

Les compositions les chargent avec `staticFile(...)` et `@font-face`.

---

## `VideoEngineImpl.ts`

C’est l’orchestrateur du rendu vidéo.

Son flux est :

```text
workspace vidéo
   ↓
préparation d’un dossier public temporaire isolé
   ↓
copie des assets et des polices
   ↓
bundle Remotion
   ↓
selectComposition
   ↓
renderMedia
   ↓
MP4 final
   ↓
nettoyage du staging
```

Le staging temporaire est isolé par exécution pour éviter les collisions entre deux rendus concurrents.

---

## `RemotionBundlerImpl.ts`

Utilise `@remotion/bundler` pour transformer la composition TypeScript/React en bundle exécutable.

---

## `RemotionRendererImpl.ts`

Utilise `@remotion/renderer` pour :

1. sélectionner une composition ;
2. calculer ou vérifier ses dimensions ;
3. exécuter le rendu ;
4. produire le fichier MP4.

---

## `WorkspaceManagerImpl.ts`

Implémente `WorkspaceManager`.

Il gère :

- la création des répertoires ;
- la localisation d’un workspace ;
- la résolution sécurisée des chemins ;
- l’isolation par `videoId`.

---

# 19. Workspaces vidéo

Le dossier `workspace/` contient les fichiers propres à chaque vidéo.

Exemple :

```text
workspace/video07/
├── assets/
│   ├── logo.jpeg
│   └── background.mp3
├── audio/
│   ├── voice-over.mp3
│   └── voice-over.json
└── composition/
    └── MainVideo.tsx
```

Chaque workspace est isolé.

L’IA externe écrit généralement la composition dans :

```text
workspace/<videoId>/composition/MainVideo.tsx
```

La composition doit :

- appeler `registerRoot(...)` ;
- définir `MainVideo` ;
- définir `durationInFrames` ;
- définir `fps` ;
- définir `width` ;
- définir `height` ;
- charger les assets avec les bons chemins ;
- exploiter les `inputProps`.

---

# 20. Communication complète entre composants

## Étape 1 : démarrage

```text
IA externe
   ↓ lance
Server.ts
   ↓
Container.ts
   ↓
Awilix construit toutes les dépendances
   ↓
McpVideoServer.start()
   ↓
MCP stdio actif
```

---

## Étape 2 : création du projet

L’IA appelle :

```text
create_video_project
```

Flux :

```text
CreateVideoProjectTool
   ↓
CreateVideoProjectUseCaseImpl
   ↓
WorkspaceManager
   ↓ crée workspace/<videoId>
VideoBriefRepository
   ↓
LocalVideoProjectStore
   ↓ écrit data/video-briefs.json
AssetManifestRepository
   ↓
LocalVideoProjectStore
   ↓ écrit data/asset-manifests.json
```

---

## Étape 3 : mise à jour du brief

```text
update_video_brief
   ↓
UpdateVideoBriefTool
   ↓
UpdateVideoBriefUseCaseImpl
   ↓
VideoBriefRepository
   ↓
LocalVideoProjectStore
   ↓
data/video-briefs.json
```

---

## Étape 4 : import d’un asset

```text
register_asset
   ↓
RegisterAssetTool
   ↓
RegisterAssetUseCaseImpl
   ↓
AssetService
   ↓ copie vers workspace/<videoId>/assets
   ↓
AssetManifestRepository
   ↓
LocalVideoProjectStore
```

---

## Étape 5 : validation et confirmation

```text
validate_video_project
   ↓
ValidateVideoProjectTool
   ↓
ValidateVideoProjectUseCaseImpl
   ↓
VideoBriefRepository
AssetManifestRepository
   ↓
ValidationReport
```

Puis :

```text
confirm_video_project
   ↓
ConfirmVideoProjectTool
   ↓
ConfirmVideoProjectUseCaseImpl
   ↓
validation
   ↓
VideoBriefRepository.update(...)
   ↓
status = ready-for-generation
```

---

## Étape 6 : génération de la voix

```text
generate_voice_over
   ↓
GenerateVoiceOverTool
   ↓
GenerateVoiceOverUseCaseImpl
   ↓
VoiceServiceImpl
   ↓
ElevenLabsClientImpl
   ↓ HTTP ElevenLabs
   ↓
audio MP3 + alignment
   ↓
workspace/<videoId>/audio/voice-over.mp3
   ↓
workspace/<videoId>/audio/voice-over.json
   ↓
VoiceOverRepository
   ↓
data/voice-overs.json
```

Ensuite l’IA doit appeler :

```text
get_voice_over
```

pour récupérer :

- `durationMs` ;
- `alignment` ;
- `segments`.

---

## Étape 7 : production audio

```text
create_production_plan
   ↓
CreateProductionPlanTool
   ↓
CreateProductionPlanUseCaseImpl
   ↓
ProductionPlanServiceImpl
   ↓
AudioTimelineServiceImpl
   ↓
ProductionPlanRepository
   ↓
LocalVideoProjectStore
   ↓
data/audio-timelines.json
data/production-plans.json
```

---

## Étape 8 : écriture de la composition

L’IA utilise les Tools filesystem :

```text
create_directory
write_file
update_file
read_file
```

Elle écrit :

```text
workspace/<videoId>/composition/MainVideo.tsx
```

Cette composition est responsable de la mise en scène visuelle.

Le serveur fournit les données audio, mais c’est la composition qui doit décider :

- quelles scènes existent ;
- quand elles commencent ;
- combien de temps elles durent ;
- quels textes apparaissent ;
- quelles animations sont déclenchées ;
- comment les segments de voix influencent le mouvement.

---

## Étape 9 : génération du projet

```text
generate_video_project
   ↓
GenerateVideoProjectTool
   ↓
GenerateVideoProjectUseCaseImpl
   ↓
vérifie brief confirmé
   ↓
charge ProductionPlan
   ↓
ajoute productionPlan dans inputProps
   ↓
GenerateVideoUseCaseImpl
   ↓
VideoEngineImpl
```

---

## Étape 10 : rendu Remotion

```text
VideoEngineImpl
   ↓
copie des assets et polices
   ↓
RemotionBundlerImpl
   ↓
bundle
   ↓
RemotionRendererImpl
   ↓
renderMedia
   ↓
output/video.mp4
   ↓
RenderResultStore
   ↓
data/renders.json
```

---

# 21. Dossiers runtime

## `data/`

Contient les données persistées localement :

```text
video-briefs.json
asset-manifests.json
voice-overs.json
audio-timelines.json
production-plans.json
renders.json
```

Ce stockage est temporairement local. Les repositories permettent de remplacer plus tard ces fichiers par Firebase.

---

## `incoming/`

Dossier d’arrivée recommandé pour les fichiers utilisateur situés sur Windows.

Un fichier peut être copié ici avant d’être enregistré avec `register_asset`.

---

## `output/`

Contient uniquement les vidéos finales rendues.

Exemple :

```text
output/video01.mp4
```

---

## `peaks/`

Dossier technique ou expérimental lié aux fichiers audio et à l’analyse de signal.

Il ne fait pas partie du flux métier principal actuel.

---

## `skills/`

Contient des instructions spécialisées pour certaines capacités de l’agent, notamment :

- workspace ;
- génération vidéo ;
- règles Remotion.

---

# 22. Point important sur le synchronisme voix/vidéo

Le système gère correctement :

```text
durée totale de la voix
```

Il gère partiellement :

```text
alignement caractère par caractère
mots horodatés Speech-to-Text
segments audio
```

Mais il ne produit pas automatiquement une chorégraphie visuelle complète.

La composition Remotion doit transformer les données audio en décisions visuelles :

```text
segments audio
   ↓
groupement en phrases ou idées
   ↓
scènes narratives
   ↓
animations
   ↓
transitions
   ↓
timing Remotion
```

C’est la principale raison pour laquelle certaines vidéos peuvent sembler statiques : l’IA externe reçoit les informations temporelles, mais elle doit encore les convertir en montage visuel dynamique.

Le backend garantit surtout :

- la durée réelle ;
- la présence d’un alignement ;
- l’isolation des assets ;
- la cohérence du `videoId` ;
- la préparation audio ;
- le rendu.

Il ne décide pas encore automatiquement du rythme artistique.

---

# 23. Simplifications déjà réalisées

Les éléments suivants ont été supprimés :

- ancien modèle CRUD `Video` ;
- catalogue de types de vidéos ;
- `VideoPlan` ;
- `CreateVideoPlanUseCase` ;
- `GetVideoPlanUseCase` ;
- Tools de planification vidéo ;
- `VideoPlanningService` ;
- `VideoValidationService` ;
- `GenerateVideoService` ;
- `VideoEngine.execute()` ;
- contrats audio internes à usage unique ;
- `McpStdioClient`.

Les éléments conservés volontairement sont :

- les repositories, pour la future migration Firebase ;
- `LocalVideoProjectStore`, comme stockage local actuel ;
- le contrat `ElevenLabsClient`, car il isole une intégration externe ;
- les Tools MCP ;
- le moteur Remotion ;
- les workspaces isolés par vidéo.

---

# 24. Résumé architectural final

```text
core/
  Définit les modèles et contrats métier.

package/domain/
  Implémente les Use Cases et orchestre le métier.

package/data/
  Implémente la persistance.

package/services/asset/
  Gère les fichiers utilisateur.

package/services/audio/
  Gère ElevenLabs, les voix, la musique et les timelines.

package/services/mcp/
  Traduit MCP vers les Use Cases.

package/services/video-engine/
  Prépare, bundle et rend les compositions Remotion.

Container.ts
  Assemble toutes les dépendances.

Server.ts
  Démarre le serveur MCP stdio.

workspace/<videoId>/
  Contient les fichiers isolés de chaque vidéo.

data/
  Contient la persistance JSON locale.

output/
  Contient les MP4 finaux.
```

Le flux global est donc :

```text
IA externe
  → MCP
  → Tools
  → Use Cases
  → Repositories / services
  → JSON / filesystem / ElevenLabs / Remotion
  → MP4 final
```