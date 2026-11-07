# Essence Bénin — Guide opérationnel des stations et des mises à jour

**Version :** 1.0  
**Projet :** Essence Bénin  
**Objectif :** définir comment les stations sont ajoutées, vérifiées, mises à jour et modérées afin de fournir des informations utiles et crédibles aux conducteurs.

---

## 1. Résumé exécutif

Essence Bénin doit fonctionner comme un **annuaire collaboratif vérifié**, et non comme une simple liste de stations.

Le principe central est le suivant :

> Une station peut être visible dans l’application sans que son statut soit présenté comme certain. Toute information importante doit avoir une source, une date, une heure et un niveau de fiabilité.

Le fonctionnement recommandé repose sur quatre canaux complémentaires :

1. **Ajout initial par l’équipe Essence Bénin** : collecte et vérification de la fiche de la station.
2. **Espace partenaire pour la station** : le responsable confirme ou modifie lui-même ses informations.
3. **WhatsApp ou téléphone** : solution simple pour les stations qui ne souhaitent pas utiliser un tableau de bord.
4. **Signalements des utilisateurs** : informations de terrain soumises à modération et affichées avec un niveau de confiance adapté.

La première version actuelle fonctionne avec un catalogue local de démonstration et des signalements conservés sur l’appareil. Pour un lancement réel, il faudra ajouter une base de données partagée, un espace d’administration et un espace partenaire.

---

## 2. Fonctionnement actuel de l’application

La version MVP contient :

- Un catalogue initial de stations.
- Une carte schématique et une liste.
- Une recherche par ville, quartier et nom.
- Les statuts **Essence disponible**, **Rupture signalée** et **À vérifier**.
- Un écran de signalement terrain.
- Un guide expliquant la fiabilité des données.
- Une persistance locale des signalements sur l’appareil.

### Limites actuelles à connaître

- Les stations ne peuvent pas encore se connecter elles-mêmes.
- Les signalements ne sont pas encore synchronisés entre les appareils.
- L’équipe ne dispose pas encore d’un tableau de bord de modération.
- Le catalogue initial doit être remplacé ou complété par des fiches réellement vérifiées.
- Les statuts visibles dans le MVP ne doivent pas être considérés comme des données officielles tant qu’ils n’ont pas été confirmés.

---

## 3. Les acteurs et leurs responsabilités

### 3.1. Administrateur principal

Il contrôle l’ensemble de la plateforme :

- crée et valide les fiches de stations ;
- attribue les comptes partenaires ;
- valide les demandes de modification sensibles ;
- gère les utilisateurs et les rôles ;
- traite les signalements abusifs ;
- consulte les statistiques ;
- suspend une station ou un compte si nécessaire ;
- conserve l’historique des changements.

### 3.2. Agent de vérification Essence Bénin

Il peut :

- appeler les stations ;
- visiter les stations ;
- relever les coordonnées GPS ;
- vérifier les horaires et les services ;
- prendre des notes de terrain ;
- demander une preuve au responsable ;
- attribuer ou renouveler le niveau de confiance d’une fiche.

### 3.3. Responsable de station partenaire

Il peut uniquement gérer les informations de sa station :

- confirmer la disponibilité de l’essence ;
- signaler une rupture ;
- indiquer une reprise de service ;
- modifier les horaires et le téléphone ;
- ajouter les services proposés ;
- répondre aux demandes de vérification ;
- consulter les statistiques de sa fiche.

Il ne doit pas pouvoir modifier librement l’historique, les avis des utilisateurs ou les informations d’une autre station.

### 3.4. Utilisateur conducteur

Il peut :

- consulter les stations ;
- rechercher par ville ou autour de sa position ;
- déclarer « essence disponible », « rupture » ou « inconnu » ;
- signaler une erreur de localisation ou de nom ;
- indiquer qu’une station est fermée ou déplacée.

L’utilisateur ne doit pas pouvoir publier directement une information sensible sans contrôle minimum, surtout s’il s’agit d’un nouveau prix, d’un numéro officiel ou d’une accusation concernant une station.

---

## 4. Comment ajouter une nouvelle station

### 4.1. Méthode recommandée au démarrage : ajout manuel vérifié

Pour les premières stations, l’équipe doit créer la fiche manuellement.

