let selectedTemplateId = null;

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();
        const target = item.dataset.section;
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
        item.classList.add('active');
        document.getElementById(`section-${target}`).classList.add('active');
        if(target === 'dashboard') loadMyVMs();
        if(target === 'nouvelle-vm') loadTemplates();
    });
});

async function loadMyVMs() {
    try {
        const res = await fetch('/api/vm');
        const data = await res.json();
        
        document.getElementById('count-vms').textContent = data.vms.length;
        document.getElementById('total-ram').textContent = data.total_ram + " Go";
        document.getElementById('total-storage').textContent = data.total_storage + " Go";
        
        const tbody = document.getElementById('tbody-my-vms');
        tbody.innerHTML = data.vms.length ? data.vms.map(vm => `
            <tr>
                <td><strong>${vm.nom}</strong></td>
                <td>${vm.template}</td>
                <td><code style="color:#3b82f6">${vm.ip || 'Allocation...'}</code></td>
                <td><span class="badge ${vm.statut === 'active' ? 'badge-green' : 'badge-orange'}">${vm.statut.toUpperCase()}</span></td>
                <td>
                    <button class="btn-terminate" onclick="terminateVM(${vm.id})">Rendre ma VM</button>
                </td>
            </tr>
        `).join('') : '<tr><td colspan="5" class="empty-row">Aucune instance active sur votre profil.</td></tr>';
    } catch(e) { console.error(e); }
}

async function loadTemplates() {
    try {
        const res = await fetch('/api/templates');
        const tmpls = await res.json();
        const container = document.getElementById('templates-container');
        
        container.innerHTML = tmpls.map(t => `
            <div class="tmpl-card" data-id="${t.id}" onclick="selectTemplate(${t.id}, '${t.nom}')">
                <div class="tmpl-icon">${t.icone || '🖥️'}</div>
                <div class="tmpl-title">${t.nom}</div>
                <div class="tmpl-desc">${t.description}</div>
                <div class="tmpl-specs">${t.vcpus} vCPU · ${t.ram_go} Go RAM · ${t.disque_go} Go SSD</div>
            </div>
        `).join('');
    } catch(e) { console.error(e); }
}

function selectTemplate(id, name) {
    selectedTemplateId = id;
    document.querySelectorAll('.tmpl-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`.tmpl-card[data-id="${id}"]`).classList.add('selected');
    document.getElementById('selected-tmpl-name').textContent = name;
    document.getElementById('deploy-box').style.display = 'flex';
}

document.getElementById('btn-trigger-deploy').addEventListener('click', async () => {
    const btn = document.getElementById('btn-trigger-deploy');
    const msg = document.getElementById('deploy-message');
    btn.disabled = true;
    btn.textContent = "Exécution de Terraform init & apply...";
    msg.style.display = 'none';

    try {
        const res = await fetch('/api/vm/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ template_id: selectedTemplateId })
        });
        const out = await res.json();
        msg.style.display = 'block';
        if(res.ok) {
            msg.className = "form-message success";
            msg.textContent = `✓ Infrastructure déployée. IP: ${out.ip}`;
        } else {
            msg.className = "form-message error";
            msg.textContent = `✗ Crash déploiement: ${out.error}`;
        }
    } catch(e) { console.error(e); }
    btn.disabled = false;
    btn.textContent = "Lancer le provisionnement Terraform";
});

async function terminateVM(id) {
    if(confirm("Confirmer la suppression complète de l'instance via Terraform destroy ?")) {
        const res = await fetch(`/api/vm/${id}`, { method: 'DELETE' });
        if(res.ok) loadMyVMs();
    }
}



const bouton = document.getElementById('mon-bouton-validation');

bouton.addEventListener('click', function() {
    
    // 1. BLOCAGE IMMÉDIAT DU BOUTON (Anti-double clic)
    bouton.disabled = true;
    bouton.innerText = "Envoi en cours...";
    bouton.style.opacity = "0.5";
    bouton.style.cursor = "not-allowed";

    const urlZapier = 'https://hooks.zapier.com/hooks/catch/27971848/43l4is5/';

    const donnees = {
        evenement: "Validation de l'action",
        statut: "Déclenché par l'utilisateur",
        date: new Date().toLocaleString('fr-FR')
    };

    // 2. ENVOI DE LA REQUÊTE POST
    fetch(urlZapier, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(donnees)
    })
    .then(response => {
        if (response.ok) {
            console.log('Succès : Données envoyées à Zapier !');
            // Le bouton reste désactivé et affiche le succès
            bouton.innerText = "Validé !";
            alert('Votre demande a bien été prise en compte.');
        } else {
            console.error('Erreur lors de l\'envoi à Zapier');
            // En cas d'erreur serveur, on réactive le bouton pour réessayer
            REACTIVER_BOUTON();
            alert('Erreur lors de l\'envoi. Veuillez réessayer.');
        }
    })
    .catch(error => {
        console.error('Erreur réseau ou système :', error);
        // En cas de coupure réseau, on réactive aussi le bouton
        REACTIVER_BOUTON();
    });

    // Fonction interne pour éviter la répétition du code de réactivation
    function REACTIVER_BOUTON() {
        bouton.disabled = false;
        bouton.innerText = "Valider l'action";
        bouton.style.opacity = "1";
        bouton.style.cursor = "pointer";
    }
    
});loadMyVMs();