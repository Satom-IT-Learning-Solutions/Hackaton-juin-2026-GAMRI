from flask import Flask, redirect, url_for, session, render_template
import sqlite3
import mimetypes

# Fix Windows pour le chargement du CSS/JS
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('application/javascript', '.js')

app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='')
app.secret_key = "65161064539865410321"

@app.route('/')
def home():
    return render_template('Index.html')

# ROUTE LOGIN MODIFIÉE : On simule Azure en local
@app.route('/login')
def login():
    # ICI : Mets le mail de la BDD que tu veux tester
    # 'marcus.molnar-jensen@git.swiss' ou un prof/admin de ta base
    email = "marcus.molnar-jensen@git.swiss" 

    conn = sqlite3.connect("base_test.db") 
    cursor = conn.cursor()
    role = None
    nom = "Utilisateur"

    # 1. Check Élève
    cursor.execute("SELECT nom FROM eleve WHERE email = ?", (email,))
    user = cursor.fetchone()
    if user:
        role = 'Etudiant'
        nom = user[0]
    else:
        # 2. Check Prof
        cursor.execute("SELECT nom FROM Prof WHERE email = ?", (email,))
        user = cursor.fetchone()
        if user:
            role = 'Formateur'
            nom = user[0]
        else:
            # 3. Check Admin
            cursor.execute("SELECT nom FROM Administrateur WHERE email = ?", (email,))
            user = cursor.fetchone()
            if user:
                role = 'Admin'
                nom = user[0]

    conn.close()

    if role:
        # On remplit la session manuellement comme si Microsoft l'avait fait
        session['email'] = email
        session['nom'] = nom
        session['role'] = role

        if role == 'Etudiant':
            return redirect(url_for('dashboard_etudiant'))
        elif role == 'Formateur':
            return redirect(url_for('dashboard_formateur'))
        elif role == 'Admin':
            return redirect(url_for('dashboard_admin'))
    else:
        return f"Accès refusé. L'adresse {email} n'est pas dans la base.", 403

@app.route('/dashboard/etudiant')
def dashboard_etudiant():
    if 'role' not in session or session['role'] != 'Etudiant':
        return "Accès interdit", 403
    return render_template('dashboard_etudiant.html', nom=session.get('nom'), email=session.get('email'))

@app.route('/dashboard/formateur')
def dashboard_formateur():
    if 'role' not in session or session['role'] != 'Formateur':
        return "Accès interdit", 403
    return "<h1>Espace Formateur</h1><p>Placeholder</p>"

@app.route('/dashboard/admin')
def dashboard_admin():
    if 'role' not in session or session['role'] != 'Admin':
        return "Accès interdit", 403
    return "<h1>Espace Admin</h1><p>Placeholder</p>"

if __name__ == '__main__':
    app.run(debug=True, port=8000)