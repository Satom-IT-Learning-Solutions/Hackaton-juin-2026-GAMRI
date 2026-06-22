# On importe tous les modules nécessaires
import os
import requests
from dotenv import load_dotenv
from flask import Flask, redirect, url_for, session, render_template
import sqlite3
from authlib.integrations.flask_client import OAuth

# On charge le fichier .env
load_dotenv()

# On dit à Flask que le dossier des templates et le dossier static, c'est la racine '.'
app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') # On récupère notre clé secrète du fichier .env
oauth = OAuth(app) # On initialise l'authentification

# On récupère toutes nos variables cachées
CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')
SERVER_METADATA_URL= os.environ.get('SERVER_METADATA_URL')

oauth.register(name='azure',client_id=CLIENT_ID,client_secret=CLIENT_SECRET,server_metadata_url=SERVER_METADATA_URL,client_kwargs={'scope':'openid profile email'})

def init_db():
    conn = sqlite3.connect("base_test.db") # Ouvre le fichier ou le créé si il n'existe pas

    cursor = conn.cursor() # Curseur pour exécuter les requêtes SQL

    cursor.execute("CREATE TABLE IF NOT EXISTS utilisateurs(id INTEGER PRIMARY KEY, email TEXT, nom TEXT, role TEXT)")

    # On va se connecter avec l'adresse email marcus.molnar-jensen@git.swiss pour la base de données
    cursor.execute("INSERT OR IGNORE INTO utilisateurs (email, nom, role) VALUES ('marcus.molnar-jensen@git.swiss', 'Marcus', 'Etudiant')")

    conn.commit() # Enregistre les modifications

    conn.close() # Ferme tout


@app.route('/')

def home():
    return render_template('index.html') # Affiche la page web

@app.route('/login')

def login():
    redirect_uri = url_for('auth_callback', _external=True)
    return oauth.azure.authorize_redirect(redirect_uri, prompt='login')

@app.route('/logout')
def logout():
    session.clear() # Efface les données de l'étudiant (email, nom, role)
    return redirect(url_for('home'))

@app.route('/callback')

def auth_callback():
    token = oauth.azure.authorize_access_token()

    # On extrait les infos de l'utilisateur
    user_info = token.get('userinfo')
    email = user_info['email']
    nom = user_info['name']

    # On ouvre la base de données
    conn = sqlite3.connect("base_test.db")
    cursor = conn.cursor()

    # On recherche l'utilisateur
    cursor.execute("SELECT role FROM utilisateurs WHERE email = ?", (email,))
    resultat = cursor.fetchone()
    conn.close()

    # On vérifie si l'utilisateur existe dans la base de données
    if resultat:
        role = resultat[0]

        # On récupère les infos
        session['email'] = email
        session['nom'] = nom
        session['role'] = role

        # On redirige au bon endroit selon le rôle
        if role == 'Etudiant':
            return redirect(url_for('dashboard_etudiant'))
        elif role == 'Formateur':
            return redirect(url_for('dashboard_formateur'))
        elif role == 'Admin':
            return redirect(url_for('dashboard_admin'))
    else:
        # Si l'utilisateur n'existe pas dans notre base de données
        return "Accès refusé, vous n'êtes pas inscrit", 403

@app.route('/dashboard/etudiant')

def dashboard_etudiant():
    if 'role' not in session or session['role'] != 'Etudiant':
        return "Accès interdit", 403
    return render_template('DashboardEtudiant/etudiant.html', nom=session.get('nom'), email=session.get('email'), role=session.get('role'))

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

import requests # N'oublie pas l'import tout en haut

@app.route('/api/envoyer-zapier', methods=['POST'])
def envoyer_zapier():
    from flask import request, jsonify
    
    # On récupère l'URL cachée dans le fichier .env (ou variables.env selon ton choix)
    zapier_url = os.environ.get('ZAPIER_WEBHOOK_URL') 
    
    # On prend les données (événement, statut, date) envoyées par ton JS
    donnees_recues = request.json 
    
    try:
        # Flask fait l'envoi secret à Zapier
        requests.post(zapier_url, json=donnees_recues, timeout=5)
        return jsonify({"statut": "success"}), 200
    except:
        return jsonify({"statut": "erreur"}), 500
    
    
if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=8000)