# Video Generation Skill

## Objectif

Cette skill décrit comment générer automatiquement une vidéo avec Video SaaS.

L'IA reçoit une demande en langage naturel et doit transformer cette demande en une vidéo Remotion fonctionnelle, rendue et vérifiée.

L'IA est responsable des décisions créatives et techniques.

Remotion est uniquement le moteur d'exécution et de rendu.

---

## Quand utiliser cette skill

Utiliser cette skill lorsqu'un utilisateur demande :

* de créer une nouvelle vidéo ;
* de créer une publicité ;
* de créer une vidéo promotionnelle ;
* de créer une vidéo explicative ;
* de créer une vidéo à partir d'un brief ;
* de générer une vidéo à partir d'un prompt.

---

## Principe fondamental

Il n'existe pas de scénario, template, scène ou animation imposé.

L'IA doit analyser la demande et concevoir elle-même :

* la structure de la vidéo ;
* les scènes ;
* les layouts ;
* les animations ;
* les transitions ;
* les couleurs ;
* la typographie ;
* les backgrounds ;
* l'utilisation des assets ;
* la durée des scènes ;
* le rythme ;
* le format ;
* le contenu visuel.

La structure créée doit être adaptée au contenu demandé.

Ne pas chercher à faire entrer chaque vidéo dans un modèle prédéfini.

---

## Cycle de génération

Toute génération doit suivre ce cycle :

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

L'IA peut répéter les étapes `Exécuter → Observer → Corriger` autant que nécessaire.

---

## 1. Comprendre

Analyser le prompt utilisateur.

Identifier notamment :

* objectif de la vidéo ;
* public cible ;
* message principal ;
* ton ;
* marque ou entreprise ;
* produits ou services ;
* appel à l'action ;
* assets mentionnés ;
* durée demandée ;
* format demandé ;
* contraintes particulières.

Si une information n'est pas précisée et qu'elle est nécessaire, l'IA doit prendre une décision raisonnable plutôt que bloquer inutilement la génération.

---

## 2. Inspecter

Avant de créer le code :

* inspecter le workspace ;
* inspecter les fichiers existants ;
* inspecter les assets disponibles ;
* identifier les contraintes techniques ;
* vérifier le code existant lorsqu'il s'agit d'une modification.

Ne jamais supposer qu'un fichier ou un asset existe.

Utiliser les outils MCP disponibles pour obtenir les informations nécessaires.

---

## 3. Planifier

Construire mentalement ou explicitement un plan de production.

Le plan doit notamment déterminer :

* format ;
* résolution ;
* FPS ;
* durée ;
* nombre de scènes ;
* contenu de chaque scène ;
* timing ;
* assets utilisés ;
* transitions ;
* animations ;
* composition générale.

Le plan doit rester flexible.

Il ne doit pas être basé sur une bibliothèque obligatoire de scènes ou d'animations.

---

## 4. Créer

Créer le code Remotion dans le workspace du vidéo.

Le workspace appartient à un seul vidéo.

L'IA peut créer les fichiers et dossiers dont elle a besoin.

La structure interne du workspace est libre, à condition de respecter les contraintes du projet.

Le point d'entrée Remotion obligatoire est :

```text
composition/MainVideo.tsx
```

Le code doit être réellement exécutable.

Les responsabilités doivent être séparées lorsque cela améliore la lisibilité et la maintenance.

Éviter les fichiers inutilement gigantesques.

---

## 5. Utiliser les assets

Avant d'utiliser un asset :

1. vérifier qu'il existe ;
2. l'inspecter si nécessaire ;
3. déterminer son type et ses dimensions ;
4. choisir une utilisation adaptée au contenu.

Ne jamais inventer un asset inexistant.

Les assets doivent être intégrés sans déformation inutile.

L'IA doit notamment éviter les recadrages ou zooms involontaires lorsque l'intégralité d'un asset doit être visible.

---

## 6. Exécuter

Après avoir créé ou modifié le code :

* exécuter le code ;
* vérifier que Remotion peut charger la composition ;
* détecter les erreurs ;
* analyser les messages d'erreur.

