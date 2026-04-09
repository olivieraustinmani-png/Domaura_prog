# DOMAURA

> Plateforme digitale de services connectes, pensee pour tous les profils de clients, toutes origines confondues, avec une application web evoluant vers une application mobile reliee.

## Apercu

**DOMAURA** est un projet de plateforme numerique ne au Cameroun avec une ambition large : proposer, au sein d'un meme ecosysteme, des services autour de l'immobilier, de l'art, des echanges, des courses et de la location.

La version actuelle du projet est une **application web fonctionnelle** orientee principalement vers l'immobilier. Elle permet deja d'explorer des annonces, de filtrer les offres, de se connecter, puis de publier un bien.

La finalite du projet est de construire une **solution complete web + mobile**, accessible a tout type de client, local ou international, avec plusieurs niveaux de service, dont une **version premium**.

## Vision

DOMAURA veut devenir une plateforme unifiee de mise en relation entre clients, proprietaires, vendeurs, artistes et prestataires.

L'objectif est de permettre a un utilisateur de :

- rechercher une offre facilement,
- comparer plusieurs options depuis chez lui,
- contacter rapidement le bon interlocuteur,
- acceder a des experiences enrichies selon son besoin,
- retrouver la meme logique de service sur le web et sur mobile.

## Positionnement

DOMAURA s'adresse :

- aux etudiants,
- aux jeunes professionnels,
- aux familles,
- aux particuliers,
- aux entreprises,
- aux clients de toute origine recherchant des services fiables et accessibles.

Le projet est pense pour repondre a des besoins concrets du quotidien tout en restant evolutif vers des usages premium et immersifs.

## Modules de la plateforme

La vision produit de DOMAURA repose sur plusieurs grands modules :

- **DOMAURA Services** : noyau central de la plateforme, regroupant les differents services et points d'entree.
- **Option Immobilier** : recherche, consultation et publication de biens immobiliers.
- **Option Art** : valorisation d'oeuvres, creations visuelles et contenus artistiques.
- **Option Deal** : espace d'echange de biens et de services entre utilisateurs.
- **Option Courses** : service oriente vers les achats et besoins pratiques du quotidien.
- **Option Location** : location de biens, d'espaces, d'equipements ou d'autres offres temporaires.

## Version premium

Une des grandes evolutions prevues pour DOMAURA est une **offre premium**.

Cette version proposera notamment un **service d'inspection 3D** permettant au client :

- de visiter une offre sans se deplacer,
- d'examiner un bien ou un espace depuis chez lui,
- de gagner du temps avant une visite physique,
- d'ameliorer la prise de decision grace a une experience plus immersive.

Cette fonctionnalite vise en priorite l'immobilier, mais pourra aussi s'etendre a d'autres categories de la plateforme selon les besoins.

## Etat actuel du projet

A ce jour, le dossier du projet contient une base web operationnelle centree sur les annonces immobilieres.

### Fonctionnalites actuellement presentes

- interface web monopage en HTML, CSS et JavaScript,
- affichage public des annonces sous forme de cartes,
- moteur de recherche par titre ou quartier,
- filtres par type de bien,
- filtres par ville,
- authentification utilisateur par email/mot de passe,
- authentification Google,
- authentification par numero de telephone avec code SMS,
- espace utilisateur pour publier un bien,
- envoi d'image via un service d'upload,
- enregistrement des annonces dans Firebase Firestore,
- contact rapide via WhatsApp,
- interface responsive adaptee au mobile et au desktop.

### Technologies actuellement utilisees

- **Frontend** : HTML5, CSS3, JavaScript ES6+
- **Authentification** : Firebase Authentication
- **Base de donnees** : Firebase Firestore
- **Hebergement media** : imgbb pour l'upload d'images
- **Deploiement / versionnage** : Git et GitHub

## Ce que le projet est aujourd'hui

Dans son etat actuel, DOMAURA est surtout un **prototype web fonctionnel de publication et de consultation d'annonces immobilieres**.

Il constitue une base technique importante pour la suite, car il valide deja plusieurs briques essentielles :

- navigation utilisateur,
- logique de recherche,
- gestion de comptes,
- publication de contenu,
- stockage distant,
- contact direct avec les annonceurs.

## Ce que le projet doit devenir

DOMAURA a vocation a evoluer d'un prototype immobilier vers une **plateforme multi-services complete** connectant :

- l'application web,
- l'application mobile,
- plusieurs categories de services,
- une experience standard et une experience premium.

Les prochaines evolutions naturelles du projet sont :

- structurer plusieurs modules au-dela de l'immobilier,
- ajouter les categories art, deal, courses et location dans l'interface produit,
- mettre en place une architecture de donnees plus complete,
- gerer differents types de publications selon le service,
- ajouter des profils utilisateurs plus riches,
- preparer l'interconnexion entre la version web et la future application mobile,
- integrer l'inspection 3D premium pour les visites a distance.

## Installation locale

```bash
git clone https://github.com/Olivieraustinmani-PNG/Domaura_prog.git
cd Domaura_prog
```

Puis ouvrez simplement `index.html` dans votre navigateur.

## Points forts du projet

- vision produit ambitieuse et differenciante,
- socle web deja concret,
- adaptation mobile deja prise en compte,
- logique de publication et de mise en relation deja exploitable,
- potentiel fort pour une evolution en ecosysteme web + mobile,
- idee premium 3D tres pertinente pour eviter les deplacements inutiles.

## Feuille de route recommandee

1. Stabiliser la base immobiliere actuelle.
2. Structurer clairement les differents modules DOMAURA dans l'interface.
3. Ajouter un vrai modele de donnees multi-services.
4. Concevoir l'experience premium autour des visites 3D.
5. Preparer l'API ou la logique de synchronisation entre web et mobile.
6. Lancer ensuite la version mobile connectee a la plateforme web.

## Auteur

**Olivier Austin Mani**  
Eleve Ingenieur a l'ENSPY  
Projet personnel - 2026

## Licence

Projet distribue sous licence MIT.
