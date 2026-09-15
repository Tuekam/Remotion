# Workspace Skill

## Objectif

Cette skill définit les règles permettant à l'IA d'inspecter, comprendre et modifier le workspace d'une vidéo.

Le workspace contient le code source, les assets et les ressources nécessaires à la génération d'une vidéo.

L'IA doit considérer le workspace comme un projet de code réel.

Elle doit donc l'inspecter avant de le modifier et préserver autant que possible le travail déjà valide.

---

# 1. Principe fondamental

L'IA ne doit jamais supposer la structure interne d'un workspace.

Avant toute modification :

```text
Inspecter
    ↓
Comprendre
    ↓
Décider
    ↓
Modifier
```

Ne jamais commencer directement par créer ou supprimer des fichiers lorsqu'une inspection est nécessaire.

---

# 2. Workspace d'une vidéo

Chaque vidéo possède son propre workspace.

Structure générale :

```text
package/
└── services/
    └── video-engine/
        └── workspace/
            └── [video-id]/
```

Le `video-id` identifie de manière unique le workspace.

Exemple :

```text
workspace/
└── 8f3a2c/
```

Les fichiers d'une vidéo ne doivent pas être mélangés avec ceux d'une autre vidéo.

---

# 3. Structure interne

Aucune structure interne complète n'est imposée.

Un workspace peut contenir par exemple :

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

Mais cette structure est indicative.

L'IA peut :

* créer de nouveaux dossiers ;
* ne pas utiliser certains dossiers ;
* créer une organisation différente ;
* regrouper certains fichiers ;
* créer des sous-dossiers supplémentaires.

La structure doit dépendre des besoins réels de la vidéo.

---

# 4. Point d'entrée obligatoire

Même si l'organisation interne est libre, le workspace doit contenir :

```text
composition/MainVideo.tsx
```

Ce fichier constitue le point d'entrée obligatoire de la composition principale.

L'IA doit préserver ce contrat.

---

# 5. Inspection initiale

Lorsqu'un workspace existe déjà, l'IA doit commencer par inspecter :

* les dossiers ;
* les fichiers ;
* la composition principale ;
* les fichiers de configuration pertinents ;
* les assets ;
* les éventuels fichiers déjà générés.

Objectif :

```text
Comprendre ce qui existe
```

avant de décider :

```text
Ce qui doit être créé ou modifié
```

---

# 6. Inspection ciblée

L'IA ne doit pas forcément lire tous les fichiers du workspace.

Elle doit adapter son inspection à la tâche.

Exemple :

Si l'utilisateur demande :

> Change le texte de la scène 2.

L'IA doit rechercher la scène concernée et ses dépendances plutôt que de lire inutilement tout le projet.

Si l'utilisateur demande :

> Refonte complètement cette vidéo.

L'IA doit effectuer une inspection plus large.

---

# 7. Création de fichiers

Avant de créer un fichier :

1. vérifier qu'il n'existe pas déjà ;
2. vérifier si une fonctionnalité équivalente existe ;
3. déterminer si un nouveau fichier est réellement nécessaire ;
4. créer le fichier au bon endroit.

Éviter de créer plusieurs fichiers qui remplissent la même responsabilité.

---

# 8. Modification de fichiers

Avant de modifier un fichier :

1. le lire ;
2. comprendre son rôle ;
3. identifier les dépendances importantes ;
4. effectuer la modification ;
5. préserver les parties qui ne sont pas concernées.

Ne pas remplacer aveuglément un fichier existant.

---

# 9. Suppression de fichiers

La suppression doit être exceptionnelle.

Avant de supprimer un fichier :

* vérifier ses références ;
* vérifier ses imports ;
* vérifier s'il est utilisé par la composition ;
* vérifier s'il contient des assets nécessaires ;
* déterminer si son remplacement est déjà opérationnel.

Ne jamais supprimer un fichier simplement parce qu'il semble inutile.

---

# 10. Déplacement de fichiers

Avant de déplacer un fichier :

```text
Identifier les références
        ↓
Déplacer
        ↓
Mettre à jour les imports
        ↓
Exécuter
        ↓
Vérifier
```

Un déplacement ne doit pas laisser d'imports cassés.

---

# 11. Lecture et écriture

Les opérations sur les fichiers doivent être réalisées à travers les capacités MCP disponibles.

Exemples :

```text
InspectDirectoryTool
ReadFileTool
WriteFileTool
UpdateFileTool
DeleteFileTool
```

L'IA doit choisir l'outil correspondant à l'opération.

Elle ne doit pas utiliser une action destructive lorsqu'une action ciblée suffit.

---

# 12. Assets

Les assets appartiennent au workspace de la vidéo.

Exemple :