#### Étapes

1. Identifier la station.
2. Vérifier qu’elle n’existe pas déjà dans le catalogue.
3. Appeler la station ou la visiter.
4. Demander le nom et la fonction du contact.
5. Relever les informations obligatoires.
6. Obtenir les coordonnées GPS.
7. Confirmer les horaires et les services.
8. Demander l’autorisation d’afficher la fiche.
9. Enregistrer la source et la date de vérification.
10. Publier la fiche avec le statut approprié.

### 4.2. Fiche de collecte obligatoire

Chaque station doit avoir au minimum les champs suivants :

| Champ | Obligatoire | Description |
|---|---:|---|
| Nom affiché | Oui | Nom public de la station |
| Nom légal ou société | Si disponible | Entité exploitante |
| Opérateur ou marque | Oui | Marque visible sur place |
| Ville | Oui | Commune ou ville |
| Quartier | Oui | Zone ou arrondissement |
| Adresse | Oui | Adresse lisible par un conducteur |
| Latitude | Oui | Coordonnée GPS |
| Longitude | Oui | Coordonnée GPS |
| Téléphone public | Recommandé | Numéro de la station ou du responsable |
| Horaires | Recommandé | Heures d’ouverture |
| Essence | Oui | Disponible, rupture ou inconnu |
| Gasoil | Recommandé | Disponible, rupture ou inconnu |
| Services | Recommandé | Boutique, lavage, huile, toilettes, etc. |
| Contact partenaire | Recommandé | Nom, fonction et canal de contact |
| Source | Oui | Visite, appel, WhatsApp, document ou utilisateur |
| Date de vérification | Oui | Date et heure de la dernière vérification |
| Niveau de confiance | Oui | Vérifiée, partenaire, utilisateur ou ancienne |
| Notes internes | Non public | Détails réservés à l’équipe |

### 4.3. Règle anti-doublon

Avant de créer une fiche, effectuer une recherche sur :

- le nom de la station ;
- la ville ;
- le quartier ;
- le téléphone ;
- les coordonnées GPS.

Deux fiches distantes de quelques dizaines de mètres doivent être examinées manuellement. Une station peut avoir plusieurs enseignes ou plusieurs points de vente, mais cela doit être documenté.

---

## 5. Comment une station met à jour ses informations

Il faut proposer plusieurs méthodes, car tous les responsables n’auront pas le même niveau de disponibilité ou de confort numérique.

### 5.1. Option A — Espace partenaire dans l’application

C’est la solution cible.

Le responsable reçoit un lien ou un code d’activation lié à sa station. Après connexion, il peut :

- confirmer le statut de l’essence en un clic ;
- modifier les horaires ;
- modifier le téléphone ;
- renseigner le prix si cette information est autorisée ;
- activer ou désactiver les services ;
- consulter l’heure de sa dernière mise à jour ;
- voir les questions ou demandes de vérification de l’équipe.

Les changements sensibles doivent rester en attente de validation lorsqu’ils concernent :

- le nom de la station ;
- le propriétaire ou l’opérateur ;
- la position GPS ;
- la fermeture définitive ;
- le numéro principal affiché ;
- une modification qui pourrait créer un doublon.

### 5.2. Option B — WhatsApp Business

C’est la solution la plus facile à déployer au début.

L’équipe crée un contact WhatsApp pour chaque station partenaire et envoie un message standardisé une ou deux fois par jour.

#### Message de confirmation

> Bonjour [Nom], ici Essence Bénin. Merci de confirmer la situation de votre station [Nom de la station] :
>
> - Essence : disponible / rupture / inconnu
> - Gasoil : disponible / rupture / inconnu
> - Horaires aujourd’hui :
> - Prix à afficher, si applicable :
> - Remarque éventuelle :
>
> Merci d’indiquer également l’heure de votre réponse.

La réponse est ensuite saisie par l’équipe dans le tableau d’administration, avec la mention **« confirmé par la station via WhatsApp »**.

### 5.3. Option C — Appel téléphonique

Pour une station qui préfère le téléphone :

1. l’agent utilise une fiche d’appel ;
2. il note le nom du répondant ;
3. il note l’heure de l’appel ;
4. il pose les mêmes questions standardisées ;
5. il saisit la mise à jour dans le système ;
6. il ajoute une note interne si la réponse est incertaine.

