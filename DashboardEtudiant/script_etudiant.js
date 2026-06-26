let selectedTemplateId = null;
let selectedTemplateName = null;

document.addEventListener("DOMContentLoaded", () => {
  // --- INITIALISATION DES ELEMENTS ---
  const trigger = document.getElementById("select-trigger");
  const optionsMenu = document.getElementById("custom-options");
  const hiddenInput = document.getElementById("cours-value");
  const deployBtn = document.getElementById("btn-trigger-deploy");
  const deployMsg = document.getElementById("deploy-message");
  const zapierBtn = document.getElementById("mon-bouton-validation");

  const emailEtudiant = zapierBtn ? zapierBtn.getAttribute("data-email") : null;

  // --- NAVIGATION SIDEBAR ---
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const target = item.dataset.section;

      document
        .querySelectorAll(".menu-item")
        .forEach((i) => i.classList.remove("active"));
      document
        .querySelectorAll(".page-section")
        .forEach((s) => s.classList.remove("active"));

      item.classList.add("active");
      document.getElementById(`section-${target}`).classList.add("active");

      if (target === "dashboard") loadMyVMs();
      if (target === "nouvelle-vm") loadTemplates();
    });
  });

  // --- GESTION DU CUSTOM SELECT (COURS) ---
  if (trigger && optionsMenu) {
    trigger.addEventListener("click", () => {
      optionsMenu.classList.toggle("open");
    });

    optionsMenu.querySelectorAll(".choix").forEach((option) => {
      option.addEventListener("click", () => {
        trigger.querySelector("span").innerText = option.innerText;
        hiddenInput.value = option.getAttribute("data-value");
        optionsMenu.classList.remove("open");
      });
    });

    document.addEventListener("click", (e) => {
      if (!trigger.contains(e.target) && !optionsMenu.contains(e.target)) {
        optionsMenu.classList.remove("open");
      }
    });
  }

  // --- DEPLOIEMENT TERRAFORM (GENERATE VM) ---
  if (deployBtn) {
    deployBtn.addEventListener("click", async () => {
      deployBtn.disabled = true;
      if (deployMsg) {
        deployMsg.style.display = "none";
        deployMsg.classList.remove("success", "error");
      }

      const coursSelectionne = hiddenInput ? hiddenInput.value : "";

      if (!coursSelectionne) {
        if (deployMsg) {
          deployMsg.style.display = "block";
          deployMsg.className = "form-message error";
          deployMsg.textContent =
            "✗ Erreur : Tu dois sélectionner un cours avant de déployer.";
        }
        deployBtn.disabled = false;
        return;
      }

      if (!selectedTemplateId) {
        if (deployMsg) {
          deployMsg.style.display = "block";
          deployMsg.className = "form-message error";
          deployMsg.textContent = "✗ Erreur : Aucun template sélectionné.";
        }
        deployBtn.disabled = false;
        return;
      }

      deployBtn.textContent = "Exécution de Terraform init & apply...";

      try {
        const res = await fetch("/api/vm/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            template_id: selectedTemplateId,
            cours_id: coursSelectionne,
          }),
        });

        const out = await res.json();
        if (deployMsg) deployMsg.style.display = "block";

        if (res.ok) {
          deployMsg.className = "form-message success";
          deployMsg.textContent = `✓ Infrastructure déployée. IP: ${out.ip}`;
        } else {
          deployMsg.className = "form-message error";
          deployMsg.textContent = `✗ Crash déploiement: ${out.error}`;
        }
      } catch (e) {
        console.error(e);
        if (deployMsg) {
          deployMsg.style.display = "block";
          deployMsg.className = "form-message error";
          deployMsg.textContent = "✗ Erreur réseau lors du provisionnement.";
        }
      }

      deployBtn.disabled = false;
      deployBtn.textContent = "Lancer le provisionnement Terraform";
    });
  }

  // --- WEBHOOK ZAPIER ---
  if (zapierBtn) {
    zapierBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const coursSelectionne = hiddenInput ? hiddenInput.value.trim() : "";

      if (
        !coursSelectionne ||
        coursSelectionne === "" ||
        coursSelectionne === "required"
      ) {
        if (deployMsg) {
          deployMsg.style.display = "block";
          deployMsg.className = "form-message error";
          deployMsg.textContent =
            "✗ Erreur : Tu dois obligatoirement sélectionner un cours.";
        }
        return;
      }

      if (deployMsg) {
        deployMsg.style.display = "none";
        deployMsg.classList.remove("success", "error");
      }

      const nomEtudiant = zapierBtn.getAttribute("data-nom");
      const classeEtudiant = zapierBtn.getAttribute("data-classe");

      const triggerCours = document.getElementById("select-trigger");
      const nomCours = triggerCours
        ? triggerCours.querySelector("span").innerText.trim()
        : "Aucun cours sélectionné";

      const inputNomVM = document.getElementById("nomVM");
      let nomVM = inputNomVM ? inputNomVM.value.trim() : "";

      if (!nomVM || nomVM === "") {
        nomVM = selectedTemplateName
          ? selectedTemplateName
          : "Aucune VM sélectionnée";
      }

      const donnees = {
        "Nom Etudiant": nomEtudiant,
        "Classe Etudiant": classeEtudiant,
        "Nom VM": nomVM,
        "Nom Cours": nomCours,
        "Email Etudiant": emailEtudiant,
        evenement: "Validation de l'action",
        statut: "Déclenché par l'utilisateur",
        date: new Date().toLocaleString("fr-FR"),
      };

      fetch("/api/envoyer-zapier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donnees),
      })
        .then((response) => {
          if (response.ok) {
            if (deployMsg) {
              deployMsg.textContent =
                "✓ Votre demande a bien été prise en compte.";
              deployMsg.className = "form-message success";
              deployMsg.style.display = "block";

              setTimeout(() => {
                deployMsg.style.display = "none";
                deployMsg.classList.remove("success");
              }, 3000);
            }
          } else {
            console.error("Erreur lors de l'envoi à Zapier");
            if (deployMsg) {
              deployMsg.textContent = "✗ Erreur lors de l'envoi de la demande.";
              deployMsg.className = "form-message error";
              deployMsg.style.display = "block";
            }
          }
        })
        .catch((error) => {
          console.error("Erreur réseau Zapier :", error);
          if (deployMsg) {
            deployMsg.textContent =
              "✗ Erreur réseau. Impossible de joindre l'API.";
            deployMsg.className = "form-message error";
            deployMsg.style.display = "block";
          }
        });
    });
  }

  // --- POLLING STATUT LAB (Régulé à 4s) ---
  if (emailEtudiant) {
    const statutInterval = setInterval(async () => {
      try {
        const res = await fetch("/api/check-statut");
        const donnees = await res.json();

        if (donnees.email === emailEtudiant) {
          const naviguerVersNouvelleVM = () => {
            document
              .querySelectorAll(".menu-item")
              .forEach((i) => i.classList.remove("active"));
            document
              .querySelectorAll(".page-section")
              .forEach((s) => s.classList.remove("active"));
            const menuNouvelleVM = document.querySelector(
              '.menu-item[data-section="nouvelle-vm"]',
            );
            if (menuNouvelleVM) menuNouvelleVM.classList.add("active");
            const sectionNouvelleVM = document.getElementById(
              "section-nouvelle-vm",
            );
            if (sectionNouvelleVM) sectionNouvelleVM.classList.add("active");
          };

          if (donnees.choix === "oui") {
            clearInterval(statutInterval);
            naviguerVersNouvelleVM();

            if (deployMsg) {
              deployMsg.style.display = "block";
              deployMsg.className = "form-message success";
              deployMsg.textContent =
                "La création de la VM a été validée et est maintenant prête";

              setTimeout(() => {
                deployMsg.style.display = "none";
                deployMsg.classList.remove("success");
              }, 8000);
            }
          } else if (donnees.choix === "non") {
            clearInterval(statutInterval);
            naviguerVersNouvelleVM();

            if (deployMsg) {
              deployMsg.style.display = "block";
              deployMsg.className = "form-message error";
              deployMsg.textContent =
                "La création de la VM a été refusée, tu peux refaire une demande au besoin";

              setTimeout(() => {
                deployMsg.style.display = "none";
                deployMsg.classList.remove("error");
              }, 8000);
            }
          }
        }
      } catch (e) {
        console.error("Erreur lors de la vérification du statut : ", e);
      }
    }, 4000);
  }
});

