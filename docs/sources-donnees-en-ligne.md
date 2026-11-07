# Sources publiques utilisées — Essence Bénin

## Bénin Petro

La page officielle du réseau est [beninpetro.com/reseau-stations-services](https://beninpetro.com/reseau-stations-services). Les endpoints publics observés sont `/api/public/stations`, `/api/public/stations/carte` et `/api/public/stations/disponibilites`. Ils exposent un réseau d’environ 91 à 92 enregistrements selon l’endpoint, avec noms, villes, coordonnées et statuts essence/gasoil `disponible` ou `rupture`. Les données sont importées avec leur source et leur date de collecte. Le contrôle de cohérence entre endpoints est obligatoire avant une mise à jour.

## Oryx Energies Bénin

La page officielle des implantations est [oryxenergies.com/bj/fr/nos-implantations](https://www.oryxenergies.com/bj/fr/nos-implantations). Sa carte embarque 44 objets de type `station` au Bénin, avec noms et coordonnées GPS. Elle publie également les contacts généraux `+229 01 94 46 21 21` et service client `+229 01 95 99 29 45`, ainsi que l’adresse `contact@oryxenergies.bj` dans la configuration publique de la carte.

La source Oryx confirme le réseau de stations et l’offre générale de carburants, mais ne publie pas de stock essence/gasoil par station. Les 44 stations sont donc intégrées dans l’application avec `essenceStatus=unknown` et `gasoilStatus=unknown`. Cela évite de transformer la présence d’une station ou l’offre commerciale générale en fausse preuve de disponibilité.

## JNP Bénin

Le site officiel [jnpgroupe.com/stations](https://www.jnpgroupe.com/stations) publie des codes, noms et localités de stations, mais pas de coordonnées GPS ni de disponibilité essence/gasoil par station. Le site confirme aussi l’offre de produits, sans flux de stock. JNP est donc une source potentielle pour enrichir le catalogue après géocodage et validation directe, mais pas pour déclarer un stock actuel.

## TotalEnergies Bénin

Le [localisateur officiel TotalEnergies](https://totalenergies.com/clients-websites/service-stations) existe, mais aucune liste béninoise station-par-station exploitable n’a été confirmée dans les sources publiques consultées. Une fiche tierce fournit des coordonnées générales de Total Benin, à revalider. Aucun stock essence/gasoil n’est déduit.

## SONACOP

Les sources gouvernementales et environnementales mentionnent l’évolution de SONACOP et des sites repris ou réhabilités par d’autres opérateurs, mais aucune liste actuelle station-par-station ni disponibilité par produit n’a été confirmée. SONACOP est conservée comme entité à vérifier, pas comme source de stock.

## GPP / StationMap

La [fiche Google Play de Station Map](https://play.google.com/store/apps/details?id=com.gpp.stationmap&hl=en-US) décrit une application commandée par le GPP Bénin, avec localisation de stations agréées et disponibilité annoncée en temps réel. Elle ne publie pas de fichier ou d’API ouverte station-par-station. C’est une piste de partenariat ou d’échange de données, pas une base à copier.

## ABE — Grand Nokoué

La [cartographie ABE](https://abe.bj/observatoire/cartographie-des-installations-de-stations-services-dessence-et-de-gas-oil-dans-le-grand-nokoue-cotonou-porto-novo-ouidah-seme-podji-abomey-calavi/) indique 239 stations dans cinq communes, dont 183 fonctionnelles et 56 non fonctionnelles, avec une méthode participative auprès des gestionnaires. Les chiffres et la méthode sont utiles pour contrôler la couverture, mais la publication ne fournit pas une liste publique complète avec statuts actuels par station.

## OpenStreetMap

Le tag [amenity=fuel](https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dfuel) et Overpass peuvent servir à découvrir des stations et coordonnées. OSM est communautaire et ne fournit pas le stock actuel. Les tags de produits sont des déclarations cartographiques, pas des preuves de disponibilité commerciale.

## Règle d’affichage de l’application

Une station peut être affichée comme **disponible** uniquement lorsqu’un statut produit provient d’un flux officiel ou d’une mise à jour administrateur/partenaire horodatée. Une station simplement recensée doit afficher **À vérifier**. Les sources générales, les noms d’opérateur, les coordonnées et l’existence d’une station ne suffisent jamais à conclure qu’il y a de l’essence.
