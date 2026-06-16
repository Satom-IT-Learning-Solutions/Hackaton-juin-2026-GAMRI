# Hackaton Juin 2026
Projet réalisé dans le cadre du Hackathon Juin 2026.
L'objectif du projet est de permettre le provisionnement automatisé de machines virtuelles via une interface web simple et intuitive.

## V0.1

- Création de la base du design de la page
- Définition de la direction artistique (DA) du site
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

- Ajout et intégration complète de l'espace "Interface Étudiant" 
- Implémentation du protocole de connexion Microsoft OAuth (Authlib)
- Intégration d'un système de Mock sécurisé via base SQLite locale pour valider les rôles (Élève, Prof, Admin) en attendant les IDs Azure de production
- Sécurisation du code externalisation des credentials sensibles (clés privées, variables d'environnement) via un système "python-dotenv" (Git-safe)
- Ajout du logo Microsoft sur le bouton de connexion
- Réaménagement global et refactoring du fichier "app.py"
  
### Interface V0.3
<img width="800" height="450" alt="Interface V0.3 Animation" src="https://github.com/user-attachments/assets/29aa8a2c-993d-4adc-a3a2-efff547cce5e" />


## À faire

- Intégration de la fonction de libération des ressources ("Rendre ma VM") et de déconnexion via le logo utilisateur(a voir)
- Gestion dynamique du DOM (affichage conditionnel des résultats, masquage du bouton d'action principal)
- Implémentation du script de matching des credentials (simulation via base locale
- Finaliser le système de connexion
- Sécuriser l'authentification
- Terraform
- Créer le pont avec infomaniak et ajouter la création réelle des VM
- Améliorer la gestion des erreurs