Un appel ne doit pas être présenté comme une confirmation officielle si l’agent n’a pas pu identifier clairement la station ou son représentant.

### 5.4. Option D — Visite terrain

La visite est la méthode la plus fiable pour l’ajout initial et les contrôles périodiques.

L’agent doit :

- vérifier l’enseigne ;
- vérifier la position GPS ;
- vérifier les accès ;
- demander le contact du responsable ;
- observer si la station est ouverte ;
- noter les produits visibles ou déclarés ;
- prendre une photo uniquement avec autorisation ;
- consigner l’heure exacte de la visite.

---

## 6. Les statuts de disponibilité

L’application doit séparer **le produit** et **la confiance de l’information**.

### 6.1. Statut du produit

Pour chaque produit :

- **Disponible** : la station ou un signalement récent indique que le produit est servi.
- **Rupture signalée** : une station ou un utilisateur indique une rupture.
- **À vérifier** : aucune information assez récente ou suffisamment fiable.
- **Fermé temporairement** : la station est connue mais ne sert pas actuellement.
- **Fermé définitivement** : la fermeture a été confirmée par l’équipe.

### 6.2. Niveau de confiance

| Niveau | Source | Affichage recommandé |
|---|---|---|
| Très fiable | Visite récente de l’équipe | Vérifiée par Essence Bénin |
| Fiable | Responsable identifié de la station | Confirmée par la station |
| Moyenne | Plusieurs signalements concordants | Signalements concordants |
| Faible | Signalement unique récent | Signalée par un utilisateur |
| Ancienne | Information dépassant le délai défini | À vérifier |

Le paiement d’une station ne doit jamais modifier son niveau de confiance.

### 6.3. Expiration automatique

Un statut de disponibilité doit expirer automatiquement après un délai configurable.

Recommandation initiale :

- moins de 6 heures : statut récent ;
- entre 6 et 24 heures : statut à surveiller ;
- plus de 24 heures : statut à vérifier ;
- plus de 7 jours : fiche à contrôler, même si la station est toujours visible.

Ces délais peuvent changer selon la fréquence réelle des mises à jour.

---

## 7. Traitement des signalements utilisateurs

### 7.1. Parcours utilisateur

1. L’utilisateur ouvre la fiche d’une station.
2. Il choisit un statut.
3. L’application enregistre la station, le statut, la date et l’heure.
4. L’utilisateur peut ajouter une remarque facultative.
5. Le signalement est marqué comme non vérifié par défaut.
6. Le système le compare aux autres signalements et à la dernière confirmation de la station.

### 7.2. Règles de publication

- Un signalement récent peut apparaître comme **signalement utilisateur**.
- Plusieurs signalements concordants peuvent augmenter la confiance.
- Un signalement contradictoire ne doit pas effacer automatiquement celui de la station.
- Un signalement ancien doit expirer.
- Les utilisateurs ne doivent pas voir les informations personnelles du responsable.
- Les abus répétés doivent pouvoir être bloqués ou limités.

### 7.3. Modération minimale

Le tableau d’administration doit permettre de :

- voir les derniers signalements ;
- filtrer par ville ou station ;
- accepter, masquer ou corriger un signalement ;
- identifier les utilisateurs qui publient trop de données contradictoires ;
- conserver la raison d’une décision ;
- contacter la station en cas de conflit.

---

## 8. Tableau de bord d’administration nécessaire

### 8.1. Écran « Stations »

Fonctions :

- rechercher une station ;
- filtrer par ville, statut, partenaire et niveau de confiance ;
- créer une fiche ;
- modifier une fiche ;
- désactiver une fiche ;
- fusionner les doublons ;
- voir la dernière mise à jour ;
- exporter les données.

### 8.2. Écran « Signalements »

Fonctions :

- consulter les signalements récents ;
- identifier les contradictions ;
- classer par urgence ;
- valider ou rejeter ;
- voir l’historique d’une station ;
- déclencher une demande de confirmation.

### 8.3. Écran « Partenaires »

Fonctions :

