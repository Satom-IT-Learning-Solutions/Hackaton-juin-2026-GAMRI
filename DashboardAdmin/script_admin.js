// Navigation structurelle entre sections
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();
        const target = item.dataset.section;
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
        item.classList.add('active');
        document.getElementById(`section-${target}`).classList.add('active');
        
        if(target === 'utilisateurs') loadUsers();
        if(target === 'templates') loadTemplates();
    });
});

// Charger la télémétrie et l'état global du cluster
async function loadAdminMetrics() {
    try {
        const res = await fetch('/api/admin/metrics');
        const metrics = await res.json();
        
        document.getElementById('global-vms').textContent = metrics.active_vms;
        document.getElementById('global-users').textContent = metrics.total_users;
        document.getElementById('global-ratio').textContent = metrics.approval_rate + " %";
        
        const tbodyG = document.getElementById('tbody-global-vms');
        tbodyG.innerHTML = metrics.recent_requests.length ? metrics.recent_requests.map(req => `
            <tr>
                <td><strong>${req.user_name}</strong><br><small style="color:#6b7280">${req.user_email}</small></td>
                <td><span style="color:#f43f5e">${req.template_nom}</span></td>
                <td>${req.date_debut} → ${req.date_fin}</td>
                <td>${badgeStatut(req.statut)}</td>
            </tr>
        `).join('') : '<tr><td colspan="4" class="empty-row">Aucun flux réseau/VM détecté.</td></tr>';
    } catch (e) {
        console.error("Erreur de synchro metrics admin:", e);
    }
}

// Récupérer l'annuaire complet des users
async function loadUsers() {
    try {
        const res = await fetch('/api/admin/users');
        const users = await res.json();
        const tbodyU = document.getElementById('tbody-users');
        
        tbodyU.innerHTML = users.length ? users.map(user => `
            <tr>
                <td><strong>${user.nom}</strong></td>
                <td>${user.email}</td>
                <td>
                    <select class="select-role" data-uid="${user.id}" onchange="updateUserRole(${user.id}, this.value)">
                        <option value="etudiant" ${user.role === 'etudiant' ? 'selected' : ''}>Étudiant</option>
                        <option value="formateur" ${user.role === 'formateur' ? 'selected' : ''}>Formateur</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrateur</option>
                    </select>
                </td>
                <td>
                    <button class="btn-action-danger" onclick="purgeUser(${user.id})">Révoquer</button>
                </td>
            </tr>
        `).join('') : '<tr><td colspan="4" class="empty-row">Aucun compte dans l\'annuaire.</td></tr>';
    } catch (e) {
        console.error("Erreur annuaire:", e);
    }
}

// Mutation de privilèges / Modification de rôle direct en DB via l'API
async function updateUserRole(userId, newRole) {
    const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
    });
    if(!res.ok) alert("Échec de la mutation du rôle.");
}

// Purge d'un compte utilisateur
async function purgeUser(userId) {
    if(confirm("Confirmer la révocation et la suppression définitive du compte ?")) {
        const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
        if(res.ok) loadUsers();
    }
}

// Affichage des Gabarits machines configurés
async function loadTemplates() {
    try {
        const res = await fetch('/api/templates'); // On réutilise l'endpoint existant
        const templates = await res.json();
        const grid = document.getElementById('admin-templates-grid');
        
        grid.innerHTML = templates.map(t => `
            <div class="admin-tmpl-card">
                <div class="tmpl-meta">
                    <h3>${t.icone || '🖥️'} ${t.nom}</h3>
                    <p>${t.description || ''}</p>
                    <span class="tmpl-specs-badge">${t.vcpus} vCPU · ${t.ram_go} Go RAM · ${t.disque_go} Go SSD</span>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error("Erreur templates:", e);
    }
}

function badgeStatut(statut) {
    const map = {
        'en_attente': ['badge-orange', '⏳ En attente'],
        'validee':    ['badge-green',  '✓ Validée'],
        'refusee':    ['badge-red',    '✗ Refusée'],
    };
    const [cls, label] = map[statut] || ['badge-blue', statut];
    return `<span class="badge ${cls}">${label}</span>`;
}

// Initialisation au chargement de la console
loadAdminMetrics();