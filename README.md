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

* Romain Jaquet
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

## V0.5

* amélioration de l'UX suite aux différents changements (email zapier,...) 
* connexion entre notre serveur python et plusieurs workflows zapier 
* envoie d'un email pour la confirmation de la création de la vm 
* envoie d'un email avec le choix de l'admin
* changement du contenu des emails envoyés

### Interface/Mails V0.5

*Choix pour la création :*
<img width="2294" height="1280" alt="image" src="https://github.com/user-attachments/assets/83aa5e5a-58b5-4461-9081-9f041c42ea52" />
*Création acceptée :*
<img width="2310" height="1178" alt="image" src="https://github.com/user-attachments/assets/77127586-5f28-473a-ab13-145a9768d7a0" />
*Création refusée :*
<img width="2298" height="1172" alt="image" src="https://github.com/user-attachments/assets/32b8d1b4-5e28-4569-b571-b0530b0f22a6" />
<img width="781" height="418" alt="ezgif com-crop" src="https://github.com/user-attachments/assets/1ca9b383-181d-4171-b788-45c140a8d996" />

*Création d'une nouvelle adresse email pour la réception des demandes de VM*
<img width="3110" height="1690" alt="image" src="https://github.com/user-attachments/assets/f9a09cf3-0e8b-4915-b6ec-5ed3615199c6" />

## V0.6

* ajout d'un pop up lors de l'envoie de la demande, un lorsque cette demande a été acceptée et un lorsque cette demande a été refusée
* changement de nom d'expéditeur et du compte gmail qui envoie l'email

### Interface V0.6

*Demande envoyée*
<img width="3088" height="1690" alt="image" src="https://github.com/user-attachments/assets/32b6e6cb-729a-49f1-868f-42c88d0a0ccc" />
*Création acceptée*
<img width="3074" height="1696" alt="image" src="https://github.com/user-attachments/assets/75dc9d3f-4a8f-46d6-9338-eec07a35b7e2" />
*Création refusée*
<img width="3092" height="1682" alt="image" src="https://github.com/user-attachments/assets/f2be9487-699a-447e-ba41-057dc84a4397" />
*Changement du nom de l'expéditeur et de l'email*
<img width="2808" height="1246" alt="image" src="https://github.com/user-attachments/assets/2b7013bd-9e91-483c-b843-bb0fc44f0313" />

## Workflow Finaux

### Worklow envoie mail de confirmation

<img width="3110" height="1530" alt="image" src="https://github.com/user-attachments/assets/e702b89e-aa1b-46d1-8f9c-ce99af71b50f" />
Le workflow va recevoir un signal du bouton présent sur le site et va envoyer un mail à la personne qui doit valider ou non la création de la VM

### Workflow décisions et suite des opérations

<img width="3108" height="1532" alt="image" src="https://github.com/user-attachments/assets/55c60848-9d78-430a-a5d1-3acfd08ce242" />

<img width="3108" height="1528" alt="image" src="https://github.com/user-attachments/assets/a2a3656f-e871-4452-9abd-fb10f7bfc011" />


Une fois le email reçu, la personne qui décide appuie sur OUI ou NON, si le choix est OUI : on envoie un email de confirmation à l'élève et on envoie les données vers le site web puis Terraform. <br> Puis un node Delay va attendre 6 jours avant d'envoyer un rappel disant que la VM va être détruite le lendemain. <br> Enfin, après un délai de  1 jour suivant le email de mise en garde, un email est envoyé à l'élève pour lui dire que sa VM a été détruite.
<br> En revanche si le choix est NON : un email est envoyé à l'élève pour l'informer que la VM ne va pas être créée et on envoie les donnes vers le site web pour que ça affiche le message de refus.

### Hébergement du site web 

*onrender.com*
<img width="3104" height="1700" alt="image" src="https://github.com/user-attachments/assets/599af263-11c2-4554-a6d4-43e1005bc7b6" />
L'hébergeur est relié à notre repo GitHub, il va prendre les fichiers présents dans le dernier commit et lancer le site web en nous fournissant un lien pour y accéder.

*https://hackaton-provisionningvm-juin-2026.onrender.com*


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

# Infomaniak Public Cloud

## Description

* Provisionnement automatique de VMs pour les 3 classes GIT (E1 a E3) via Terraform sur Infomaniak Public Cloud (dc3-a — Geneve).

## Prerequis

* Python 3.12 + python-openstackclient
* Terraform v1.15+
* Credentials Infomaniak (openrc.txt — fichier local uniquement)
* Cle SSH git_key (locale — jamais sur GitHub)

## Structure

* main.tf -> Configuration provider OpenStack
* variables.tf -> Variables Terraform
* vm-test.tf -> VM de test classe E1

## Utilisation

1. Configurer les variables d'environnement OS_
2. terraform init
3. terraform plan
4. terraform apply -auto-approve

## Destruction VMs

* terraform destroy -auto-approve

## Base de données des cours

* Structuration et attribution des modules pour lier dynamiquement les environnements Cloud aux cours des différentes classes.

<img width="797" height="212" alt="image" src="https://github.com/user-attachments/assets/3eb56d59-9bda-4732-bc3f-3f74d453e227" />
<img width="717" height="261" alt="image" src="https://github.com/user-attachments/assets/ec931333-847c-4072-8fdd-3465ccac6bd1" />
<img width="802" height="996" alt="image" src="https://github.com/user-attachments/assets/f758a975-bf10-4ac0-94b6-35cbaf58ccea" />

### Classe E1
* Concepts de base à la virtualisation
* Linux : Principes de base (LPI101) Partie 1
* Linux : Principes de base (LPI101) Partie 2

### Classe E2
* Sécurité des Réseaux Informatiques Commun (TIIS 2)
* Powershell Commun (TIIS 2)
* Linux - Administration (LPIC2)

### Classe E3
* Docker Commun (B3 RPI D)
* Cloud Computing - Openstack
* Cybersecurity opérations

<img width="1020" height="363" alt="image" src="https://github.com/user-attachments/assets/0ebcd4bb-a5e1-4182-9a16-ef5999c6c590" />

### Supervision (Grafana & Prometheus)

* Monitoring en temps reel des ressources des VMs provisionnees avec Node Exporter.
* Tableaux de bord de suivi complets connectes a la source de donnees Prometheus (utilisation CPU, RAM, Disque, Reseau).
* Supervision active de la VM de test de la classe E1 (nœud : git-e1-test-01).

<img width="1917" height="988" alt="Capture d&#39;écran 2026-06-26 084243" src="https://github.com/user-attachments/assets/295857cf-b210-4375-a830-e348e3b997cf" />

## Equipe Réseaux

* Arif Jibril
* Ilyess Curschellas
* Gabryel Dwarka

# État du projet

Développement actif

Le projet est actuellement en phase de développement et de validation des fonctionnalités principales. Les prochaines étapes concernent l'automatisation complète du provisionnement des machines virtuelles et la mise en place des rôles utilisateurs définitifs.
