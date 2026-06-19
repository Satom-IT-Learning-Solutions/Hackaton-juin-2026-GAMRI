document.querySelector('.obtenirVM').addEventListener('click', function() {
    document.getElementById('vmIP').textContent = '192.168.1.42';
    document.getElementById('vmUser').textContent = 'etudiant';
    document.getElementById('vmPassword').textContent = 'MotDePasse123!';
    document.getElementById('vmResult').style.display = 'block';
});

