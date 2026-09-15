# Remotion Skill

## Objectif

Cette skill définit les règles techniques à suivre lorsqu'une IA crée, modifie, exécute ou rend une vidéo avec Remotion.

Remotion est le moteur de génération et de rendu vidéo du projet.

L'IA reste responsable de la conception de la vidéo et du code.

Le code Remotion constitue la source de vérité de la vidéo.

---

## Quand utiliser cette skill

Utiliser cette skill lorsque l'IA doit :

* créer une composition Remotion ;
* créer ou modifier une scène ;
* créer des animations ;
* créer des transitions ;
* gérer le timing ;
* intégrer des images, vidéos, sons ou autres assets ;
* exécuter une composition ;
* corriger une erreur Remotion ;
* rendre une vidéo.

---

# 1. Principe général

Une vidéo Remotion est un programme React qui décrit visuellement chaque frame de la vidéo.

L'IA doit donc penser à la fois :

```text
Contenu
+
Structure React
+
Timeline
+
Animation
+
Rendu
```

Ne pas traiter Remotion comme un simple système de templates.

Chaque vidéo peut avoir une architecture de code différente selon ses besoins.

---

# 2. Composition principale

Chaque workspace vidéo doit contenir un point d'entrée obligatoire :

```text
composition/MainVideo.tsx
```

Cette composition doit être enregistrée dans l'entrée Remotion du workspace.

La composition doit définir les paramètres nécessaires :

* largeur ;
* hauteur ;
* FPS ;
* durée en frames.

Lorsque ces paramètres ne sont pas fournis par l'utilisateur, l'IA doit choisir des valeurs cohérentes avec le contexte de la vidéo.

---

# 3. Timeline

Remotion fonctionne avec une timeline exprimée en frames.

L'IA doit raisonner en :

```text
frames
FPS
durée
```

et non uniquement en secondes.

Conversion :

```text
frames = durée_en_secondes × FPS
```

L'IA doit utiliser les outils de Remotion adaptés au séquençage lorsque plusieurs éléments doivent apparaître à des moments différents.

Le timing doit être déterminé par le contenu.

Ne pas utiliser systématiquement les mêmes durées pour toutes les scènes.

---

# 4. Séquençage

Lorsqu'une vidéo contient plusieurs parties, l'IA peut utiliser le système de séquençage de Remotion afin de contrôler :

* le début d'un élément ;
* sa durée ;
* son apparition ;
* sa disparition ;
* sa position dans la timeline.

Le choix entre une composition unique, des composants React ou plusieurs séquences dépend de la complexité réelle de la vidéo.

Ne pas créer artificiellement plusieurs composants lorsque cela n'apporte aucune valeur.

---

# 5. Animations

Les animations doivent être conçues en fonction du contenu.

L'IA peut utiliser les mécanismes de Remotion tels que :

* interpolation ;
* spring ;
* transformations CSS ;
* opacité ;
* position ;
* rotation ;
* scale ;
* autres propriétés animables.

Une animation doit avoir une fonction visuelle.

Éviter :

* les animations gratuites ;
* les mouvements permanents ;
* les effets répétitifs ;
* les transitions identiques partout ;
* les animations trop rapides ;
* les animations qui rendent le contenu difficile à lire.

Le mouvement doit servir le message.

---

# 6. Transitions

Les transitions doivent être choisies en fonction du contexte.

Elles peuvent être :

* simples ;
* progressives ;
* dynamiques ;
* basées sur le mouvement ;
* basées sur l'opacité ;
* basées sur la transformation ;
* ou complètement absentes.

Une transition n'est pas obligatoire entre deux scènes.

Ne pas appliquer automatiquement la même transition à toute la vidéo.

---

# 7. Design

L'IA doit prendre les décisions graphiques nécessaires à partir du brief.

Elle peut déterminer :

* palette ;
* typographie ;
* hiérarchie visuelle ;
* espacements ;
* formes ;
* backgrounds ;
* éléments décoratifs ;
* positionnement ;
* contraste ;
* densité visuelle.

Le design doit rester cohérent sur l'ensemble de la vidéo.

Cependant, aucune palette ou identité visuelle globale ne doit être imposée par cette skill.

Le design appartient à la vidéo générée.

---

# 8. Responsive et formats

L'IA doit tenir compte du format demandé.

Formats courants :

```text
Vertical
1080 × 1920

Horizontal
1920 × 1080

Carré
1080 × 1080
```

Ces valeurs sont des références courantes et ne constituent pas une obligation.

L'IA peut choisir une autre résolution lorsque le besoin l'exige.

Tous les éléments importants doivent rester dans la zone visible.

---

# 9. Assets

Les assets doivent être chargés depuis le workspace du vidéo ou depuis les ressources explicitement autorisées.

Avant d'utiliser un asset :

```text
Vérifier
    ↓
Inspecter
    ↓
Comprendre
    ↓
Utiliser
```

Ne jamais supposer :

* qu'une image existe ;
* qu'un fichier possède un format particulier ;
* qu'une vidéo possède une certaine durée ;
* qu'un fichier audio possède une certaine fréquence ou durée.

Lorsque l'intégralité d'une image doit être visible, éviter les configurations qui provoquent un recadrage ou un zoom involontaire.

---

# 10. Audio

Lorsqu'un audio est demandé :

* vérifier son existence ;
* vérifier son format ;
* vérifier sa durée lorsque nécessaire ;
* synchroniser son utilisation avec la timeline ;
* éviter que l'audio dépasse inutilement la durée de la vidéo.

Si plusieurs éléments audio sont utilisés, leur synchronisation doit être déterminée par le contenu.

---

# 11. Organisation du code

