# Hackaton Juin 2026
Projet réalisé dans le cadre du Hackathon Juin 2026.
L'objectif du projet est de permettre le provisionnement automatisé de machines virtuelles via une interface web simple et intuitive.

## V0.1

- Création de la base du design de la page
- Définition de la direction artistique du site
- Bouton obtenir VM et informations JSON
- Création du logo sur Canva
  
## Interface V0.1
<img width="1873" height="967" alt="image" src="https://github.com/user-attachments/assets/f8dbb52b-58d6-4d5d-a1f5-e668f99df0ee" />
<img width="1879" height="968" alt="image" src="https://github.com/user-attachments/assets/e2b3b31f-5f08-4038-9f8b-873f96ef584e" />

## V0.2

- Ajout de l'interface de connexion
- quelques modifications d'interface pour l'esthetique
- Modifications du JavaScript et du JSON pour les tests de connexion
- Système de connexion non fonctionnel pour le moment
  
## Interface V0.2
<img width="1869" height="958" alt="image" src="https://github.com/user-attachments/assets/d73a84ac-7191-48e0-9290-cbd1b28a7a02" />

## V0.3

* Ajout et intégration complète de l'espace **Interface Étudiant**.
* Implémentation de l'authentification Microsoft via le protocole **OAuth 2.0** avec **Authlib**.
* Mise en place d'un système de **mock sécurisé** basé sur une base de données **SQLite locale** permettant la validation des rôles (*Élève, Professeur, Administrateur*) en attendant l'intégration des identifiants Azure de production.
* Migration du pseudo-backend JavaScript vers un véritable backend **Python**.
* Renforcement de la sécurité du projet avec l'externalisation des informations sensibles (clés privées, variables d'environnement, secrets applicatifs) via **python-dotenv** et un stockage compatible Git (*Git-safe*).
* Ajout du logo Microsoft sur le bouton de connexion.
* Réorganisation générale et refactorisation du fichier "app.py".

### Interface V0.3
<img width="800" height="450" alt="Interface V0.3 Animation" src="https://github.com/user-attachments/assets/29aa8a2c-993d-4adc-a3a2-efff547cce5e" />

## V0.35

- ajouts d'esthetique logo microsoft agrandi leger neon sur le logo
- ajout de page 100% faite par ia pour placeholder des differents dashboard
- tous les dashboard dispos sur une seule page le temps que tout soit mis en place pour les separer par compte
- refonte totale de l'esthetique de la page dashboard 
- aucun ajout important seulement esthetique et placeholder

### Interface V0.35 (GIF de qualité moyenne car j'ai du le passer a 9fps+compresser le fichier)
<img width="1280" height="720" alt="2026-06-1701-11-51-ezgif com-video-to-gif-converter (1)" src="https://github.com/user-attachments/assets/f9d03fcd-cb6c-4254-b54a-d45d64ae7309" />

## À faire

- Intégration Terraform & API Infomaniak
- Implémentation "Rendre ma VM" (Terraform destroy)
- Séparation stricte des rôles côté serveur (Suppression du mock JS)
- Sécurisation de l'authentification & Route de déconnexion
- Gestion des erreurs d'infra (Error handling API/Terraform)
