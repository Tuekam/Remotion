# VIDEO-SAAS — PROJECT DIRECTIVE

## 1. Rôle de ce document

Ce fichier est la source de vérité du projet.

Tout agent IA, développeur ou contributeur qui intervient sur le projet doit lire ce document avant de modifier le code.

Il définit :

* la vision du projet ;
* les objectifs ;
* l'architecture validée ;
* les décisions techniques déjà prises ;
* les règles de développement ;
* l'état actuel du projet ;
* les tâches terminées ;
* les tâches restantes ;
* la prochaine tâche à réaliser.

Une décision déjà validée ne doit pas être remplacée ou réinventée sans raison technique claire.

Si une évolution importante est décidée pendant le développement, ce fichier doit être mis à jour.

---

# 2. Vision du projet

`video-saas` est un système de génération autonome de vidéos basé sur Remotion et piloté par des agents IA externes via MCP.

L'utilisateur fournit une demande en langage naturel, par exemple :

> Crée une publicité verticale de 15 secondes pour une agence digitale.

L'agent IA doit être capable de :

1. comprendre la demande ;
2. inspecter les ressources disponibles ;
3. analyser les assets ;
4. décider de la direction créative et technique ;
5. créer la structure du projet vidéo ;
6. générer le code Remotion ;
7. exécuter le code ;
8. détecter les erreurs ;
9. corriger automatiquement les erreurs ;
10. rendre la vidéo ;
11. vérifier le résultat ;
12. conserver le code source pour permettre des modifications ultérieures.

Le système ne doit pas dépendre d'un seul fournisseur d'IA.

Le même backend doit pouvoir être utilisé par différents agents IA compatibles avec MCP.

---

# 3. Principe fondamental

L'IA externe est le cerveau créatif et décisionnel.

`video-saas` fournit les capacités nécessaires pour agir sur le projet.

Architecture conceptuelle :

Utilisateur
↓
IA externe
↓
MCP
↓
Backend
↓
Workspace vidéo
↓
Code Remotion
↓
Exécution
↓
Correction
↓
Rendu
↓
output/[video-id].mp4

Le backend ne doit pas devenir lui-même un agent IA obligatoire.

---

# 4. Objectif de la V1

La V1 doit permettre à une IA externe de produire une vidéo Remotion de manière autonome à partir d'une demande utilisateur.

La V1 doit permettre :

* inspection du workspace ;
* inspection des assets ;
* création de fichiers ;
* lecture de fichiers ;
* modification de fichiers ;
* suppression de fichiers ;
* création de dossiers ;
* exécution de code ;
* rendu Remotion ;
* récupération du résultat du rendu ;
* correction autonome des erreurs ;
* conservation du workspace ;
* conservation de la vidéo finale.

---

# 5. Ce qui n'est PAS dans la V1

Les fonctionnalités suivantes ne font pas partie de la première version :

* frontend SaaS ;
* authentification ;
* utilisateurs ;
* équipes ;
* abonnement ;
* paiement ;
* Firebase actif ;
* Firestore actif ;
* Redis ;
* BullMQ ;
* système de queue ;
* microservices ;
* génération locale d'un LLM ;
* dépendance obligatoire à OpenAI ;
* dépendance obligatoire à Mistral ;
* dépendance obligatoire à Gemini ;
* catalogue de templates vidéo ;
* catalogue prédéfini de scènes ;
* catalogue prédéfini d'animations ;
* catalogue prédéfini de transitions.

Ces fonctionnalités pourront être ajoutées ultérieurement.

---

# 6. Principe de génération vidéo

Le système ne doit pas imposer un template vidéo prédéfini.

L'IA décide elle-même :

* du format ;
* de la durée ;
* du FPS ;
* de la résolution ;
* de la direction artistique ;
* des couleurs ;
* de la typographie ;
* de la composition ;
* des scènes ;
* des animations ;
* des transitions ;
* des layouts ;
* des backgrounds ;
* de l'utilisation des assets.

Si l'utilisateur impose une contrainte, l'IA doit la respecter.

Si aucune contrainte n'est donnée, l'IA décide elle-même.

---

# 7. Code comme source de vérité

Le code Remotion généré est la source de vérité de la vidéo.

La vidéo finale MP4 est un résultat du code.

Le système ne doit donc pas considérer le MP4 comme la source principale.