- créer une invitation ;
- associer un responsable à une station ;
- suspendre un accès ;
- voir les dernières connexions ;
- voir le taux de réponse ;
- gérer le statut partenaire ou vérifié.

### 8.4. Écran « Contrôles à effectuer »

Le système doit créer automatiquement une liste de tâches :

- stations sans mise à jour depuis 24 heures ;
- stations sans confirmation depuis 7 jours ;
- stations avec des signalements contradictoires ;
- stations dont le téléphone ne répond plus ;
- fiches ayant plusieurs coordonnées proches ;
- demandes de correction en attente.

---

## 9. Processus opérationnel quotidien

### Chaque matin

1. Vérifier les stations prioritaires.
2. Relancer les partenaires par WhatsApp ou appel.
3. Traiter les signalements de la veille.
4. Identifier les villes où les données sont trop anciennes.
5. Mettre à jour les statuts confirmés.

### Pendant la journée

1. Répondre aux demandes des stations.
2. Ajouter les nouvelles stations rencontrées.
3. Examiner les signalements contradictoires.
4. Corriger les erreurs de carte ou de téléphone.
5. Enregistrer toutes les actions dans l’historique.

### Chaque soir

1. Vérifier les ruptures les plus importantes.
2. Contrôler les stations à forte consultation.
3. Relancer les fiches sans source récente.
4. Préparer la liste de vérification du lendemain.

---

## 10. Historique obligatoire des changements

Chaque modification doit enregistrer :

- l’identifiant de la station ;
- le champ modifié ;
- l’ancienne valeur ;
- la nouvelle valeur ;
- la personne ou le compte à l’origine du changement ;
- le canal utilisé : application, WhatsApp, téléphone, visite ;
- la date et l’heure ;
- le niveau de confiance ;
- la décision de modération si nécessaire.

L’historique est indispensable pour comprendre pourquoi une information est affichée et pour résoudre les conflits.

---

## 11. Architecture technique cible

### 11.1. Base de données partagée

Les principales tables devraient être :

- `stations` : informations principales ;
- `station_products` : essence, gasoil et autres produits ;
- `station_services` : lavage, boutique, huile, toilettes, etc. ;
- `station_contacts` : contacts partenaires ;
- `status_updates` : chaque mise à jour de disponibilité ;
- `user_reports` : signalements utilisateurs ;
- `verification_events` : contrôles réalisés ;
- `partner_accounts` : comptes des stations ;
- `moderation_actions` : décisions de l’équipe ;
- `audit_logs` : historique technique complet.

### 11.2. Principe de sécurité

- Les mots de passe ne doivent jamais être stockés en clair.
- Un partenaire ne voit que sa station.
- Les utilisateurs ne voient pas les notes internes.
- Les clés API restent côté serveur.
- Les coordonnées GPS d’une station peuvent être publiques, mais les coordonnées personnelles d’un agent ne le sont pas.
- Les exports doivent être réservés aux administrateurs autorisés.
- Les actions importantes doivent demander une confirmation.

### 11.3. Notifications

Prévoir à terme :

- notification au partenaire quand une station reçoit plusieurs signalements contradictoires ;
- rappel automatique si la station n’a pas confirmé son statut ;
- notification à l’équipe si une station populaire passe en rupture ;
- notification de confirmation après une mise à jour.

---

## 12. Accord avec les stations partenaires

Avant d’afficher une station comme partenaire, obtenir un accord simple, même par écrit via WhatsApp ou un formulaire.

L’accord doit préciser :

- que la station autorise l’utilisation de ses informations publiques ;
- les informations qu’elle accepte de publier ;
- le nom du responsable autorisé ;
- le canal officiel de mise à jour ;
- la fréquence souhaitée des confirmations ;
- la possibilité de corriger ou retirer la fiche ;
- la distinction entre information confirmée et signalement utilisateur ;
- le fait qu’un partenaire ne peut pas acheter un faux statut positif ;
- les conditions d’utilisation du logo ou de la marque, si nécessaire.

Pour les photos, logos, prix ou messages promotionnels, demander une autorisation séparée.

---

## 13. Indicateurs à suivre

### Qualité des données

- pourcentage de stations mises à jour dans les dernières 24 heures ;
- pourcentage de fiches avec coordonnées GPS valides ;
- taux de doublons ;
- taux de signalements contradictoires ;
- nombre de corrections par semaine ;
- délai moyen de traitement d’un signalement.

