# PROJECT2.md --- Spécification et feuille de route V2

## 1. Identité du projet

**Projet :** Video SaaS\
**Version :** V2\
**Objectif :** faire évoluer le moteur autonome V1 vers une plateforme
capable de comprendre et qualifier une demande de vidéo publicitaire
avant de lancer automatiquement la production Remotion.

La V2 ne remplace pas la V1.

La V1 devient le **moteur de production** utilisé par la V2.

------------------------------------------------------------------------

# 2. Vision V2

Le système doit permettre à un utilisateur de formuler une demande en
langage naturel, par exemple :

> « Je veux une publicité TikTok pour vendre mes chaussures Nike à 25
> 000 FCFA. »

L'IA doit être capable de :

1.  comprendre la demande ;
2.  identifier le type de vidéo approprié ;
3.  identifier l'objectif ;
4.  identifier la plateforme ;
5.  déterminer le format adapté ;
6.  récupérer les informations déjà présentes dans la demande ;
7.  déterminer les informations manquantes ;
8.  déterminer les assets nécessaires ;
9.  demander uniquement les informations/assets réellement nécessaires ;
10. proposer le type de vidéo à l'utilisateur lorsque celui-ci n'est pas
    explicitement donné ;
11. attendre la confirmation du type proposé ;
12. construire un `VideoBrief` structuré ;
13. valider le projet avant toute génération Remotion ;
14. produire un plan vidéo ;
15. transmettre le projet au moteur de production V1 ;
16. générer le code Remotion ;
17. exécuter, observer, corriger et rendre la vidéo ;
18. vérifier le résultat final.

Flux cible :

``` text
Demande utilisateur
        ↓
Identification du type
        ↓
Collecte des informations
        ↓
Gestion des assets
        ↓
Construction du VideoBrief
        ↓
Validation
        ↓
Confirmation utilisateur
        ↓
Plan vidéo
        ↓
Production V1
        ↓
Remotion
        ↓
Exécution
        ↓
Correction
        ↓
Rendu
        ↓
Vérification
```

------------------------------------------------------------------------

# 3. Relation entre V1 et V2

## V1

La V1 sait déjà faire :

``` text
Prompt
  ↓
IA
  ↓
MCP
  ↓
Workspace
  ↓
Code Remotion
  ↓
Execute
  ↓
Observe
  ↓
Correct
  ↓
Render
  ↓
MP4
```

La V1 constitue donc le **pipeline de production autonome**.

## V2

La V2 ajoute une couche de pré-production :

``` text
                    V2
                     │
             PRE-PRODUCTION
                     │
      ┌──────────────┼──────────────┐
      ↓              ↓              ↓
 Video Type       Brief           Assets
      │              │              │
      └──────────────┼──────────────┘
                     ↓
                 Validation
                     ↓
              Production V1
                     ↓
                  Remotion
```

Principe fondamental :

> **La V2 décide si et comment le projet peut être produit. La V1 sait
> ensuite le produire.**

------------------------------------------------------------------------

# 4. Objectifs de la V2

## Objectifs principaux

-   rendre l'IA plus fiable avant la génération ;
-   éviter de générer des vidéos avec des informations essentielles
    manquantes ;
-   distinguer les différents objectifs publicitaires ;
-   structurer les informations du projet ;
-   gérer les assets par projet ;
-   valider les prérequis avant d'écrire `MainVideo.tsx` ;
-   permettre à l'utilisateur de confirmer le type de vidéo ;
-   conserver la liberté créative de l'IA pendant la production ;
-   réutiliser intégralement le moteur autonome V1.

## Ce que la V2 ne doit pas devenir

La V2 ne doit pas être un formulaire rigide du type :

``` text
Nom :
Prix :
Couleur :
Logo :
Photo :
Durée :
...
```

L'utilisateur doit pouvoir parler naturellement.

L'IA doit extraire les informations connues et poser uniquement les
questions nécessaires.

