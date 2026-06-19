# Hackathon Juin 2026

> **Projet en cours de développement**
>
> Les captures d'écran et fonctionnalités présentées dans ce dépôt correspondent à l'état du projet au moment de chaque version et sont susceptibles d'évoluer.

## Présentation

Ce projet a été réalisé dans le cadre du **Hackathon Juin 2026**.

L'objectif est de permettre le **provisionnement automatisé de machines virtuelles** via une interface web moderne, simple et intuitive. À terme, les utilisateurs pourront créer, gérer et supprimer leurs machines virtuelles directement depuis une plateforme centralisée, avec une authentification Microsoft et une gestion des rôles adaptée aux différents profils.

## Équipe

**Chef d'équipe**

* Gabryel Dwarka

**Membres**

* Romaun Jaquet
* Ilyess Curschellas
* Arif Jibril
* Marcus Molnar


# Historique des versions

## V0.1

### Fonctionnalités

* Création de la structure initiale du projet.
* Conception de la première interface utilisateur.
* Définition de la direction artistique du site.
* Mise en place du bouton **« Obtenir une VM »**.
* Affichage des informations au format JSON.
* Création du logo du projet avec Canva.

### Interface V0.1

<img width="1873" height="967" alt="Interface V0.1" src="https://github.com/user-attachments/assets/f8dbb52b-58d6-4d5d-a1f5-e668f99df0ee" />

<img width="1879" height="968" alt="Interface V0.1" src="https://github.com/user-attachments/assets/e2b3b31f-5f08-4038-9f8b-873f96ef584e" />


## V0.2

### Fonctionnalités

* Ajout de l'interface de connexion.
* Améliorations visuelles et ajustements de l'interface.
* Modifications du JavaScript et des données JSON pour les premiers tests de connexion.
* Préparation du futur système d'authentification.

### Limitations

* Le système de connexion n'est pas encore fonctionnel.

### Interface V0.2

<img width="1869" height="958" alt="Interface V0.2" src="https://github.com/user-attachments/assets/d73a84ac-7191-48e0-9290-cbd1b28a7a02" />


## V0.3

### Fonctionnalités

* Ajout et intégration complète de l'**Interface Étudiant**.
* Implémentation de l'authentification Microsoft via **OAuth 2.0** avec **Authlib**.
* Mise en place d'un système de **mock sécurisé** basé sur SQLite pour la gestion des rôles :

  * Élève
  * Professeur
  * Administrateur
* Migration du pseudo-backend JavaScript vers un véritable backend Python.
* Sécurisation du projet grâce à l'externalisation des secrets applicatifs via **python-dotenv**.
* Ajout du logo Microsoft sur le bouton de connexion.
* Refactorisation et réorganisation du fichier `app.py`.

### Interface V0.3

<img width="800" height="450" alt="Interface V0.3" src="https://github.com/user-attachments/assets/29aa8a2c-993d-4adc-a3a2-efff547cce5e" />


## V0.35

### Fonctionnalités

* Amélioration visuelle du svg Microsoft
* Léger effet néon sur le logo du site
* Création de pages de démonstration servant de placeholders pour les futurs tableaux de bord.
* Suppression du dossier `style2` afin de simplifier l'architecture du projet.
* Regroupement temporaire de tous les tableaux de bord dans `dashboard_etudiant.html`.
* Refonte complète de l'esthétique du tableau de bord.
* Préparation de la future séparation des espaces utilisateurs selon leur rôle.

### Notes

Cette version est principalement orientée vers l'amélioration visuelle du projet et la préparation des futures fonctionnalités.

### Interface V0.35

*GIF compressé et limité à 9 FPS afin de réduire sa taille.*

<img width="1280" height="720" alt="Interface V0.35" src="https://github.com/user-attachments/assets/f9d03fcd-cb6c-4254-b54a-d45d64ae7309" />

## V0.4

### Fonctionnalités

* Ajout d'un .env pour sécuriser nos variables et nos données sensibles comme les identifiants pour la connexion
* Ajout d'un workflow en phase de test servant à envoyer un mail à la personne qui accepte ou non la demande de VM et un autre pour recevoir le choix de la personne qui accepte ou non la demande
* Ajout d'un formulaire pour initialiser la demande de VM

# Technologies utilisées

* Python
* Flask
* Authlib
* SQLite
* HTML5
* CSS3
* JavaScript
* Microsoft OAuth 2.0
* python-dotenv


# Roadmap

## Priorité haute

* Intégration de Terraform.
* Intégration de l'API Infomaniak.
* Implémentation de la fonctionnalité **« Rendre ma VM »** (*Terraform Destroy*).
* Séparation stricte des rôles côté serveur.
* Suppression définitive du système de mock.

## Priorité moyenne

* Mise en place d'une route de déconnexion sécurisée.
* Renforcement de la sécurité globale de l'authentification.
* Gestion des erreurs Terraform et API.
* Journalisation des événements critiques.

## Priorité basse

* Optimisations de l'interface utilisateur.
* Améliorations visuelles supplémentaires.
* Ajout d'indicateurs de progression et de suivi des opérations.


# État du projet

Développement actif

Le projet est actuellement en phase de développement et de validation des fonctionnalités principales. Les prochaines étapes concernent l'automatisation complète du provisionnement des machines virtuelles et la mise en place des rôles utilisateurs définitifs.