### Participation des stations

- nombre de stations partenaires ;
- taux de réponse aux demandes ;
- fréquence moyenne des confirmations ;
- nombre de responsables actifs ;
- nombre de stations ayant abandonné la mise à jour.

### Utilisation par le public

- recherches par ville ;
- stations les plus consultées ;
- nombre de signalements ;
- nombre de trajets ou boutons d’itinéraire utilisés ;
- utilisateurs actifs ;
- retours négatifs ou demandes de correction.

---

## 14. Feuille de route recommandée

### Étape 1 — Pilote manuel

Objectif : 10 à 20 stations dans Cotonou, Abomey-Calavi et Porto-Novo.

- fiches créées manuellement ;
- confirmations par WhatsApp ;
- mise à jour par l’équipe ;
- aucun paiement obligatoire ;
- mesure du taux de réponse.

### Étape 2 — Base partagée et modération

- remplacer le stockage local ;
- ajouter un compte administrateur ;
- créer les tables de stations et de statuts ;
- mettre en place l’historique ;
- créer l’écran de modération.

### Étape 3 — Espace partenaire

- invitation par téléphone ou e-mail ;
- connexion du responsable ;
- modification de la fiche ;
- confirmation du statut en un clic ;
- validation des changements sensibles.

### Étape 4 — Couverture nationale

- ajouter les autres communes ;
- recruter des agents ou ambassadeurs locaux ;
- créer des procédures de contrôle homogènes ;
- publier un indicateur de couverture par département.

### Étape 5 — Services avancés

- géolocalisation réelle ;
- itinéraire ;
- notifications push ;
- prix actualisés, si les stations les confirment ;
- offres professionnelles et statistiques ;
- API ou accès entreprise.

---

## 15. Décision recommandée pour le lancement

Pour commencer sans trop de complexité :

1. choisir une zone pilote ;
2. signer ou confirmer 10 stations ;
3. désigner un contact WhatsApp par station ;
4. mettre à jour les statuts deux fois par jour ;
5. afficher systématiquement la date et la source ;
6. garder les signalements utilisateurs séparés des confirmations partenaires ;
7. mesurer la fiabilité pendant 30 jours ;
8. ne facturer qu’après avoir démontré que l’application génère de la visibilité ou des utilisateurs.

La priorité n’est pas d’ajouter le plus grand nombre de stations possible. La priorité est de construire une information suffisamment fraîche et crédible pour que les conducteurs reviennent régulièrement dans l’application.

---

## 16. Checklist avant publication réelle

### Données

- [ ] Les stations du catalogue ont été vérifiées.
- [ ] Les coordonnées GPS ont été contrôlées.
- [ ] Les doublons ont été supprimés.
- [ ] La source et l’heure de chaque statut sont enregistrées.
- [ ] Les informations de démonstration ont été retirées.

### Produit

- [ ] Les stations peuvent être ajoutées depuis un tableau de bord.
- [ ] Les partenaires peuvent confirmer un statut.
- [ ] Les utilisateurs peuvent signaler une erreur.
- [ ] Les informations anciennes expirent automatiquement.
- [ ] Les signalements sont synchronisés entre les appareils.

### Gouvernance

- [ ] Les rôles et permissions sont définis.
- [ ] Une procédure de modération existe.
- [ ] Un historique des changements est conservé.
- [ ] Un accord d’utilisation des données est disponible.
- [ ] Un canal de contact public est affiché.

### Exploitation

- [ ] Une personne est responsable des relances quotidiennes.
- [ ] Les stations prioritaires sont identifiées.
- [ ] Les incidents et réclamations sont suivis.
- [ ] Les indicateurs de qualité sont consultés chaque semaine.

---

## Conclusion

Essence Bénin doit associer **technologie simple**, **relation directe avec les stations** et **contrôle permanent de la fraîcheur des informations**.

Au démarrage, WhatsApp, les appels et un tableau de suivi suffisent. L’espace partenaire et la synchronisation automatique peuvent être construits progressivement, une fois que le pilote a démontré que les stations répondent et que les conducteurs utilisent réellement le service.
