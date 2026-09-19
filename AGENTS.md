# Règles d'exécution de l'agent

## Démarrage

Depuis la racine du dépôt :

```powershell
codex.cmd --approve-for-me -C "C:\Users\PROMOPlus\Documents\video-saas"
```

`--approve-for-me` est requis pour les Tools MCP qui créent, modifient,
rendent ou suppriment des fichiers. Ne pas ajouter `--sandbox`.

## Périmètre

- Travailler uniquement sur la demande explicite de l'utilisateur.
- Pour une vidéo, utiliser uniquement le serveur MCP `video-saas`.
- Conserver tous les fichiers générés dans le workspace du `videoId` demandé.
- Écrire la vidéo finale dans le dossier racine `output/`.
- Utiliser un chemin comme `output/video01.mp4`, jamais le dossier `output/`
  d'un workspace.
- Ce fichier est l'unique instruction de projet à lire pour une demande vidéo.
- Ne pas lire `PROJECT.md`, `PROJECT2.md`, `README.md`, l'historique Git ou
  des fichiers hors du workspace demandé.
- Ne pas inspecter l'architecture du dépôt : les Tools MCP et ce fichier
  suffisent.

## Règles de pré-production V2

La V2 qualifie la demande avant la production. Ne pas commencer par écrire du
code Remotion ni appeler `render_video`.

1. Comprendre la demande en langage naturel.
2. Identifier le type, l'objectif, la plateforme, le format et la durée.
3. Demander uniquement les informations obligatoires manquantes.
4. Faire confirmer le type lorsqu'il a été déduit.
5. Créer le projet avec `create_video_project`.
6. Enregistrer le brief avec `update_video_brief`.
7. Enregistrer les assets utilisateur avec `register_asset`.
8. Valider avec `validate_video_project`.
9. Si une information obligatoire manque, attendre au lieu de générer.
10. Présenter le plan en langage naturel avec `create_video_plan` et
    `get_video_plan`.
11. Demander l'approbation du plan si nécessaire.
12. Confirmer avec `confirm_video_project`.
13. Appeler `generate_video_project` uniquement après confirmation.

Tools de découverte :

- `list_video_types`
- `get_video_requirements`

Types initiaux :

- `product-presentation`
- `product-promotion`
- `product-demonstration`
- `service-presentation`
- `problem-solution`
- `company-presentation`
- `testimonial`
- `event-promotion`

Les assets `required` bloquent la validation s'ils manquent. Les assets
`recommended` sont facultatifs. Chaque asset doit rester associé à son
`videoId`.

## Règles obligatoires pour les assets

- Toujours conserver l'extension réelle du fichier lors de son enregistrement,
  sa copie et sa référence dans la composition (`.jpeg`, `.png`, `.mp3`,
  `.m4a`, etc.).
- Ne jamais renommer ou copier un asset en supprimant son extension.
- Avant toute génération, vérifier que le chemin référencé correspond
  exactement au fichier présent dans le workspace, extension comprise.
- Pour les fichiers audio, utiliser le chemin réellement enregistré dans le
  workspace et le conserver identique dans `staticFile(...)`.
- Si le fichier utilisateur provient d'un environnement différent du serveur
  MCP, utiliser `register_asset` avec `contentBase64` plutôt que de transmettre
  un chemin `/mnt/data/...` inaccessible au processus MCP.
- Le champ `name` doit contenir le nom complet avec son extension réelle.
- Ne jamais convertir `/mnt/data/...` en `C:\mnt\data\...` : ce chemin reste
  inaccessible au serveur MCP Windows. Si le contenu Base64 n'est pas
  disponible, demander à l'utilisateur un chemin Windows accessible au serveur.