// --- FONCTIONS GLOBALES (FETCH API) ---
async function loadMyVMs() {
  try {
    const res = await fetch("/api/vm");
    const data = await res.json();

    const countElement = document.getElementById("count-vms");
    const ramElement = document.getElementById("total-ram");
    const storageElement = document.getElementById("total-storage");
    const tbody = document.getElementById("tbody-my-vms");

    if (countElement) countElement.textContent = data.vms.length;
    if (ramElement) ramElement.textContent = data.total_ram + " Go";
    if (storageElement) storageElement.textContent = data.total_storage + " Go";

    if (tbody) {
      tbody.innerHTML = data.vms.length
        ? data.vms
            .map(
              (vm) => `
              <tr>
                  <td><strong>${vm.nom}</strong></td>
                  <td>${vm.template}</td>
                  <td><code style="color:#3b82f6">${vm.ip || "Allocation..."}</code></td>
                  <td><span class="badge ${vm.statut === "active" ? "badge-green" : "badge-orange"}">${vm.statut.toUpperCase()}</span></td>
                  <td>
                      <button class="btn-terminate" onclick="terminateVM(${vm.id})">Rendre ma VM</button>
                  </td>
              </tr>
          `,
            )
            .join("")
        : '<tr><td colspan="5" class="empty-row">Aucune instance active sur votre profil.</td></tr>';
    }
  } catch (e) {
    console.error("Erreur lors du chargement des VMs:", e);
  }
}