------------------------------------------------------------------------

# 5. Séparation des concepts

La V2 doit distinguer clairement :

``` text
Video Type
    ↓
Objective
    ↓
Platform
    ↓
Format
    ↓
Duration
```

Ces concepts ne doivent pas être mélangés.

Exemple :

``` text
Type       : product-promotion
Objectif   : vendre
Plateforme : TikTok
Format     : 9:16
Durée      : 30 secondes
```

Un type de vidéo ne doit donc pas être nommé :

``` text
product-tiktok
product-instagram
product-facebook
```

La plateforme est une information indépendante.

------------------------------------------------------------------------

# 6. Catalogue initial des types de vidéos

La V2 commence avec les 8 types suivants.

## 6.1 Product Presentation

Identifiant :

``` text
product-presentation
```

Objectif :

Présenter et faire découvrir un produit.

Exemple :

> « Découvrez notre nouvelle collection de chaussures. »

Informations importantes :

-   produit ;
-   nom ;
-   description ;
-   caractéristiques ;
-   bénéfices.

Assets :

-   visuel du produit recommandé ;
-   logo recommandé ;
-   plusieurs photos ou vidéos du produit optionnelles.

------------------------------------------------------------------------

## 6.2 Product Promotion

Identifiant :

``` text
product-promotion
```

Objectif :

Promouvoir un produit et favoriser l'achat.

Exemple :

> « Cette semaine, nos chaussures sont disponibles à 25 000 FCFA.
> Commandez maintenant. »

Informations importantes :

-   produit ;
-   offre ;
-   prix ;
-   CTA.

Informations recommandées :

-   avantage principal ;
-   cible ;
-   durée de l'offre ;
-   ancien prix ;
-   nouveau prix.

Assets :

-   photo produit recommandée ;
-   logo recommandé ;
-   vidéo produit optionnelle ;
-   visuels promotionnels optionnels.

------------------------------------------------------------------------

## 6.3 Product Demo

Identifiant :

``` text
product-demo
```

Objectif :

Montrer le fonctionnement ou l'utilisation d'un produit.

Exemples :

-   démonstration d'un appareil ;
-   démonstration d'une application ;
-   démonstration d'un outil.

Informations importantes :

-   produit ;
-   fonctionnement ;
-   bénéfice principal.

Assets :

-   vidéo de démonstration recommandée ;
-   capture d'écran recommandée pour un logiciel ;
-   photos du produit optionnelles.

------------------------------------------------------------------------

## 6.4 Service Presentation

Identifiant :

``` text
service-presentation
```

Objectif :

Présenter un service et expliquer sa valeur.

Exemple :

> « Nous créons des applications mobiles pour les PME. »

Informations importantes :

-   service ;
-   cible ;
-   bénéfices ;
-   proposition de valeur ;
-   CTA.

Assets :

Aucun asset strictement obligatoire.

Assets recommandés :

-   logo ;
-   captures ;
-   photos ;
-   exemples de réalisations.

------------------------------------------------------------------------

## 6.5 Problem Solution

Identifiant :

``` text
problem-solution
```

Objectif :

Partir d'un problème du client et présenter une solution.

Structure narrative typique :

``` text
Problème
   ↓
Conséquence / frustration
   ↓
Solution
   ↓
Bénéfices
   ↓
CTA
```

Le fichier vidéo `0908(1).mp4` fourni comme exemple correspond à cette
logique générale.

Informations importantes :

-   problème ;
-   solution ;
-   bénéfices ;
-   CTA.

Assets :

Aucun asset strictement obligatoire.

Assets recommandés :

-   produit/service ;
-   photos ;
-   vidéos ;
-   logo.

Important :

Le type `problem-solution` définit une logique narrative, pas un
template visuel.

L'IA reste libre de décider :