Pour modifier une vidéo existante :

1. retrouver son workspace ;
2. lire son code ;
3. comprendre sa structure ;
4. modifier les fichiers nécessaires ;
5. exécuter ;
6. corriger les erreurs ;
7. rendre une nouvelle version.

---

# 8. Architecture validée

L'architecture est Layer-First.

Elle n'utilise pas de dossier `src/`.

Architecture validée :

```text
video-saas/
│
├── core/
│   ├── repository/
│   │   ├── CreateVideoRepository.ts
│   │   ├── GetVideoRepository.ts
│   │   ├── UpdateVideoRepository.ts
│   │   └── DeleteVideoRepository.ts
│   │
│   ├── use-case/
│   │   ├── CreateVideoUseCase.ts
│   │   ├── GetVideoUseCase.ts
│   │   ├── UpdateVideoUseCase.ts
│   │   ├── DeleteVideoUseCase.ts
│   │   └── GenerateVideoUseCase.ts
│   │
│   └── models/
│       ├── Video.ts
│       └── Render.ts
│
├── package/
│   ├── domain/
│   │   ├── CreateVideoUseCaseImpl.ts
│   │   ├── GetVideoUseCaseImpl.ts
│   │   ├── UpdateVideoUseCaseImpl.ts
│   │   ├── DeleteVideoUseCaseImpl.ts
│   │   └── GenerateVideoUseCaseImpl.ts
│   │
│   ├── data/
│   │   ├── repositories/
│   │   │   ├── CreateVideoRepositoryImpl.ts
│   │   │   ├── GetVideoRepositoryImpl.ts
│   │   │   ├── UpdateVideoRepositoryImpl.ts
│   │   │   └── DeleteVideoRepositoryImpl.ts
│   │   │
│   │   └── database/
│   │       └── Firebase.ts
│   │
│   └── services/
│       ├── video-engine/
│       │   ├── runtime/
│       │   │   ├── remotion.config.ts
│       │   │   └── ...
│       │   │
│       │   └── workspace/
│       │       └── [video-id]/
│       │           ├── composition/
│       │           ├── scenes/
│       │           ├── animations/
│       │           ├── transitions/
│       │           ├── layouts/
│       │           ├── backgrounds/
│       │           ├── themes/
│       │           ├── assets/
│       │           └── ...
│       │
│       └── mcp/
│           ├── tools/
│           │   ├── InspectDirectoryTool.ts
│           │   ├── CreateDirectoryTool.ts
│           │   ├── ReadFileTool.ts
│           │   ├── WriteFileTool.ts
│           │   ├── UpdateFileTool.ts
│           │   ├── DeleteFileTool.ts
│           │   ├── InspectAssetTool.ts
│           │   ├── ExecuteCodeTool.ts
│           │   ├── RenderVideoTool.ts
│           │   └── GetRenderResultTool.ts
│           │
│           └── Server.ts
│
├── output/
│   └── [video-id].mp4
│
├── Container.ts
├── Server.ts
├── PROJECT.md
├── package.json
├── tsconfig.json
└── ...
```

Cette architecture est validée et ne doit pas être transformée en Feature-First sans raison architecturale majeure.

---

# 9. Responsabilité de Core

`core/` contient les contrats et modèles indépendants des technologies concrètes.

Il ne doit pas dépendre directement :

* de Firebase ;
* de Remotion ;
* de MCP ;
* de Node.js ;
* du filesystem concret ;
* d'un fournisseur d'IA.

---

# 10. Repository

Les repositories du Core représentent les contrats d'accès aux vidéos.

Ils définissent ce que l'application peut demander au stockage.

Les implémentations concrètes se trouvent dans :

```text
package/data/repositories/
```

La logique métier ne doit pas instancier directement les repositories.

Les dépendances doivent être injectées.

---

# 11. Domain

`package/domain/` contient les implémentations des use cases.

Le domaine contient notamment :

* création d'une vidéo ;
* récupération d'une vidéo ;
* modification d'une vidéo ;
* suppression d'une vidéo ;
* génération d'une vidéo.

Le domaine ne doit pas contenir de dépendance directe vers une infrastructure concrète.

---

# 12. Data

`package/data/` contient les implémentations concrètes de stockage.

