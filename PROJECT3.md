# PROJECT3.md - Spécification et feuille de route V3

## 1. Identité

**Projet :** Video SaaS  
**Version :** V3  
**Objectif :** ajouter une production audiovisuelle synchronisée à la V2,
avec voix off, musique locale, synchronisation temporelle et vérification
après rendu.

```text
V1 = Production autonome Remotion
V2 = Compréhension, qualification et validation
V3 = Production audiovisuelle synchronisée
```

La V2 décide si le projet est prêt. La V1 reste responsable du code et du
rendu Remotion. La V3 ajoute la production audio entre le plan validé et le
rendu final.

## 2. Vision

La V3 doit garantir que :

- la narration est cohérente avec la timeline visuelle ;
- la durée finale s'adapte à la durée réelle de la voix ;
- la musique appartient au workspace du `videoId` courant ;
- la musique peut diminuer pendant la narration ;
- les fichiers audio valides sont réutilisés ;
- les incohérences audio et de durée sont détectées ;
- l'agent peut corriger le script ou la timeline ;
- la clé ElevenLabs reste privée côté serveur.

La voix et la musique font partie du plan de production. Elles ne sont pas
ajoutées aveuglément après la création de la vidéo.

## 3. Pipeline cible

```text
Demande naturelle
    ↓
Brief et validation V2
    ↓
VideoPlan
    ↓
Script global
    ↓
ElevenLabs TTS avec timestamps
    ↓
VoiceOver + durée réelle + alignement
    ↓
Adaptation de la timeline à la voix
    ↓
Musique locale + loop/fade/ducking
    ↓
ProductionPlan
    ↓
Code et exécution Remotion
    ↓
Rendu
    ↓
Vérification audio/vidéo
    ↓
MP4 final
```

Tous les fichiers intermédiaires restent dans le workspace du `videoId`. Seul
le MP4 final est écrit dans le dossier racine `output/`.

## 4. Décision ElevenLabs

ElevenLabs est le premier fournisseur de voix.

Lorsque le script complet est connu, l'endpoint privilégié est :

```text
POST /v1/text-to-speech/{voice_id}/with-timestamps
```

Il fournit l'audio et des timings précis au niveau des caractères. Ces
timings peuvent être regroupés en segments logiques et convertis en frames
Remotion.

Le WebSocket `stream-input` n'est pas le choix par défaut : il est destiné au
texte envoyé progressivement et ajoute une complexité inutile lorsque le
script est déjà complet.

### 4.1 Règle de génération

```text
Une vidéo = un script global = une génération TTS principale
```

Ne pas effectuer un appel par scène par défaut. Les tentatives sont
séquentielles et limitées à :

```text
MAX_TTS_ATTEMPTS = 3
```

Une nouvelle tentative n'est permise qu'après analyse du résultat précédent :
erreur du fournisseur, audio invalide, script corrigé ou durée inutilisable.
Une correction Remotion visuelle ne doit jamais régénérer un audio valide.

### 4.2 Sécurité

La clé est fournie uniquement par l'environnement :

```text
ELEVENLABS_API_KEY=...
```

Elle doit être lue par l'adaptateur serveur, jamais écrite dans le code,
les briefs, les manifests, les workspaces ou les logs, retournée par un Tool
MCP ou commitée dans Git.

Le domaine dépend d'une abstraction, jamais directement d'ElevenLabs.

## 5. Durée et synchronisation

La durée estimée par l'IA n'est pas la vérité finale. La durée mesurée du
fichier généré devient la référence :

```text
durée cible
    ↓
génération TTS
    ↓
durée audio réelle
    ↓
adaptation de la timeline vidéo
```

Si la voix est plus longue que le plan initial, la vidéo s'adapte :

- prolonger ou rééquilibrer les scènes ;
- déplacer le CTA à la fin ;
- ajuster les transitions et les pauses ;
- prolonger ou recaler la musique ;
- recalculer la durée finale.