-   la mise en scène ;
-   les transitions ;
-   les animations ;
-   les couleurs ;
-   la composition ;
-   la durée de chaque partie ;
-   le nombre de scènes.

------------------------------------------------------------------------

## 6.6 Company Presentation

Identifiant :

``` text
company-presentation
```

Objectif :

Présenter une entreprise ou une marque.

Informations importantes :

-   nom ;
-   activité ;
-   proposition de valeur.

Informations recommandées :

-   histoire ;
-   valeurs ;
-   localisation ;
-   équipe ;
-   réalisations ;
-   chiffres clés.

Assets recommandés :

-   logo ;
-   photos de l'entreprise ;
-   photos de l'équipe ;
-   locaux ;
-   réalisations.

------------------------------------------------------------------------

## 6.7 Testimonial

Identifiant :

``` text
testimonial
```

Objectif :

Utiliser l'expérience d'un client comme preuve sociale.

Informations importantes :

-   client ;
-   expérience ;
-   problème initial ;
-   résultat ou bénéfice.

Assets :

-   témoignage vidéo/audio/texte recommandé ;
-   photo du client optionnelle ;
-   preuve chiffrée optionnelle ;
-   logo optionnel.

------------------------------------------------------------------------

## 6.8 Event Promotion

Identifiant :

``` text
event-promotion
```

Objectif :

Promouvoir un événement.

Exemples :

-   conférence ;
-   formation ;
-   lancement ;
-   webinaire ;
-   événement commercial.

Informations importantes :

-   nom de l'événement ;
-   date ;
-   lieu ou lien ;
-   objectif ;
-   CTA.

Assets recommandés :

-   affiche ;
-   logo ;
-   photos ;
-   intervenants ;
-   programme.

------------------------------------------------------------------------

# 7. Pourquoi seulement 8 types au départ ?

Le catalogue doit rester extensible.

La V2 ne doit pas essayer de représenter immédiatement toutes les formes
de publicité existantes.

Le système doit commencer avec un catalogue suffisamment large pour
couvrir les besoins principaux, puis ajouter de nouveaux types lorsque
le besoin est réel.

Les types futurs pourront inclure, par exemple :

``` text
before-after
comparison
educational
launch
ugc-style
brand-story
app-promotion
real-estate-promotion
restaurant-promotion
```

Mais ils ne font pas partie du catalogue initial obligatoire de V2.

------------------------------------------------------------------------

# 8. Type de vidéo ≠ template vidéo

Principe essentiel :

``` text
VideoType
    ≠
VideoTemplate
```

Le catalogue décrit le **but et les contraintes narratives**.

Il ne doit pas imposer :

``` text
Scene 1 = ...
Scene 2 = ...
Scene 3 = ...
```

Il ne doit pas imposer non plus :

``` text
fond rouge
texte blanc
transition slide
carte téléphone
CTA bleu
```

L'IA reste le cerveau créatif.

Le catalogue lui fournit seulement le cadre nécessaire pour produire une
vidéo cohérente.

------------------------------------------------------------------------

# 9. Niveaux de nécessité

Pour les informations et les assets, utiliser trois niveaux :

``` text
REQUIRED
RECOMMENDED
OPTIONAL
```

## REQUIRED

L'absence empêche la génération correcte du type de vidéo.

## RECOMMENDED

La vidéo peut être générée sans cet élément, mais sa qualité ou sa
fidélité peut être améliorée avec celui-ci.

## OPTIONAL

L'élément peut enrichir la vidéo mais n'est pas nécessaire.

Important :

> Un asset n'est pas automatiquement obligatoire simplement parce qu'il
> est utile.

Exemple :

Un logo peut être recommandé pour une publicité produit sans être
techniquement obligatoire.

------------------------------------------------------------------------

# 10. Gestion des assets

Chaque projet vidéo possède son propre dossier :

``` text
workspace/
└── [video-id]/
    ├── assets/
    ├── brief/
    ├── composition/
    └── metadata/
```