La V1 utilise actuellement le filesystem local pour les workspaces et les rendus.

Firebase est prévu pour une évolution future.

`Firebase.ts` représente une infrastructure future et ne signifie pas que Firebase doit être activé dans la V1.

---

# 13. VideoEngine

Le VideoEngine est responsable de l'exécution de l'environnement vidéo.

Il utilise Remotion.

Il doit notamment permettre :

* de travailler dans un workspace vidéo ;
* de charger le code Remotion ;
* d'exécuter le code ;
* de lancer un rendu ;
* de récupérer le résultat ;
* de gérer les erreurs Remotion.

Remotion est un moteur d'exécution/rendu.

Remotion n'est pas le cerveau créatif du système.

---

# 14. Workspace

Chaque vidéo possède son propre workspace.

Structure :

```text
package/services/video-engine/workspace/[video-id]/
```

Le workspace contient le code source de la vidéo et ses ressources.

Une composition principale doit être présente :

```text
composition/MainVideo.tsx
```

Les dossiers suivants constituent une organisation structurelle :

```text
composition/
scenes/
animations/
transitions/
layouts/
backgrounds/
themes/
assets/
```

L'IA peut créer d'autres fichiers ou sous-dossiers à l'intérieur du workspace si nécessaire.

Ces dossiers ne constituent PAS un catalogue de composants prédéfinis.

---

# 15. Aucun catalogue de templates

Le projet ne doit pas fournir de catalogue imposé comme :

```text
HeroScene
CTAScene
FadeIn
SlideUp
ModernTemplate
BusinessTemplate
```

L'IA doit être libre de créer le code dont elle a besoin.

Les conventions de dossiers servent uniquement à organiser le workspace.

---

# 16. MCP

MCP est l'interface d'action entre l'IA externe et le backend.

MCP signifie ici :

> donner à l'agent les capacités nécessaires pour agir sur le projet.

Un MCP Tool représente une capacité.

Exemple :

```text
ReadFileTool
```

signifie :

> l'agent peut lire un fichier.

Le tool ne doit pas devenir le cerveau de l'agent.

Les MCP Tools doivent rester focalisés sur leur responsabilité.

---

# 17. MCP Tools prévus

Les outils prévus sont :

```text
InspectDirectoryTool
CreateDirectoryTool
ReadFileTool
WriteFileTool
UpdateFileTool
DeleteFileTool
InspectAssetTool
ExecuteCodeTool
RenderVideoTool
GetRenderResultTool
```

Responsabilités :

```text
InspectDirectoryTool
→ inspecter un workspace autorisé

CreateDirectoryTool
→ créer un dossier

ReadFileTool
→ lire un fichier

WriteFileTool
→ créer/écrire un fichier

UpdateFileTool
→ modifier un fichier

DeleteFileTool
→ supprimer un fichier

InspectAssetTool
→ inspecter une ressource

ExecuteCodeTool
→ exécuter une action/code autorisé

RenderVideoTool
→ lancer un rendu Remotion

GetRenderResultTool
→ récupérer l'état/résultat du rendu
```

---

# 18. Sécurité MCP

`ExecuteCodeTool` est considéré comme une capacité sensible.

Le système devra progressivement limiter :

* les commandes autorisées ;
* les chemins accessibles ;
* les fichiers modifiables ;
* les suppressions ;
* l'accès aux secrets ;
* les ressources accessibles hors workspace.

Chaque workspace doit être isolé.

Une isolation plus forte/sandbox sera nécessaire avant une utilisation SaaS publique.

---

# 19. Cycle autonome

Le cycle attendu de l'agent est :

```text
Comprendre
    ↓
Inspecter
    ↓
Planifier
    ↓
Créer
    ↓
Exécuter
    ↓
Observer
    ↓
Corriger
    ↓
Rendre
    ↓
Vérifier
```

L'agent doit pouvoir répéter :

```text
Exécuter
    ↓
Erreur
    ↓
Analyser
    ↓
Modifier
    ↓
Exécuter
```

jusqu'à obtenir un code valide.

Même principe pour le rendu :

```text
Render
   ↓
Render error
   ↓
Analyse
   ↓
Correction
   ↓
Render
```

---

# 20. Installation des dépendances

Dépendances actuellement installées :

