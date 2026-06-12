document.querySelector('.obtenirVM').addEventListener('click', function() {
    document.getElementById('vmIP').textContent = '192.168.1.42';
    document.getElementById('vmUser').textContent = 'etudiant';
    document.getElementById('vmPassword').textContent = 'MotDePasse123!';
    document.getElementById('vmResult').style.display = 'block';
});

document.getElementById("rendreVM").addEventListener("click", () => {
    document.getElementById("vmIP").textContent = "-";
    document.getElementById("vmUser").textContent = "-";
    document.getElementById("vmPassword").textContent = "-";

    document.getElementById("vmResult").style.display = "none";
});