Principe obligatoire :

> **Un asset appartient au projet vidéo courant.**

Il ne doit pas y avoir de mélange automatique entre les assets de
plusieurs projets.

Exemple :

``` text
workspace/
├── video-001/
│   └── assets/
│       ├── logo.png
│       └── product.jpg
│
└── video-002/
    └── assets/
        ├── logo.png
        └── event.jpg
```

Même si deux projets utilisent un fichier ayant le même nom, ils restent
indépendants dans leurs workspaces.

Le système doit créer automatiquement `assets/` lors de la création du
projet.

L'IA ne doit pas avoir à se souvenir de créer ce dossier elle-même.

------------------------------------------------------------------------

# 11. Asset Manifest

Chaque projet doit pouvoir connaître les assets disponibles.

Fichier prévu :

``` text
metadata/asset-manifest.json
```

Il permettra notamment de décrire :

-   nom ;
-   type ;
-   chemin ;
-   projet associé ;
-   dimensions si pertinentes ;
-   durée pour une vidéo ;
-   format ;
-   informations utiles à la génération.

Exemple conceptuel :

``` json
{
  "assets": [
    {
      "name": "product.jpg",
      "type": "image",
      "path": "assets/product.jpg"
    }
  ]
}
```

La structure exacte sera définie lors de l'implémentation TypeScript.

------------------------------------------------------------------------

# 12. Video Brief

La V2 doit transformer la conversation en un objet structuré :

``` text
VideoBrief
```

Le brief doit représenter ce que l'on sait actuellement du projet.

Il pourra contenir conceptuellement :

``` text
id
type
objective
platform
format
duration
language
product
service
company
offer
price
cta
targetAudience
problem
solution
benefits
brand
assets
status
```

La structure finale sera déterminée avant l'implémentation.

Important :

Le brief doit pouvoir être **incomplet temporairement**.

------------------------------------------------------------------------

# 13. États du brief

Le brief doit pouvoir évoluer.

États conceptuels :

``` text
INCOMPLETE
      ↓
READY_FOR_CONFIRMATION
      ↓
READY_FOR_GENERATION
```

## INCOMPLETE

Une ou plusieurs informations obligatoires manquent.

L'IA doit poser les questions nécessaires.

## READY_FOR_CONFIRMATION

Les informations nécessaires sont disponibles, mais le type proposé par
l'IA doit être confirmé par l'utilisateur.

## READY_FOR_GENERATION

Le type et les informations nécessaires sont validés.

La production peut commencer.

------------------------------------------------------------------------

# 14. Sélection du type par l'IA

Deux situations sont possibles.

## L'utilisateur indique explicitement le type

Exemple :

> « Je veux une vidéo testimonial pour mon restaurant. »

L'IA peut utiliser directement :

``` text
testimonial
```

Elle n'a pas besoin de proposer à nouveau le type.

## L'utilisateur ne précise pas le type

Exemple :

> « Je veux faire une vidéo pour vendre mes chaussures. »

L'IA analyse la demande et peut proposer :

> « Pour votre objectif de vente, je vous propose une vidéo Product
> Promotion. Est-ce que ce type vous convient ? »

L'utilisateur confirme ou demande un autre type.

------------------------------------------------------------------------

# 15. Collecte intelligente des informations

La V2 doit fonctionner comme une conversation et non comme un
formulaire.

Exemple :

Utilisateur :

> « Je veux une publicité TikTok pour vendre mes chaussures Nike à 25
> 000 FCFA. »

L'IA peut déjà déduire :

``` text
type       → product-promotion
objectif   → vente
plateforme → TikTok
produit    → chaussures Nike
prix       → 25 000 FCFA
format     → 9:16
```

Elle doit ensuite vérifier les exigences du type.

Exemple :

``` text
Produit              ✓
Prix                 ✓
Plateforme           ✓
Objectif             ✓
CTA                  ?
Visuel produit       ?
```