```text
@modelcontextprotocol/server  2.0.0
@remotion/renderer            4.0.524
awilix                        13.0.5
react                         19.3.0
react-dom                     19.3.0
remotion                      4.0.524
zod                           4.5.4
```

Dépendances de développement :

```text
@remotion/cli                 4.0.524
@types/node                   26.5.1
@types/react                  19.3.0
@types/react-dom              19.3.0
tsx                           4.23.13
typescript                    7.0.2
```

Les packages Remotion doivent rester sur une version cohérente.

Les versions Remotion actuellement validées sont :

```text
remotion           4.0.524
@remotion/renderer 4.0.524
@remotion/cli      4.0.524
```

---

# 21. Technologies déjà validées

Les briques suivantes ont été testées :

```text
Node.js             ✓
pnpm                ✓
TypeScript          ✓
React               ✓
Remotion            ✓
Remotion CLI        ✓
@remotion/renderer  ✓
Zod                 ✓
Awilix installé     ✓
MCP SDK             ✓
MCP stdio           ✓
MCP tool execution  ✓
```

---

# 22. Test Remotion validé

Une composition de test a été créée temporairement.

Composition :

```text
MainVideo
```

Paramètres :

```text
1920 × 1080
30 FPS
150 frames
5 secondes
```

La commande suivante fonctionne :

```text
pnpm exec remotion compositions remotion-test/src/index.ts
```

Le renderer a également été testé avec succès.

Un fichier MP4 de test a été généré avec :

```text
@remotion/renderer
```

Cette validation confirme que la chaîne suivante fonctionne :

```text
Code React
    ↓
Remotion
    ↓
Composition
    ↓
@remotion/renderer
    ↓
MP4
```

---

# 23. Test MCP validé

Un serveur MCP temporaire a été créé dans :

```text
mcp-test/server.ts
```

Il expose actuellement un tool de test :

```text
hello
```

Le serveur utilise :

```text
serveStdio()
```

Le tool a été appelé avec succès via MCP Inspector CLI.

Test validé :

```text
Client MCP
    ↓
MCP Server
    ↓
hello
    ↓
name = Jules
    ↓
Hello Jules, Video SaaS MCP fonctionne.
```

Le test a confirmé que :

* le serveur démarre ;
* le transport stdio fonctionne ;
* le handshake fonctionne ;
* le tool est appelable ;
* les arguments sont validés ;
* une réponse MCP est retournée.

Le serveur MCP graphique Inspector avait rencontré un problème de configuration sous Windows, mais le test CLI officiel a fonctionné correctement.

---

# 24. État actuel du projet

## TERMINÉ

```text
[✓] Définition de la vision
[✓] Définition du fonctionnement global
[✓] Architecture Layer-First
[✓] Définition des responsabilités
[✓] Définition du VideoEngine
[✓] Définition du Workspace
[✓] Définition du rôle de MCP
[✓] Définition des MCP Tools
[✓] Projet pnpm initialisé
[✓] TypeScript configuré
[✓] Remotion installé
[✓] Remotion CLI installé
[✓] Remotion Renderer installé
[✓] Test Remotion réussi
[✓] Test Renderer réussi
[✓] MCP SDK installé
[✓] Test MCP stdio réussi
[✓] Appel d'un MCP Tool réussi
[✓] Nettoyer remotion-test
[✓] Nettoyer mcp-test
[✓] Finaliser package.json
[✓] Finaliser tsconfig.json
[✓] Finaliser PROJECT.md
[✓] Définir le système de Skills
[✓] Définir le format commun d'un Skill
[✓] Définir les règles destinées aux agents
[✓] Créer les premiers Skills
[✓] Définir le workflow autonome
[✓] Définir les règles Remotion
[✓] Définir les règles Workspace

---

# 25. EN COURS

```text
[ ] Finaliser les modèles `Video` et `Render`.
[ ] Définir les contrats des repositories.
[ ] Définir les contrats des use cases.
[ ] Définir les contrats des use cases.
```

---

# 26. À FAIRE

## Phase 3 — Architecture applicative

```text
[ ] Créer package/domain
[ ] Créer package/data
[ ] Créer package/services
```

## Phase 4 — VideoEngine

```text
[ ] Créer runtime
[ ] Créer workspace manager
[ ] Définir le contrat VideoEngine
[ ] Intégrer Remotion
[ ] Intégrer Renderer
[ ] Gestion des erreurs
```

## Phase 5 — MCP

```text
[ ] Créer MCP Server officiel
[ ] Créer InspectDirectoryTool
[ ] Créer CreateDirectoryTool
[ ] Créer ReadFileTool
[ ] Créer WriteFileTool
[ ] Créer UpdateFileTool
[ ] Créer DeleteFileTool
[ ] Créer InspectAssetTool
[ ] Créer ExecuteCodeTool
[ ] Créer RenderVideoTool
[ ] Créer GetRenderResultTool
```

## Phase 6 — Dependency Injection

```text
[ ] Créer Container.ts
[ ] Configurer Awilix
[ ] Connecter Core aux implémentations
[ ] Connecter Domain aux repositories
[ ] Connecter VideoEngine
[ ] Connecter MCP
```

## Phase 7 — Backend

```text
[ ] Créer Server.ts
[ ] Initialiser le container
[ ] Initialiser MCP
[ ] Vérifier les dépendances
```

## Phase 8 — Premier scénario réel

```text
[ ] Connecter une IA externe
[ ] Lire les Skills
[ ] Inspecter le workspace
[ ] Créer un workspace vidéo
[ ] Générer MainVideo.tsx
[ ] Exécuter le code
[ ] Corriger automatiquement une erreur
[ ] Rendre la vidéo
[ ] Vérifier le rendu
[ ] Sauvegarder output/[video-id].mp4
```

---

# 27. Ordre obligatoire de développement

Ne pas développer les composants dans un ordre arbitraire.

Ordre recommandé :

```text
PROJECT.md
    ↓