Une génération ne doit jamais être considérée comme terminée uniquement parce que les fichiers ont été écrits.

---

## 7. Corriger

Lorsqu'une erreur apparaît :

1. lire l'erreur ;
2. identifier sa cause ;
3. inspecter les fichiers concernés ;
4. modifier uniquement ce qui est nécessaire ;
5. réexécuter.

Ne pas contourner une erreur sans comprendre sa cause.

Répéter cette boucle jusqu'à obtenir une exécution correcte ou jusqu'à atteindre une impossibilité technique réelle.

---

## 8. Rendre

Lorsque la composition fonctionne :

* lancer le rendu Remotion ;
* produire le fichier vidéo final ;
* vérifier que le rendu s'est terminé correctement.

Le fichier final doit être placé dans :

```text
output/[video-id].mp4
```

Le dossier `output/` ne doit contenir que les vidéos finales.

Les fichiers de travail restent dans le workspace du vidéo.

---

## 9. Vérifier

Après le rendu :

* vérifier que le fichier vidéo existe ;
* vérifier que le rendu est terminé ;
* vérifier que le fichier n'est pas vide ou manifestement invalide ;
* récupérer les informations du rendu ;
* considérer la génération comme réussie uniquement après cette vérification.

---

## Modification d'une vidéo existante

Si la demande concerne une vidéo existante :

1. identifier le `video-id` ;
2. ouvrir son workspace ;
3. inspecter le code existant ;
4. comprendre la structure actuelle ;
5. identifier les fichiers concernés ;
6. modifier le code existant ;
7. exécuter ;
8. corriger les erreurs ;
9. rendre une nouvelle version ;
10. vérifier le résultat.

Ne pas recréer inutilement toute la vidéo.

---

## Utilisation des outils MCP

L'IA doit utiliser les outils MCP selon leurs responsabilités.

Exemples :

```text
InspectDirectoryTool
    → inspecter une structure

ReadFileTool
    → lire un fichier

WriteFileTool
    → créer un fichier

UpdateFileTool
    → modifier un fichier

DeleteFileTool
    → supprimer un fichier

InspectAssetTool
    → inspecter un asset

ExecuteCodeTool
    → exécuter du code

RenderVideoTool
    → lancer un rendu

GetRenderResultTool
    → vérifier le résultat du rendu
```

L'IA doit choisir l'outil correspondant à l'action qu'elle souhaite réaliser.

---

## Dépendances

L'IA ne doit jamais installer de nouvelles dépendances.

Elle doit utiliser uniquement les dépendances déjà disponibles dans le projet.

Si une nouvelle dépendance est réellement nécessaire, la génération doit être arrêtée et la nécessité doit être signalée au développeur.

---

## Sécurité

L'IA ne doit pas :

* accéder arbitrairement au système de fichiers en dehors des espaces autorisés ;
* supprimer des fichiers du projet sans raison ;
* modifier les fichiers de configuration du projet sans nécessité ;
* installer des packages ;
* exécuter des commandes destructrices ;
* exposer des informations sensibles.

Les outils MCP doivent respecter les limites définies par le backend.

---

## Critères de réussite

Une génération est considérée comme réussie uniquement lorsque :

```text
Prompt compris
    +
Workspace correctement inspecté
    +
Code Remotion créé/modifié
    +
Composition exécutable
    +
Erreurs corrigées
    +
Vidéo rendue
    +
Fichier final vérifié
```

Le simple fait d'avoir généré du code ne constitue pas une réussite.

---

## Règle générale

L'IA doit agir comme un développeur capable de produire une vidéo complète :

```text
Analyser
→ Décider
→ Construire
→ Tester
→ Observer
→ Corriger
→ Rendre
→ Vérifier
```

Elle doit privilégier :

* l'autonomie ;
* la simplicité ;
* la qualité visuelle ;
* la qualité du code ;
* la robustesse ;
* la réutilisabilité raisonnable ;
* l'adaptation au contenu.

Elle ne doit pas transformer le projet en système de templates rigides.