Elle demande uniquement ce qui est nécessaire.

------------------------------------------------------------------------

# 16. Validation

Avant de générer `MainVideo.tsx`, le système doit valider le projet.

Concept :

``` text
VideoBrief
    +
Assets
    +
VideoTypeDefinition
        ↓
    Validation
        ↓
ValidationReport
```

Le rapport pourra contenir :

``` json
{
  "status": "ready",
  "missingRequired": [],
  "missingRecommended": ["logo"],
  "warnings": [],
  "canGenerate": true
}
```

Ou :

``` json
{
  "status": "incomplete",
  "missingRequired": ["cta"],
  "missingRecommended": ["product image"],
  "warnings": [],
  "canGenerate": false
}
```

------------------------------------------------------------------------

# 17. Règle fondamentale de validation

Si une information REQUIRED manque :

``` text
canGenerate = false
```

L'IA doit demander cette information.

Elle ne doit pas inventer une information métier essentielle.

Exemple :

Si le prix est obligatoire pour une promotion et que l'utilisateur ne le
donne pas, l'IA ne doit pas inventer :

``` text
25 000 FCFA
```

Elle doit demander le prix.

En revanche, pour les éléments créatifs non critiques, l'IA peut prendre
ses propres décisions.

Exemple :

``` text
typographie
composition
animation
transition
palette graphique
```

------------------------------------------------------------------------

# 18. Plan vidéo

Une fois le brief validé, l'IA doit construire un :

``` text
VideoPlan
```

Le plan traduit les informations du brief en direction créative.

Il peut définir :

-   structure narrative ;
-   scènes ;
-   message principal ;
-   messages secondaires ;
-   rythme ;
-   ordre des informations ;
-   utilisation des assets ;
-   CTA ;
-   direction visuelle ;
-   durée estimée des séquences.

Le `VideoPlan` ne doit pas devenir un catalogue de scènes obligatoires.

Il sert de plan créatif avant la génération du code.

------------------------------------------------------------------------

# 19. Production V1

Après validation du brief et du plan :

``` text
VideoBrief
      ↓
VideoPlan
      ↓
V1 Production Engine
```

La V1 reprend son cycle autonome :

``` text
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

Le moteur Remotion reste libre.

L'IA peut créer ses propres :

``` text
scenes/
animations/
transitions/
layouts/
backgrounds/
themes/
```

ou toute autre organisation pertinente dans le workspace.

La seule entrée Remotion obligatoire reste :

``` text
composition/MainVideo.tsx
```

------------------------------------------------------------------------

# 20. MCP dans la V2

MCP reste l'interface permettant à l'IA d'agir sur le projet.

La V2 ajoutera notamment des capacités de pré-production.

Outils envisagés :

``` text
list_video_types
get_video_requirements
create_video_project
register_asset
validate_video_project
get_video_plan
```

Les outils déjà validés en V1 restent nécessaires :

``` text
inspect_directory
create_directory
read_file
write_file
update_file
delete_file
inspect_asset
execute_code
render_video
get_render_result
```

Les noms exacts pourront être ajustés pendant l'implémentation.

------------------------------------------------------------------------

# 21. Responsabilités MCP

MCP ne doit pas contenir la logique métier principale.

Exemple :

``` text
MCP Tool
    ↓
Use Case / Service
    ↓