async function loadTemplates() {
  try {
    const res = await fetch("/api/templates");
    const tmpls = await res.json();
    const container = document.getElementById("templates-container");

    if (container) {
      container.innerHTML = tmpls
        .map(
          (t) => `
              <div class="tmpl-card" data-id="${t.id}" onclick="selectTemplate(${t.id}, '${t.nom}')">
                  <div class="tmpl-icon">${t.icone || "🖥️"}</div>
                  <div class="tmpl-title">${t.nom}</div>
                  <div class="tmpl-desc">${t.description}</div>
                  <div class="tmpl-specs">${t.vcpus} vCPU · ${t.ram_go} Go RAM · ${t.disque_go} Go SSD</div>
              </div>
          `,
        )
        .join("");
    }
  } catch (e) {
    console.error("Erreur lors du chargement des templates:", e);
  }
}

function selectTemplate(id, name) {
  selectedTemplateId = id;
  selectedTemplateName = name;
  document
    .querySelectorAll(".tmpl-card")
    .forEach((c) => c.classList.remove("selected"));

  const targetCard = document.querySelector(`.tmpl-card[data-id="${id}"]`);
  if (targetCard) targetCard.classList.add("selected");

  const nameDisplay = document.getElementById("selected-tmpl-name");
  const deployBox = document.getElementById("deploy-box");

  if (nameDisplay) nameDisplay.textContent = name;
  if (deployBox) deployBox.style.display = "flex";
}

async function terminateVM(id) {
  if (
    confirm(
      "Confirmer la suppression complète de l'instance via Terraform destroy ?",
    )
  ) {
    try {
      const res = await fetch(`/api/vm/${id}`, { method: "DELETE" });
      if (res.ok) loadMyVMs();
    } catch (e) {
      console.error("Erreur destruction VM:", e);
    }
  }
}