Skills
    ↓
Core
    ↓
Domain
    ↓
Data
    ↓
VideoEngine
    ↓
MCP Tools
    ↓
Container
    ↓
Server
    ↓
Test avec une IA externe
```

---

# 28. Règles pour les agents codeurs

Tout agent intervenant sur le projet doit :

1. Lire `PROJECT.md` avant de modifier le projet.
2. Respecter l'architecture validée.
3. Ne pas créer de `src/` sans décision explicite.
4. Ne pas créer de Feature-First sans décision explicite.
5. Ne pas ajouter de couches inutiles.
6. Ne pas introduire un service générique uniquement pour déplacer du code.
7. Ne pas créer de templates vidéo prédéfinis.
8. Ne pas imposer une direction artistique fixe.
9. Ne pas installer de dépendance sans nécessité.
10. Ne pas installer de package pendant l'exécution autonome d'un agent.
11. Utiliser les dépendances déjà installées.
12. Ne pas modifier une décision architecturale validée sans justification.
13. Garder chaque responsabilité dans le bon niveau.
14. Ne pas mettre de logique métier dans les MCP Tools.
15. Ne pas mettre de logique MCP dans le Core.
16. Ne pas mettre de logique Remotion dans le Core.
17. Ne pas faire dépendre le domaine d'une infrastructure concrète.
18. Utiliser l'injection de dépendances.
19. Garder `Server.ts` léger.
20. Mettre à jour `PROJECT.md` après une décision importante ou une étape majeure.

---

# 29. Dépendances et installation

L'agent autonome ne doit pas installer de nouveaux packages.

Il doit travailler avec les dépendances déjà présentes.

Si une nouvelle dépendance est techniquement nécessaire :

1. l'agent doit signaler le besoin ;
2. le développeur décide de son installation ;
3. l'architecture est ensuite mise à jour si nécessaire.

---

# 30. Stockage V1

La V1 utilise le filesystem local.

Workspace :

```text
package/services/video-engine/workspace/[video-id]/
```

Output :

```text
output/[video-id].mp4
```

Le dossier `output/` ne doit contenir que les vidéos finales rendues.

Le workspace contient le code source, les assets et les ressources nécessaires à la génération.

---

# 31. Firebase

Firebase n'est pas utilisé activement dans la V1.

Il est prévu comme évolution future.

Une migration future pourra remplacer le stockage local par Firebase/Firestore ou une autre infrastructure sans modifier inutilement la logique métier.

Cette possibilité repose sur :

* séparation Core / Data ;
* repositories ;
* injection de dépendances ;
* séparation des infrastructures.

---

# 32. États d'une vidéo

Les états prévus sont :

```text
draft
generating
executing
rendering
completed
failed
```

Ces états pourront évoluer si les besoins métier l'exigent.

---

# 33. Modèle conceptuel Video

Le modèle Video doit représenter au minimum :

```text
id
prompt
status
workspacePath
outputPath
duration
width
height
fps
createdAt
updatedAt
```

Les types définitifs doivent être définis lors de l'implémentation du Core.

---

# 34. Modèle conceptuel Render

Le modèle Render doit représenter au minimum :

```text
id
videoId
status
outputPath
startedAt
completedAt
error
```

Les types définitifs doivent être définis lors de l'implémentation du Core.

---

# 35. Sécurité

Les opérations sur le filesystem doivent être limitées au workspace autorisé.

Les erreurs doivent être structurées.

Erreurs prévues :

```text
FILE_NOT_FOUND
INVALID_VIDEO_CODE
REMOTION_COMPILE_ERROR
REMOTION_RENDER_ERROR
ASSET_NOT_FOUND
INVALID_CONFIGURATION
WORKSPACE_NOT_FOUND
```

Une architecture de sandbox/isolation forte sera nécessaire avant une exposition publique du système.

---

# 36. Propriété du workspace

Le workspace est la source de vérité de la vidéo.

Une vidéo générée doit pouvoir être modifiée ultérieurement en utilisant son workspace existant.

Le système ne doit pas reconstruire arbitrairement une vidéo à partir du MP4 final.

---

# 37. Skills

Les Skills sont destinés aux agents IA.

Ils décrivent :

* comment raisonner ;
* quand utiliser une capacité ;
* quelles étapes suivre ;
* quelles règles respecter ;
* comment vérifier le résultat.

Différence fondamentale :

```text
MCP Tool
→ capacité/action