Infrastructure
```

Le MCP doit exposer des capacités.

Il ne doit pas décider lui-même :

-   quel type de vidéo choisir ;
-   quelles règles métier appliquer ;
-   comment construire un brief complexe ;
-   comment concevoir une vidéo.

Ces responsabilités appartiennent aux services/use cases correspondants.

------------------------------------------------------------------------

# 22. Architecture V2 envisagée

Architecture de départ à étudier et valider avant création des fichiers
:

``` text
video-saas/
│
├── core/
│   ├── repository/
│   ├── use-case/
│   └── models/
│
├── package/
│   ├── domain/
│   ├── data/
│   └── services/
│       ├── video-engine/
│       ├── mcp/
│       ├── video-type/
│       ├── brief/
│       ├── asset/
│       └── validation/
│
├── output/
│
├── Container.ts
├── Server.ts
├── PROJECT.md
├── PROJECT2.md
├── package.json
└── tsconfig.json
```

Cette architecture est une **base de conception**, pas encore une
instruction de création immédiate.

Avant de coder, les responsabilités et dépendances doivent être
vérifiées.

------------------------------------------------------------------------

# 23. Modèles métier envisagés

Les modèles principaux à étudier sont :

``` text
Video
Render
VideoBrief
VideoType
Asset
AssetRequirement
BrandKit
ValidationReport
```

D'autres modèles pourront être ajoutés uniquement s'ils sont réellement
nécessaires.

Principe :

> Ne pas créer un modèle uniquement parce qu'il semble théoriquement
> utile.

------------------------------------------------------------------------

# 24. Services envisagés

Services potentiels :

``` text
VideoTypeCatalog
VideoBriefService
AssetService
VideoValidationService
VideoPlanningService
```

Responsabilités générales :

### VideoTypeCatalog

Connaître les types disponibles et leurs exigences.

### VideoBriefService

Construire et mettre à jour le brief.

### AssetService

Gérer les assets du projet courant.

### VideoValidationService

Vérifier le brief et les assets par rapport aux exigences du type.

### VideoPlanningService

Transformer un brief validé en plan de production.

Les responsabilités exactes devront être définies avant implémentation.

------------------------------------------------------------------------

# 25. Stockage V2

Pour la V2 initiale :

``` text
Stockage local
```

Les workspaces restent locaux.

Structure conceptuelle :

``` text
workspace/
└── [video-id]/
    ├── brief/
    │   └── video-brief.json
    │
    ├── assets/
    │
    ├── metadata/
    │   └── asset-manifest.json
    │
    └── composition/
        └── MainVideo.tsx