L'IA peut créer librement l'organisation interne du workspace.

Exemple possible :

```text
workspace/[video-id]/
├── composition/
├── scenes/
├── animations/
├── transitions/
├── layouts/
├── backgrounds/
├── themes/
├── assets/
└── ...
```

Cette structure est une possibilité, pas un template obligatoire.

L'IA peut créer d'autres dossiers lorsqu'ils sont réellement nécessaires.

Elle doit toutefois éviter :

* les fichiers gigantesques ;
* les composants inutiles ;
* les abstractions artificielles ;
* la duplication importante ;
* les fonctions génériques sans véritable usage.

---

# 12. React

Le code Remotion doit respecter les principes React.

Les composants doivent avoir une responsabilité claire.

Éviter de mélanger inutilement :

```text
création du contenu
+
gestion de la timeline
+
configuration globale
+
logique complexe
```

dans un seul composant lorsque la complexité devient importante.

Cependant, ne pas créer des couches supplémentaires uniquement pour respecter une architecture théorique.

La simplicité est prioritaire.

---

# 13. Styles

L'IA peut utiliser :

* CSS ;
* CSS Modules ;
* styles React ;
* mécanismes de style compatibles avec le projet.

Lorsque le projet utilise des fichiers CSS séparés, conserver cette convention.

Les styles doivent rester proches du composant auquel ils appartiennent lorsque cela améliore la maintenance.

Ne pas introduire une architecture CSS complexe sans nécessité.

---

# 14. Exécution

Après toute création ou modification importante :

```text
Code
 ↓
Exécution
 ↓
Erreur ?
 ├── Oui → analyser → corriger → réexécuter
 └── Non → continuer
```

L'IA ne doit pas considérer le code comme valide uniquement parce qu'il semble correct.

Elle doit réellement l'exécuter.

---

# 15. Diagnostic des erreurs

Lorsqu'une erreur Remotion apparaît :

1. lire le message complet ;
2. identifier le fichier concerné ;
3. identifier la cause ;
4. corriger la cause ;
5. réexécuter ;
6. vérifier qu'aucune nouvelle erreur n'est apparue.

Exemples de problèmes à rechercher :

* import incorrect ;
* fichier inexistant ;
* mauvaise composition ;
* mauvaise durée ;
* problème React ;
* asset inaccessible ;
* erreur JavaScript ;
* erreur TypeScript ;
* configuration Remotion incorrecte ;
* problème de rendu.

Ne pas masquer une erreur.

---

# 16. Rendu

Une composition fonctionnelle doit ensuite être rendue avec le moteur Remotion.

Le processus général est :

```text
Entry point
    ↓
Bundle
    ↓
Composition
    ↓
Render
    ↓
MP4
```

Le bundling et le rendu sont deux étapes distinctes.

Le système doit vérifier que la composition sélectionnée correspond bien à la vidéo à rendre.

---

# 17. Rendu final

Le rendu final doit être enregistré dans :

```text
output/[video-id].mp4
```

Le workspace doit conserver le code source de la vidéo.

Le fichier MP4 final ne doit pas être utilisé comme remplacement du code source.

Principe :

```text
Code = source de vérité

MP4 = résultat généré
```

---

# 18. Vérification du rendu

Après le rendu :

* vérifier que le processus s'est terminé ;
* vérifier que le fichier existe ;
* vérifier que sa taille est cohérente ;
* vérifier qu'il correspond au rendu demandé ;
* récupérer les informations disponibles sur le rendu.

Si le rendu échoue, revenir au diagnostic plutôt que déclarer la génération terminée.

---

# 19. Modification d'une vidéo

Lorsqu'une vidéo existante doit être modifiée :

```text
Identifier le workspace
        ↓
Inspecter le code
        ↓
Comprendre la structure
        ↓
Modifier uniquement ce qui est nécessaire
        ↓
Exécuter
        ↓
Corriger
        ↓
Rendre
        ↓
Vérifier
```

Ne pas supprimer et reconstruire toute la vidéo si une modification ciblée suffit.

Préserver le travail existant lorsqu'il est valide.

---

# 20. Dépendances

L'IA ne doit pas installer de nouvelle dépendance.

Elle doit utiliser les packages déjà disponibles dans le projet.

Si une fonctionnalité nécessite réellement une dépendance absente :

```text
Identifier le besoin
        ↓
Arrêter l'installation automatique
        ↓
Signaler la dépendance nécessaire
```

L'installation doit être effectuée par le développeur.

---

# 21. Ce que cette skill n'impose pas

Cette skill ne définit pas :

* un catalogue de scènes ;
* un catalogue d'animations ;
* un catalogue de transitions ;
* un template publicitaire ;
* une palette de couleurs ;
* une structure de vidéo obligatoire ;
* une durée obligatoire ;
* un style graphique obligatoire.

L'IA doit rester libre de concevoir chaque vidéo.

---

# 22. Critères de réussite

Le travail Remotion est considéré comme réussi lorsque :

```text
Composition valide
        +
Code exécutable
        +
Assets accessibles
        +
Timeline correcte
        +
Erreurs corrigées
        +
Rendu terminé
        +
Fichier final vérifié
```

---

# Règle générale

L'IA doit utiliser Remotion comme un moteur de création programmatique.

Elle doit privilégier :

* la qualité visuelle ;
* la lisibilité ;
* la cohérence ;
* la précision du timing ;
* la simplicité du code ;
* la maintenabilité ;
* l'adaptation au contenu.

Le code doit être suffisamment structuré pour être modifié ultérieurement par une autre IA ou par un développeur humain.

Remotion exécute la vision.

L'IA conçoit la vision.