```text
workspace/[video-id]/
└── assets/
    ├── logo.png
    ├── product.jpg
    └── music.mp3
```

Mais l'IA peut organiser les assets différemment si cela est nécessaire.

Avant d'utiliser un asset :

```text
Vérifier son existence
        ↓
Inspecter si nécessaire
        ↓
Identifier son type
        ↓
Déterminer son utilisation
```

Ne jamais inventer le chemin d'un asset.

---

# 13. Préservation du travail existant

Lorsqu'un workspace contient déjà du code fonctionnel :

> Le code valide doit être préservé autant que possible.

L'IA doit préférer :

```text
Modification ciblée
```

à :

```text
Suppression + reconstruction complète
```

sauf lorsque la reconstruction est réellement nécessaire.

---

# 14. Cohérence des imports

Après toute modification structurelle, l'IA doit vérifier les imports.

Elle doit notamment rechercher :

* fichiers déplacés ;
* chemins incorrects ;
* extensions incorrectes ;
* imports circulaires problématiques ;
* fichiers supprimés encore référencés.

---

# 15. Cohérence de la composition

Après une modification importante du workspace, l'IA doit vérifier que :

```text
composition/MainVideo.tsx
```

reste valide et que la composition peut être chargée par Remotion.

---

# 16. Exécution après modification

Toute modification importante doit être suivie d'une vérification.

Cycle :

```text
Modifier
   ↓
Exécuter
   ↓
Erreur ?
   ├── Oui → analyser → corriger
   └── Non → continuer
```

Une modification de fichiers n'est pas considérée comme terminée tant que le code concerné n'a pas été vérifié.

---

# 17. Limites du workspace

L'IA doit rester dans les ressources autorisées par le système.

Elle ne doit pas :

* rechercher arbitrairement des fichiers personnels sur la machine ;
* modifier des fichiers hors du projet sans autorisation ;
* supprimer des dossiers système ;
* modifier le projet d'une autre vidéo ;
* accéder à des secrets non nécessaires ;
* contourner les restrictions du backend.

---

# 18. Dépendances du projet

Le workspace vidéo ne doit pas gérer l'installation de packages.

L'IA ne doit pas modifier les dépendances du projet pour résoudre automatiquement un problème.

Si une dépendance manque :

```text
Identifier le besoin
        ↓
Signaler le problème
        ↓
Laisser le développeur décider
```

---

# 19. Conventions existantes

Lorsqu'un workspace possède déjà une convention claire, l'IA doit la respecter.

Exemples :

```text
noms de fichiers
noms de composants
organisation des dossiers
convention CSS
naming
structure des imports
```

Ne pas réorganiser automatiquement le projet uniquement parce qu'une autre organisation semble préférable.

---

# 20. Modification par un autre agent

Le workspace peut être modifié par plusieurs agents IA au cours de la vie du projet.

Le code doit donc rester compréhensible.

Lorsqu'elle modifie le workspace, l'IA doit produire du code :

* lisible ;
* cohérent ;
* explicite ;
* maintenable ;
* suffisamment documenté lorsque nécessaire.

Éviter les solutions difficiles à comprendre uniquement pour réduire le nombre de lignes.

---

# 21. Workspace vide

Lorsqu'un workspace vient d'être créé :

```text
Inspecter
    ↓
Créer la structure minimale nécessaire
    ↓
Créer MainVideo.tsx
    ↓
Créer uniquement les fichiers nécessaires
```

Ne pas générer automatiquement une architecture complète contenant des dossiers inutilisés.

---

# 22. Workspace existant

Lorsqu'un workspace existe déjà :

```text
Inspecter
    ↓
Identifier la structure
    ↓
Identifier le code valide
    ↓
Identifier la tâche
    ↓
Modifier uniquement ce qui est nécessaire
```

La structure existante est une information importante.

---

# 23. Erreur pendant une modification

Si une modification provoque une erreur :

1. identifier le dernier changement ;
2. inspecter le fichier concerné ;
3. comprendre la cause ;
4. corriger ;
5. réexécuter.

Ne pas continuer à ajouter des modifications alors qu'une erreur précédente n'est pas comprise.

---

# 24. Critères de réussite

Une opération sur le workspace est considérée comme réussie lorsque :

```text
Workspace correctement identifié
        +
Structure correctement comprise
        +
Modification réalisée
        +
Imports cohérents
        +
Composition toujours valide
        +
Code vérifié
```

---

# Règle générale

L'IA doit traiter chaque workspace comme un véritable projet logiciel.

La règle principale est :

```text
Inspecter avant de modifier.
Modifier le minimum nécessaire.
Vérifier après modification.
Préserver ce qui fonctionne.
```

L'IA doit être autonome dans ses décisions tout en restant prudente dans ses modifications.