```

Firebase/Firestore n'est pas nécessaire pour cette étape.

Il pourra être introduit dans une évolution future lorsque le SaaS devra
gérer :

-   utilisateurs ;
-   projets persistants ;
-   historique ;
-   authentification ;
-   données cloud ;
-   collaboration ;
-   stockage distant.

------------------------------------------------------------------------

# 26. Contraintes techniques

La V2 doit conserver les contraintes et principes de la V1.

## Remotion

Remotion reste le moteur de rendu.

L'IA génère le code Remotion.

Le système ne doit pas imposer un catalogue rigide de composants
créatifs.

## MCP

MCP est l'interface d'action de l'IA.

## IA

L'IA externe reste le cerveau créatif et décisionnel.

Le backend n'est pas un LLM interne.

## Packages

L'IA ne doit pas installer de packages.

## Workspace

L'IA doit travailler dans le workspace du projet courant.

## Assets

Les assets doivent appartenir au projet courant.

## Sécurité

`ExecuteCodeTool` reste une capacité sensible.

Pour une version de production, une isolation/sandbox devra être prévue.

------------------------------------------------------------------------

# 27. Decisions V2 validees

Les decisions suivantes sont validees avant l'implementation :

1. Les assets `RECOMMENDED` restent facultatifs. L'utilisateur decide s'il
   souhaite les fournir ; leur absence ne bloque pas la generation.
2. En phase locale de test, les fichiers importes par l'utilisateur doivent
   etre places dans le dossier `assets/` du workspace du projet courant.
3. Aucun asset ne doit etre partage automatiquement entre deux `videoId`.
4. Le plan video doit etre presente a l'utilisateur en langage naturel.
   Le code source Remotion ne doit pas etre utilise comme presentation du
   plan.
5. La production Remotion ne commence qu'apres validation des informations
   obligatoires et confirmation du projet.
6. `AGENTS.md` reste exclusivement reserve a l'agent de generation video.
   Les agents developpeurs doivent utiliser `PROJECT.md` pour la V1 et
   `PROJECT2.md` pour la V2.
7. La V2 est une couche de pre-production au-dessus du moteur V1. Le moteur
   V1 et son workflow de rendu doivent rester fonctionnels.

## 27.1 Ordre d'implementation valide

``` text
1. Modeles et contrats Core
2. Catalogue des types video
3. Structure du workspace V2
4. Import et manifeste des assets
5. Services V2
6. Use Cases V2
7. Tools MCP de pre-production
8. Workflow conversationnel
9. Connexion au moteur de production V1
10. Tests et validation
```

Chaque phase doit etre analysee et validee avant de passer a la suivante.

## 27.2 Principe de separation des assets

Les fichiers utilisateur appartiennent aux donnees du projet :

``` text
workspace/<videoId>/assets/
```

Les services peuvent contenir la logique de gestion des assets, mais jamais
les fichiers eux-memes. Le dossier `assets/` est cree pour le projet courant
et son manifeste reste lie au meme `videoId`.

## 27.3 Conception Core a preparer

La premiere phase doit definir, sans dependance a MCP, Remotion ou Firebase :

- les identifiants des types video ;
- les niveaux `REQUIRED`, `RECOMMENDED` et `OPTIONAL` ;
- le `VideoBrief` et ses etats ;
- le modele `Asset` et son manifeste ;
- le `ValidationReport` ;
- le `VideoPlan` ;
- les etats du projet de production.

Les implementations TypeScript ne doivent commencer qu'apres validation de
ces contrats.

------------------------------------------------------------------------

# 28. Ce qui est déjà terminé en V1

La V1 a été validée sur les points suivants :

-   compilation TypeScript ;
-   configuration Remotion ;
-   création et chargement d'une composition ;
-   rendu MP4 avec `@remotion/bundler` et `@remotion/renderer` ;
-   serveur MCP ;
-   exposition d'un outil MCP ;
-   appel d'un outil MCP via MCP Inspector ;
-   architecture Layer-First ;
-   cycle autonome de génération/correction/rendu ;
-   skills `video-generation`, `remotion` et `workspace`.

La V2 doit donc **réutiliser cette base** et non la reconstruire.

------------------------------------------------------------------------

# 29. Ordre de développement V2

Ne pas commencer directement par les outils MCP.

Ordre recommandé :

``` text
1. Finaliser les concepts métier
        ↓
2. Définir VideoTypeDefinition
        ↓
3. Définir les exigences
        ↓
4. Définir VideoBrief
        ↓
5. Définir Asset et AssetManifest
        ↓
6. Définir ValidationReport
        ↓
7. Définir les use cases
        ↓
8. Implémenter le catalogue des types
        ↓
9. Implémenter la gestion des assets
        ↓
10. Implémenter la validation
        ↓
11. Implémenter le projet vidéo
        ↓
12. Exposer les capacités via MCP
        ↓
13. Connecter le planning
        ↓
14. Connecter la production V1
        ↓