La voix ne doit pas être accélérée brutalement. La vitesse ElevenLabs peut
servir uniquement de solution de secours contrôlée. Des limites minimale et
maximale de durée doivent empêcher une vidéo illimitée.

### 5.1 Fallback des timestamps

```text
Timings disponibles
    → synchronisation précise

Timings indisponibles
    → durée totale mesurée
    → segments estimés à partir du script
    → validation moins précise
```

L'architecture ne doit pas devenir inutilisable si l'alignement manque.

### 5.2 Conversion en frames

Une seule fonction partagée doit convertir les secondes :

```text
frames = round(seconds * fps)
```

La timeline, Remotion et la vérification doivent utiliser la même conversion.

## 6. Modèles V3

### VoiceOver

```text
VoiceOver
├── provider
├── model
├── voiceId
├── language
├── script
├── audioPath
├── durationMs
├── alignment
├── generationFingerprint
└── status
```

### VoiceSegment

```text
VoiceSegment
├── id
├── text
├── startMs
├── endMs
├── durationMs
└── sceneId
```

Un segment est une unité narrative. Il n'impose pas une scène par phrase,
mot ou caractère.

### Music

La musique est un asset local référencé par le plan :

```text
Music
├── assetId
├── videoId
├── path
├── durationMs
├── startMs
├── endMs
├── volume
├── fadeInMs
├── fadeOutMs
├── loop
└── ducking
```

Le flux préféré est :

```text
register_asset
    → assets/music/
    → inspection de la musique
    → MusicPlan
```

Une musique `recommended` reste facultative et ne bloque pas la génération.

### AudioTimeline

```text
AudioTimeline
├── durationMs
├── voiceOver
├── voiceSegments
└── musicTracks
```

Elle positionne la voix et la musique sur le même axe temporel et est comparée
à la timeline des scènes.

### ProductionPlan

```text
ProductionPlan
├── videoPlan
├── voicePlan
├── musicPlan
├── audioTimeline
├── finalDurationMs
└── status
```

## 7. Musique et ducking

La musique doit gérer :

- début et fin ;
- volume ;
- fondu d'entrée et de sortie ;
- boucle si elle est plus courte que la vidéo ;
- découpage si elle est plus longue ;
- réduction automatique pendant la voix.

Les paramètres de ducking appartiennent au plan audio, pas à des constantes
dispersées dans `MainVideo.tsx`.

## 8. Cache et idempotence

Structure cible :

```text
workspace/<videoId>/
├── audio/
│   ├── voice-over.mp3
│   ├── voice-over.json
│   └── audio-timeline.json
└── assets/
    └── music/
```

L'identité du cache doit inclure le script, la langue, la voix, le modèle,
le fournisseur, les réglages pertinents et le format de sortie. Un hash ou
`generationFingerprint` stable sera utilisé.

Si l'identité et les fichiers sont valides, l'audio est réutilisé. Une erreur
Remotion ou une correction visuelle ne doit pas régénérer la voix.

## 9. Statuts et validation

Statuts suggérés pour la voix :

```text
draft → script-ready → generating → generated → validated
                                              ↘ invalid
```

Statuts suggérés pour la production :

```text
audio-pending
audio-ready
ready-for-render
rendered
verification-failed
completed
```

La validation doit détecter :

- script absent ou vide ;
- configuration ElevenLabs absente ;
- réponse ou voix invalide ;
- fichier audio illisible ;
- durée impossible ou dangereuse ;
- alignement incohérent ;
- musique absente ou invalide lorsqu'elle est obligatoire ;
- stratégie de loop/fade absente ;
- rendu final sans piste audio attendue.

## 10. Vérification après rendu

```text
Render
    → existence et durée
    → présence des pistes audio
    → limites de timeline
    → relation voix/musique
    → acceptation ou correction
```

La première version doit effectuer des contrôles déterministes. Une analyse
visuelle sémantique pourra être ajoutée plus tard avec des images extraites ou
un outil d'analyse dédié.

Le nombre de corrections est limité :

```text
MAX_RENDER_CORRECTIONS = 2
```