Skill
→ connaissance/procédure
```

Les Skills ne doivent pas contenir la logique métier du backend.

Ils servent de guide aux agents externes.

---

# 38. Architecture agent

Le projet doit rester indépendant du fournisseur d'IA.

Agents potentiels :

```text
ChatGPT
Gemini
Claude
Codex
autres agents compatibles MCP
```

Le backend ne doit pas contenir une logique spécifique à un seul agent.

Les adaptations spécifiques à un agent doivent être séparées du contrat commun du projet.

---

# 39. Critères de réussite de la V1

La V1 sera considérée comme fonctionnelle lorsqu'une IA externe pourra :

```text
Recevoir une demande
      ↓
Lire les Skills
      ↓
Se connecter via MCP
      ↓
Inspecter le workspace
      ↓
Inspecter les assets
      ↓
Créer le workspace
      ↓
Créer le code Remotion
      ↓
Exécuter le code
      ↓
Lire une erreur
      ↓
Corriger le code
      ↓
Réexécuter
      ↓
Rendre la vidéo
      ↓
Vérifier le résultat
      ↓
Obtenir output/[video-id].mp4
```

Le système doit également conserver le workspace afin qu'une demande ultérieure puisse modifier la vidéo existante.

---

# 40. Prochaine tâche

La prochaine tâche officielle est :

> **Nettoyer les tests temporaires et finaliser le socle du projet, puis définir et créer le système de Skills.**

Ne pas commencer l'implémentation complète de `core/`, `domain/`, `data/`, `VideoEngine` ou des MCP Tools avant d'avoir terminé cette étape.

---

# 41. État actuel

```text
PROJET
│
├── Vision                         ✓
├── Architecture                  ✓
├── Technologies                  ✓
├── Installation                  ✓
├── Remotion                      ✓
├── Renderer                      ✓
├── MCP                           ✓
│
├── Nettoyage                      → prochaine étape
├── Skills                         → ensuite
├── Core                           → ensuite
├── Domain                         → ensuite
├── Data                           → ensuite
├── VideoEngine                    → ensuite
├── MCP Tools                      → ensuite
├── DI / Container                 → ensuite
├── Server                         → ensuite
└── Premier agent autonome         → objectif V1
```

---

# 42. Règle finale

Le projet doit rester :

* simple ;
* modulaire ;
* compréhensible ;
* extensible ;
* indépendant du fournisseur d'IA ;
* orienté automatisation ;
* sans sur-ingénierie.

La priorité est de construire un système réellement fonctionnel avant d'ajouter des fonctionnalités secondaires.
