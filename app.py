# On importe tous les modules nécessaires
import os
import requests
from dotenv import load_dotenv
from flask import Flask, redirect, url_for, session, render_template, request, jsonify
import sqlite3
from authlib.integrations.flask_client import OAuth
 
# On charge le fichier .env
load_dotenv()
 
app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
oauth = OAuth(app)
 
CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')
SERVER_METADATA_URL= os.environ.get('SERVER_METADATA_URL')
 
oauth.register(name='azure',client_id=CLIENT_ID,client_secret=CLIENT_SECRET,server_metadata_url=SERVER_METADATA_URL,client_kwargs={'scope':'openid profile email'})
 
if not SERVER_METADATA_URL:
    raise ValueError("Erreur : SERVER_METADATA_URL n'est pas défini dans le fichier .env")

def init_db():
    conn = sqlite3.connect("donnees.db")
    cursor = conn.cursor()
    # Pense à structurer tes tables ici si besoin (eleve avec colonne classe, E1_cours avec id et nom_cours, etc.)
    conn.commit()
    conn.close()
 
@app.route('/')
def home():
    return render_template('index.html')
 
@app.route('/login')
def login():
    redirect_uri = url_for('auth_callback', _external=True)
    return oauth.azure.authorize_redirect(redirect_uri, prompt='login')
 
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))
 
@app.route('/callback')
def auth_callback():
    token = oauth.azure.authorize_access_token()
    user_info = token.get('userinfo')
    email = user_info['email'].lower()
 
    conn = sqlite3.connect("donnees.db")
    cursor = conn.cursor()
 
    role = None
    prenom_db = ""
    nom_db = ""
    classe_db = None  # On initialise à None
 
    # 1. On récupère aussi la 'classe' de l'élève dans la requête SQL
    cursor.execute("SELECT prenom, nom, classe FROM eleve WHERE LOWER(email) = ?", (email,))
    resultat = cursor.fetchone()
    if resultat:
        role = 'Etudiant'
        prenom_db, nom_db, classe_db = resultat  # Fix de l'unpacking foireux
 
    # 2. Si pas trouvé, prof
    if not role:
        cursor.execute("SELECT prenom, nom FROM prof WHERE LOWER(email) = ?", (email,))
        resultat = cursor.fetchone()
        if resultat:
            role = 'Formateur'
            prenom_db, nom_db = resultat
 
    # 3. Admin
    if not role:
        cursor.execute("SELECT prenom, nom FROM administrateur WHERE LOWER(email) = ?", (email,))
        resultat = cursor.fetchone()
        if resultat:
            role = 'Admin'
            prenom_db, nom_db = resultat
 
    conn.close()
 
    if role:
        session['email'] = email
        session['nom'] = f"{prenom_db} {nom_db}"
        session['role'] = role
        session['classe'] = classe_db  # Stocké proprement (ex: 'E1', 'E2' ou None pour les profs/admins)
 
        if role == 'Etudiant':
            return redirect(url_for('dashboard_etudiant'))
        elif role == 'Formateur':
            return redirect(url_for('dashboard_formateur'))
        elif role == 'Admin':
            return redirect(url_for('dashboard_admin'))
    else:
        return f"Accès refusé, l'adresse {email} n'est répertoriée nulle part.", 403
 
@app.route('/dashboard/etudiant')
def dashboard_etudiant():
    if 'role' not in session or session['role'] != 'Etudiant':
        return "Accès interdit", 403
    
    classe = session.get('classe')
    liste_cours = []
 
    # Requête dynamique sur la table de la classe (ex: E1_cours)
    if classe:
        conn = sqlite3.connect("donnees.db")
        cursor = conn.cursor()
        try:
            # En SQL, on ne peut pas injecter un nom de table avec un paramètre '?',
            # donc on valide que la string est safe (alphanumérique) pour éviter l'injection.
            if classe.isalnum():
                cursor.execute(f"SELECT id, nom_cours FROM {classe}_cours")
                liste_cours = cursor.fetchall()
        except sqlite3.OperationalError:
            liste_cours = []
        finally:
            conn.close()
 
    return render_template(
        'DashboardEtudiant/etudiant.html',
        nom=session.get('nom'),
        email=session.get('email'),
        role=session.get('role'),
        classe=classe,
        cours=liste_cours  # On envoie le tableau de tuples [(1, 'Concept...'), (2, 'Linux...')] au HTML
    )
 
@app.route('/dashboard/formateur')
def dashboard_formateur():
    if 'role' not in session or session['role'] != 'Formateur':
        return "Accès interdit", 403
    return render_template('DashboardFormateur/formateur.html', nom=session.get('nom'), email=session.get('email'), role=session.get('role'))
 
@app.route('/dashboard/admin')
def dashboard_admin():
    if 'role' not in session or session['role'] != 'Admin':
        return "Accès interdit", 403
    return render_template('DashboardAdmin/admin.html', nom=session.get('nom'), email=session.get('email'), role=session.get('role'))
 
@app.route('/api/envoyer-zapier', methods=['POST'])
def envoyer_zapier():
    zapier_url = os.environ.get('URL_ZAPIER')

    global suivi_machine

    if not zapier_url:
        print("Erreur : URL_ZAPIER n'est pas défini dans le fichier .env")
        return jsonify({"statut": "erreur", "message": "Configuration manquante"}), 500
    
    suivi_machine = {"choix" : "en_attente", "cours" : None, "nom" : None, "nom_vm" : None, "classe" : None, "email" : None}
    
    donnees_recues = request.json
    try:
        requests.post(zapier_url, json=donnees_recues, timeout=5)
        return jsonify({"statut": "success"}), 200
    except:
        return jsonify({"statut": "erreur"}), 500
    
# On initialise suivi_machine pour pouvoir récupérer les informations qui vont nous être envoyées par le webhook zapier    
suivi_machine = {"choix" : None, "cours" : None, "nom" : None, "nom_vm" : None, "classe" : None, "email" : None}

@app.route('/api/statutVM', methods=['POST'])
def statut_vm():
    # On utilise la variable créée au dessus pour y mettre nos informations reçues
    global suivi_machine
    donnees = request.json

    # On rentre les données dans notre variable
    suivi_machine = {
        "choix" : donnees.get("choix"),
        "cours" : donnees.get("cours"),
        "nom" : donnees.get("nom"),
        "nom_vm" : donnees.get("nom_vm"),
        "classe" : donnees.get("classe"),
        "email" : donnees.get("email")
    }
    print("PAYLOAD REÇU DE ZAPIER :", donnees)
    return jsonify({"message" : "OK"}), 200

@app.route('/api/check-statut', methods=['GET'])
def check_statut():
    global suivi_machine

    statut_actuel = suivi_machine.copy()

    if suivi_machine.get("choix") in ["oui", "non"]:
        suivi_machine = {"choix" : None, "cours" : None, "nom" : None, "nom_vm" : None, "classe" : None, "email" : None}

    return jsonify(statut_actuel)
@app.route('/api/ack-statut', methods=['POST'])
def ack_statut():
    global suivi_machine
   
    suivi_machine = {"choix": None, "cours": None,  "nom": None, "nom_vm": None, "classe": None,  "email": None}
    return jsonify({"ok": True})
if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=8000)