- Pour un fichier fourni par l'utilisateur lorsque `contentBase64` n'est pas
  disponible dans la session MCP, utiliser le dossier Windows partagé :
  `C:\Users\PROMOPlus\Documents\video-saas\incoming\`.
- Copier d'abord le fichier dans `incoming\`, puis utiliser son chemin Windows
  complet dans `register_asset`.
- Les fichiers du dossier `incoming\` doivent conserver leur nom et leur
  extension réelle, par exemple `logo.jpeg` ou `background.mp3`.
- Après l'import, vérifier la présence exacte du fichier dans
  `workspace/<videoId>/assets/` avant toute référence dans la composition.
- Si une URL HTTP/HTTPS publique est disponible, utiliser `sourceUrl` dans
  `register_asset`. Le serveur télécharge directement le fichier et le copie
  dans le workspace.
- Fournir obligatoirement `name` avec l'extension réelle, même si le serveur
  peut la déduire depuis l'URL.
- Ne pas utiliser une URL locale, `/mnt/data/...` ou `C:\mnt\data\...` comme
  `sourceUrl` : le serveur doit pouvoir atteindre l'URL depuis Windows.

## Polices personnalisées

Les polices partagées du moteur sont disponibles dans
`package/services/video-engine/fonts/` et sont copiées automatiquement dans le
staging Remotion sous `public/fonts/`.

Polices installées :

- `fonts/Nunito/Nunito-Regular.ttf`
- `fonts/Nunito/Nunito-Bold.ttf`
- `fonts/Nunito/Nunito-Italic.ttf`
- `fonts/Luckybones/Luckybones-Bold.otf`

Dans une composition, charger ces fichiers avec leurs extensions exactes via
`staticFile(...)` et `@font-face`. Ne jamais omettre l'extension.

Le plan doit rester une description de production lisible, jamais du code.

## Actions interdites

- Ne pas modifier `tsconfig.json`, `package.json`, `Container.ts`, `Server.ts`
  ou `PROJECT.md` sans demande explicite.
- Ne créer à la racine que le MP4 demandé dans `output/`.
- Ne pas lancer de recherches globales, commandes Git ou diagnostics inutiles.
- Ne pas lancer plusieurs rendus, aperçus ou `ffprobe` sans demande explicite.
- Ne pas contourner l'isolation des workspaces.
- Ne pas utiliser le shell pour inspecter, créer, compiler ou rendre une vidéo :
  utiliser les Tools MCP.
- Ne pas exécuter `pnpm`, `tsc`, `remotion`, `rg`, `git` ou PowerShell pendant
  une demande vidéo.

## Flux vidéo

1. Terminer la pré-production V2.
2. Utiliser le `videoId` confirmé comme seul périmètre.
3. Appeler `generate_video_project`.
4. Si le moteur demande de créer le code, inspecter uniquement le workspace.
5. Créer `composition`.
6. Créer exactement `composition/MainVideo.tsx`.
7. Y placer l'entrée Remotion complète.
8. Rendre une seule fois avec `compositionId: "MainVideo"` et un chemin sous
   `output/`.
9. Vérifier le résultat et communiquer le chemin final.
10. S'arrêter après la production demandée.

## Synchronisation voix off / vidéo

Avant d'écrire ou de modifier `composition/MainVideo.tsx`, la synchronisation
de la voix off doit être basée sur des données vérifiées, jamais estimée.

1. Après `generate_voice_over`, toujours appeler `get_voice_over` pour
   récupérer `durationMs`, `alignment` et `segments`.
2. Si `alignment` ou `segments` contient un calage mot-à-mot ou phrase par
   phrase, utiliser ces valeurs exactes pour définir les `from`/`dur` de
   chaque scène dans `SCENES`. Ne jamais recalculer ces timings à la main.
3. Si `durationMs` est disponible, l'utiliser pour fixer `DURATION`
   (`durationInFrames` de la `Composition`), convertie en frames à 30 fps
   (`durationMs / 1000 * fps`), au lieu d'une durée fixe supposée.
4. Si `alignment`, `segments` ou `durationMs` sont absents (`null` ou vides),
   ne pas estimer un calage approximatif silencieusement. Le signaler à
   l'utilisateur et soit :
   - régénérer la voix off avec `generate_voice_over` pour obtenir un calage,
   - soit demander confirmation de la durée réelle avant de fixer les
     timings des scènes.
5. Une fois les timings fixés, documenter dans un commentaire au-dessus de
   `SCENES` la source du calage utilisé (`alignment` fourni, `durationMs`
   mesuré, ou confirmation manuelle de l'utilisateur), pour que toute reprise
   ultérieure du projet sache si le calage est fiable ou approximatif.
6. Ne jamais rendre (`render_video`) tant que les timings de `SCENES` n'ont
   pas été vérifiés contre les données de `get_voice_over`.
7. La voix off doit être synchronisée à partir de données vérifiées :
   `durationMs`, `alignment` ou `segments` retournés par `get_voice_over`.
   Une durée devinée à l'oreille ou un découpage approximatif est interdit.
8. Si la voix off ne fournit aucune donnée de durée ou d'alignement, arrêter
   la production de la composition et le signaler à l'utilisateur. Ne pas
   rendre une vidéo désynchronisée.
9. Après une nouvelle génération ou un changement de voix, rappeler
   `get_voice_over` avant de modifier les scènes, même si le script est
   identique.
10. Si l'alignement TTS est absent, utiliser les mots horodatés du Speech-to-
    Text ElevenLabs sur le MP3 généré. Si la transcription ne fournit pas de
    mots valides, conserver uniquement la durée MP3 vérifiée et ne pas créer
    de calage phrase par phrase.

## Politique MCP

Pour une nouvelle vidéo, utiliser si nécessaire :

```text
list_video_types / get_video_requirements
create_video_project
update_video_brief
register_asset
validate_video_project
create_video_plan / get_video_plan
confirm_video_project
generate_video_project
```

Utiliser `create_directory`, `write_file`, `update_file`, `render_video` et
`get_render_result` uniquement lorsque le moteur le demande ou pour un flux V1
explicitement demandé.

En cas d'échec du rendu, corriger uniquement le fichier concerné et retenter
une seule fois. Ne jamais créer d'aperçu, de rendu alternatif ou de fichier
temporaire sans demande.

## Contraintes Remotion

- Le moteur utilise `composition/MainVideo.tsx`.
- Le fichier doit appeler `registerRoot(...)`.
- Il doit définir la composition `MainVideo`.
- `Composition` doit préciser `durationInFrames`, `fps`, `width` et `height`.
- À 30 fps, 15 secondes correspondent à `durationInFrames: 450`.
- Garder les imports dans ce fichier lorsque possible.
- Ne pas utiliser d'identifiants non déclarés ou de code non supporté.
- Ne pas compiler Remotion depuis le shell : `render_video` valide le code.

## Sortie

- `outputPath` doit commencer par `output/`.
- Utiliser un nom déterministe, par exemple `output/video01.mp4`.
- Ne pas créer le dossier racine `output/` avec les Tools.
- Ne pas créer d'images d'aperçu ni de rendus temporaires.
