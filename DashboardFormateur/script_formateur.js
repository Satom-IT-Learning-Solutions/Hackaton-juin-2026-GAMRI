let selectedGroupTemplate = null;

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();
        const target = item.dataset.section;
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
        item.classList.add('active');
        document.getElementById(`section-${target}`).classList.add('active');
        if(target === 'validations') loadPendingDemands();
        if(target === 'demandes-groupes') loadCompactTemplates();
    });
});

async function loadPendingDemands() {
    try {
        const res = await fetch('/api/formateur/demandes');
        const demands = await res.json();
        const tbody = document.getElementById('tbody-pending');
        
        tbody.innerHTML = demands.length ? demands.map(d => `
            <tr>
                <td><strong>${d.etudiant_nom}</strong><br><small style="color:#6b7280">${d.etudiant_email}</small></td>
                <td><span style="color:#a855f7; font-weight:600;">${d.template_nom}</span></td>
                <td><code>${d.justification || 'Usage TP Standard'}</code></td>
                <td>
                    <button class="btn-accept" onclick="processDemand(${d.id}, 'approuver')">Accepter</button>
                    <button class="btn-deny" onclick="processDemand(${d.id}, 'refuser')">Refuser</button>
                </td>
            </tr>
        `).join('') : '<tr><td colspan="4" class="empty-row">Aucun flux en attente de signature.</td></tr>';
    } catch(e) { console.error(e); }
}

async function processDemand(id, action) {
    const res = await fetch(`/api/formateur/demandes/${id}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ action: action })
    });
    if(res.ok) loadPendingDemands();
}

async function loadCompactTemplates() {
    try {
        const res = await fetch('/api/templates');
        const tmpls = await res.json();
        const container = document.getElementById('compact-templates');
        
        container.innerHTML = tmpls.map(t => `
            <div class="compact-tmpl" data-id="${t.id}" onclick="selectGroupTemplate(${t.id})">
                <h4>${t.nom}</h4>
                <span>${t.vcpus} vCPU / ${t.ram_go} Go</span>
            </div>
        `).join('');
    } catch(e) { console.error(e); }
}

function selectGroupTemplate(id) {
    selectedGroupTemplate = id;
    document.querySelectorAll('.compact-tmpl').forEach(c => c.classList.remove('selected'));
    document.querySelector(`.compact-tmpl[data-id="${id}"]`).classList.add('selected');
    checkGroupForm();
}

function checkGroupForm() {
    const nb = document.getElementById('g-nb').value;
    const cours = document.getElementById('g-cours').value;
    const debut = document.getElementById('g-debut').value;
    const fin = document.getElementById('g-fin').value;
    document.getElementById('btn-groupe').disabled = !(selectedGroupTemplate && nb && cours && debut && fin && fin > debut);
}

['g-nb', 'g-cours', 'g-debut', 'g-fin'].forEach(id => {
    document.getElementById(id).addEventListener('input', checkGroupForm);
    document.getElementById(id).addEventListener('change', checkGroupForm);
});

document.getElementById('btn-groupe').addEventListener('click', async () => {
    const msg = document.getElementById('g-message');
    msg.style.display = 'none';
    try {
        const res = await fetch('/api/demande-groupe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                template_id: selectedGroupTemplate,
                nb_machines: parseInt(document.getElementById('g-nb').value),
                cours: document.getElementById('g-cours').value,
                date_debut: document.getElementById('g-debut').value,
                date_fin: document.getElementById('g-fin').value
            })
        });
        msg.style.display = 'block';
        if (res.ok) {
            msg.className = 'form-message success';
            msg.textContent = `✓ Demande groupée soumise avec succès.`;
        } else {
            msg.className = 'form-message error';
            msg.textContent = '✗ Erreur lors de la soumission.';
        }
    } catch(e) { console.error(e); }
});

loadPendingDemands();