## 11. Tools MCP V3 possibles

Les capacités V1/V2 restent disponibles. Les Tools V3 doivent rester de
simples adaptateurs vers les Use Cases :

```text
update_voice_script
generate_voice_over
get_voice_over
inspect_audio
create_audio_timeline
validate_audio_timeline
create_production_plan
get_production_plan
```

Les règles métier ne doivent pas être placées directement dans les handlers.
`generate_video_project` doit exiger un projet V2 confirmé, préparer l'audio
V3, puis déléguer au moteur V1.

## 12. Architecture

```text
core/
    models/
    repository/
    use-case/

package/
    domain/
    data/
    services/
        audio/
            voice/
            music/
            timeline/
            validation/
```

Responsabilités probables :

```text
ElevenLabsClient
    adaptateur HTTP et conversion des réponses

VoiceService
    validation du script, TTS, alignement et cache

MusicService
    inspection de l'asset et stratégie musicale

AudioTimelineService
    positionnement voix/musique et conversion en frames

AudioValidationService
    contrôles avant et après rendu
```

Ne pas créer un `AudioService` géant ni des abstractions sans cas d'usage.
Awilix reste le composition root et les détails externes doivent être injectés.

## 13. Workspace V3

```text
workspace/<videoId>/
├── brief/
├── assets/
│   └── music/
├── audio/
│   ├── voice-over.mp3
│   ├── voice-over.json
│   └── audio-timeline.json
├── metadata/
├── plan/
└── composition/
    └── MainVideo.tsx
```

Il est interdit de mélanger les fichiers audio de plusieurs `videoId`.
Le rendu final reste dans `output/<nom-deterministe>.mp4`.

## 14. Ce que la V3 ne doit pas faire

- Générer un appel TTS par scène par défaut.
- Effectuer des appels ElevenLabs concurrents inutilement.
- Exposer la clé API à Claude ou au client.
- Régénérer un audio valide après une correction Remotion.
- Forcer une vitesse de voix artificielle par défaut.
- Supposer que l'alignement est toujours disponible.
- Mélanger les assets de plusieurs projets.
- Placer la logique métier dans les Tools MCP.
- Remplacer le moteur Remotion V1.
- Imposer un template audiovisuel fixe.
- Créer des boucles infinies de retry ou de correction.

## 15. Feuille de route

### Phase 1 - Contrats

1. Définir `VoiceOver`, `VoiceSegment`, `Music`, `AudioTimeline` et
   `ProductionPlan`.
2. Définir les interfaces provider et repository.

### Phase 2 - Fondations audio locales

1. Ajouter les chemins audio par projet.
2. Réutiliser `register_asset` pour la musique locale.
3. Inspecter durée et format.
4. Ajouter la conversion secondes/frames.
5. Persister les métadonnées audio.

### Phase 3 - Adaptateur ElevenLabs

1. Lire `ELEVENLABS_API_KEY` depuis l'environnement.
2. Implémenter `/with-timestamps`.
3. Convertir l'audio et l'alignement.
4. Mesurer et persister la durée réelle.
5. Ajouter le cache par fingerprint.
6. Appliquer `MAX_TTS_ATTEMPTS = 3`.

### Phase 4 - Timeline

1. Générer et valider le script global.
2. Construire les segments logiques.
3. Adapter le plan à la durée réelle.
4. Construire loop, fade et ducking.
5. Persister et exposer `ProductionPlan`.

### Phase 5 - MCP et V1

1. Ajouter les Use Cases V3 nécessaires.
2. Ajouter leurs adaptateurs MCP.
3. Étendre `generate_video_project` sans casser V1/V2.
4. Faire consommer les assets audio du workspace par Remotion.

### Phase 6 - Vérification

1. Tester l'absence de clé API.
2. Tester les erreurs et les retries séquentiels.
3. Tester la réutilisation du cache.
4. Tester l'adaptation de durée.
5. Tester le fallback sans alignement.
6. Tester loop, fade et ducking.
7. Tester la vérification après rendu.
8. Tester le parcours MCP complet.