15. Tester le flux complet
```

------------------------------------------------------------------------

# 30. Première tâche V2

La première tâche de développement n'est PAS encore de créer tous les
modèles.

Première tâche :

> **Définir précisément `VideoTypeDefinition` et la matrice des
> exigences des 8 types initiaux.**

Pour chaque type, définir :

``` text
id
name
description
objective
required information
recommended information
optional information
required assets
recommended assets
optional assets
supported platforms
supported formats
recommended duration
content constraints
narrative guidance
```

La structure exacte doit rester suffisamment flexible pour permettre
l'ajout futur de nouveaux types.

------------------------------------------------------------------------

# 31. Règles de travail pour les futurs agents

Tout agent qui reprend ce projet doit respecter les règles suivantes :

1.  Lire `PROJECT.md` avant toute modification liée à la V1.
2.  Lire `PROJECT2.md` avant toute modification liée à la V2.
3.  Ne pas supposer que les décisions non validées sont définitives.
4.  Ne pas créer de fichiers massivement avant d'avoir validé leur
    responsabilité.
5.  Ne pas ajouter de couches d'architecture sans justification.
6.  Ne pas transformer la V2 en formulaire rigide.
7.  Ne pas transformer les types vidéo en templates visuels.
8.  Ne pas mélanger les assets de plusieurs projets.
9.  Ne pas installer de packages via l'IA autonome.
10. Ne pas remplacer Remotion : Remotion reste le moteur de rendu.
11. Ne pas remplacer MCP : MCP reste l'interface d'action.
12. Ne pas reconstruire inutilement le moteur V1.
13. Toujours préserver le principe :

``` text
V2 = compréhension + qualification + validation
V1 = production autonome
```

------------------------------------------------------------------------

# 32. État actuel de V2

``` text
[✓] Vision V2 définie
[✓] V1 identifié comme moteur de production
[✓] Séparation Type / Objective / Platform / Format
[✓] Catalogue initial des 8 types défini
[✓] Principe Required / Recommended / Optional défini
[✓] Gestion des assets par projet définie
[✓] Principe de validation avant génération défini
[✓] Sélection du type par IA + confirmation utilisateur définie
[✓] Collecte conversationnelle définie
[✓] VideoBrief identifié
[✓] ValidationReport identifié
[✓] VideoPlan identifié
[✓] Architecture générale V2 esquissée
[✓] Définir le contrat Core VideoTypeDefinition
[✓] Définir les niveaux et clés d'exigence
[✓] Implémenter le catalogue initial et la matrice des exigences
[✓] Définir précisément VideoBrief
[✓] Définir précisément Asset
[✓] Définir AssetManifest
[✓] Définir ValidationReport
[✓] Définir VideoPlan
[✓] Définir les use cases V2
[✓] Définir les repositories de persistance V2
[✓] Implémenter le catalogue des types
[✓] Implémenter les repositories locaux V2
[✓] Implémenter les Use Cases V2 de catalogue et de brief
[✓] Implémenter les services V2 d'assets, validation et planning
[✓] Implémenter les Use Cases V2 d'assets, validation et planning
[✓] Enregistrer les dépendances V2 dans le composition root
[✓] Exposer les Tools MCP de pré-production V2
[✓] Corriger le cycle validation → confirmation
[✓] Ajouter la récupération du plan vidéo
[✓] Connecter la production V2 au moteur V1 avec confirmation
[✓] Mutualiser la validation des chemins de sortie
[ ] Implémenter les autres services
[ ] Implémenter les outils MCP V2
[✓] Connecter V2 au moteur V1
[✓] Tester le parcours de pré-production V2 en mémoire
```

------------------------------------------------------------------------

# 33. Prochaine étape

La prochaine étape doit porter sur :

``` text
Import réel des assets via le client IA
        +
Test MCP de bout en bout
        +
Validation d'une production Remotion V2
```

Le parcours métier de pré-production est déjà implémenté et validé en
mémoire. Il reste à le tester via le protocole MCP avec un workspace réel,
puis à valider le rendu Remotion d'un projet confirmé.

------------------------------------------------------------------------

# 34. Principe directeur du projet

Le système final doit se comporter comme un véritable
développeur/creative agent :

``` text
Comprendre
    ↓
Réfléchir
    ↓
Questionner si nécessaire
    ↓
Valider
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

Le catalogue, les briefs et les validations servent à **fiabiliser
l'autonomie**, pas à remplacer l'intelligence créative de l'IA.

La finalité reste :

> **Donner une demande naturelle à l'IA et lui permettre de conduire de
> manière autonome tout le processus, depuis la compréhension du besoin
> jusqu'à la vidéo finale.**