## 16. État actuel

```text
[x] Objectif V3 défini
[x] ElevenLabs choisi
[x] Génération TTS globale privilégiée
[x] Maximum de trois tentatives
[x] Vidéo adaptée à la durée réelle de la voix
[x] Musique locale par projet
[x] Endpoint avec timestamps choisi
[x] Cache audio requis
[x] Ducking prévu
[x] Vérification après rendu prévue
[x] Définir les contrats TypeScript
[x] Implémenter l'adaptateur ElevenLabs
[x] Implémenter la persistance audio
[x] Implémenter le VoiceService
[x] Implémenter le MusicService
[x] Implémenter les services de timeline
[x] Implémenter le ProductionPlanService
[x] Ajouter les Use Cases V3
[x] Ajouter les Tools MCP V3
[x] Relier le plan audiovisuel au flux de génération
[x] Intégrer l'audio dans Remotion
[x] Tester le parcours métier de bout en bout
[x] Corriger la préparation déterministe des assets audio Remotion
[x] Isoler le dossier `public` de chaque bundling Remotion
[x] Conserver le staging public jusqu'à la fin du rendu
[x] Mesurer la durée MP3 quand ElevenLabs ne fournit pas de durée
[x] Réparer les anciennes voix via `get_voice_over`
[x] Ajouter le fallback Speech-to-Text horodaté
```

La première tâche de développement est de définir et revoir les contrats V3
avant d'implémenter l'intégration ElevenLabs.

### Incident Remotion audio — résolution

Les erreurs 404 intermittentes sur `voice-over.mp3` et `background.mp3` ne
venaient pas des fichiers source. Le dossier `workspace/<videoId>/public`
était partagé entre plusieurs exécutions du serveur MCP, ce qui permettait à
des bundlings concurrents de copier ou lire les assets au même moment.

`VideoEngineImpl` utilise maintenant un dossier
`.render-public/<uuid>` différent pour chaque bundling, vérifie la préparation
des assets avant l'appel au bundler, puis supprime ce dossier temporaire après
la fin de `selectComposition` et `renderMedia`. Le supprimer immédiatement
après le retour de `bundle()` était trop tôt pour certains traitements
asynchrones de Remotion sous Windows. Un rendu réel du workspace
`julessopha-nouvelle-collection-v2` a été validé avec la voix et la musique,
sans 404.

Après toute modification du moteur, le serveur MCP utilisé par Claude doit
être complètement redémarré afin de charger le nouveau processus Node avant
de relancer un rendu.

### Synchronisation voix sans alignement fournisseur

Pour `olosto-ads-02`, ElevenLabs renvoie l'audio mais pas toujours
`alignment`, `segments` ou `durationMs`. Le client mesure désormais la durée
réelle des trames MP3 reçues et la persiste dans `VoiceOver.durationMs`.
Le cache ne réutilise plus une voix dont la durée est absente ou invalide :
elle est régénérée afin de compléter ses métadonnées.

Cette mesure fournit une durée fiable pour la `Composition`, mais ne crée pas
de calage phrase par phrase. Tant que l'alignement fournisseur reste absent,
les scènes doivent utiliser des segments vérifiés ou rester en attente d'une
confirmation explicite ; aucun timing ne doit être estimé silencieusement.

Le calcul MP3 rejetait auparavant toutes les trames à cause d'une comparaison
bit-à-bit signée en JavaScript. Le masque MPEG est maintenant converti en
entier non signé. `get_voice_over` répare également les métadonnées historiques
dont `durationMs` est encore nul en relisant le fichier audio du workspace.
Sur `olosto-premium-motion-20260917`, la durée mesurée et persistée est de
38740 ms. Aucun alignement phrase par phrase n'est fourni par ce fichier.

Le fallback de synchronisation suit désormais cet ordre :

1. alignement fourni par `with-timestamps` ;
2. mots horodatés de `POST /v1/speech-to-text` sur le MP3 généré ;
3. durée MP3 locale seule, sans calage détaillé.
