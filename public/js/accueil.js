//Fichier Js de la page d'accueil
//Gère le chargement et l'affichage des espaces, les filtres de recherche et la gestion des favoris


/* =========================================================================
-async function initAccueil() : initialise les données nécessaires à la page d'accueil
-afficherEspaces(espaces) : affiche les espaces dans la grille de la page d'accueil
-afficherVilles(espaces) :  crée et affiche la liste des villes disponibles dans le select
-filtrerEspaces(espaces): filtrer et afficher les espaces selon les critères sélectionnés
-updateCoeurFavori(bouton, idEspace): met à jour l'image du coeur selon l'état du favori
=========================================================================== */

/* ------ Récupération des éléments réutilisés ---------- */
//Pour les filtres
const filtreVilles = document.getElementById("filter-town");
const filtreCapacite = document.getElementById("filter-capacity");
const wifiOption = document.getElementById("wifi-option");
const pmrOption = document.getElementById("pmr-option");
const screen4kOption = document.getElementById("screen-4k-option");
//Pour la grid
const gridCards = document.getElementById("grid-cards");
const nbSpaceGrid = document.getElementById("nb-space-grid");
//Pour le nombre de résultat dans le filtre
const popNb= document.getElementById("pop-nb");
//Url pour l'appel de l'api
const url = "public/data/espaces.json";


async function initAccueil(){
    //Role : initialise les données nécessaires à la page d'accueil
    //Paramètres:
    //      néant
    //Retour : néant

    //Je récupère le loader et l'affiche pendant le chargement des cards
    const loader = document.getElementById("loader");
    loader.style.display = "block";
    //Je récupère les espaces depuis le fichier JSON
    const espaces = await getEspaces(url);
    //Je cache le spinner une fois les données récupérées
    loader.style.display = "none";

    //J'affiche les espaces dans la grille
    afficherEspaces(espaces);
    //J'affiche les selects dans le filtre de recherche
    afficherVilles(espaces);
    //Je filtre les espaces quand un critère est modifié
    filtreVilles.addEventListener("change", () => filtrerEspaces(espaces));
    filtreCapacite.addEventListener("change", () => filtrerEspaces(espaces));
    wifiOption.addEventListener("change", () => filtrerEspaces(espaces));
    pmrOption.addEventListener("change", () => filtrerEspaces(espaces));
    screen4kOption.addEventListener("change", () => filtrerEspaces(espaces));
}

function afficherEspaces(espaces){
    //Role : affiche les espaces dans la grille de la page d'accueil
    //Paramètres:
    //      espaces : tableau contenant les espaces à afficher
    //Retour : néant

    //Je vide la grille avant d'ajouter les nouvelles cards
    gridCards.innerHTML = "";
    //Je mets à jour le nombre d'espaces affichés
    nbSpaceGrid.textContent = espaces.length;
    //Je récupère les favoris enregistrés
    const favoris = getFavoris();

    //Si aucun espace ne correspond aux critères
    if (espaces.length === 0) {

        gridCards.innerHTML = `
            <div class="no-result">
                <div class="no-result-icon">
                    <img src="public/assets/img/icon/search.svg" alt="">
                </div>
                <h3>Aucun espace ne correspond à vos critères</h3>
                <p>Modifiez vos filtres pour afficher plus de résultats.</p>
            </div>
        `;

        return;
    }

    //Sinon Je parcours le tableau des espaces et pour chaque espace je crée l'html d'une card.
    espaces.forEach(espace => {
        console.log(espace.images[0]);
        gridCards.innerHTML += `
            <article class="space-card">
                <div class="img-card">
                    <img src="public/${espace.images[0]}" alt="Espace de travail ${espace.nom}">
                    <button class="btn favorite-btn" type="button" onclick="addOrRemoveFavori(${espace.id});updateCoeurFavori(this, ${espace.id});" aria-label="${favoris.includes(espace.id) ? `Retirer ${espace.nom} des favoris`: `Ajouter ${espace.nom} aux favoris`}">
                        <img src="${favoris.includes(espace.id) ? "public/assets/img/icon/hearth.svg": "public/assets/img/icon/hearth-uncolor.svg"}" alt="">
                    </button>
                </div>
                <div class="card-content">
                    <h3>${espace.nom}</h3>
                    <div class="localisation-card wrapper">
                        <img src="public/assets/img/icon/gps.svg" alt="">
                        <p>${espace.quartier}</p>
                    </div>
                    <div class="stars-note">
                        <div class="nb-stars">
                            ${afficherEtoiles(espace.note, "public/assets/img/icon/")}
                        </div>
                        <p>${espace.note}</p>
                        <p>(${espace.nombreAvis} avis)</p>
                    </div>
                    <div class="options-space">
                        <div class="wrapper">
                            <img src="public/assets/img/icon/person.svg" alt="">
                            <p>${espace.capacite}pers.</p>
                        </div>
                        ${espace.equipements.some(equipement =>
                            equipement.toLowerCase().includes("wifi")
                        ) ? `
                            <div class="option wrapper">
                                <img src="public/assets/img/icon/wifi.svg" alt="">
                                <p>Fibre</p>
                            </div>
                        ` : ""}

                        ${espace.equipements.some(equipement =>
                            equipement.toLowerCase().includes("pmr")
                        ) ? `
                            <div class="option wrapper">
                                <img src="public/assets/img/icon/pmr.svg" alt="">
                                <p>PMR</p>
                            </div>
                        ` : ""}

                        ${espace.equipements.some(equipement =>
                            equipement.toLowerCase().includes("4k")
                        ) ? `
                            <div class="option wrapper">
                                <img src="public/assets/img/icon/screen.svg" alt="">
                                <p>4K</p>
                            </div>
                        ` : ""}
                    </div>
                    <div class="cta-card">
                        <p><span>${espace.tarifs.heure}€</span> /heure</p>
                        <a href="public/pages/espace.html?id=${espace.id}" class="btn btn-primary" aria-label="Aller vers la page détails de l'espace ${espace.nom}" title="Aller vers la page détails de l'espace ${espace.nom}">Voir la fiche</a>
                    </div>
                </div>
            </article>
        `;
    });
}

function afficherVilles(espaces){
    //Role : crée et affiche la liste des villes disponibles dans le select
    //Paramètres:
    //      espaces : tableau contenant les espaces
    //Retour : néant

    //Je prépare un tableau vide pour stocker toutes les villes
    const villes = [];
    //Je parcours le tableau des espaces et si la ville n'est pas dans le tableau villes je le la rajoute.
    espaces.forEach(espace => {
        if (!villes.includes(espace.ville)) {
            villes.push(espace.ville);
        }
    });
    //Je crée les options du select via son id
    villes.forEach(ville => {
        filtreVilles.innerHTML += `
            <option value="${ville}">${ville}</option>
        `;
    });
}

function filtrerEspaces(espaces){
    //Role : filtrer et afficher les espaces selon les critères sélectionnés
    //Paramètres: 
    //      espaces : tableau contenant les espaces 
    //Retour: néant 

    /* =============
    SELECT des villes
    =================== */
    //Je parcours le tableau des espaces. Si une ville est sélectionnée je créer un nouveau tableau filtré
    if(filtreVilles.value !== ""){
        espaces = espaces.filter(espace=>{
            return espace.ville === filtreVilles.value;
        })
    }

    /* =============
    SELECT des capacités
    =================== */
    //Je parcours le tableau des espaces et garde les espaces respectant les conditions values du select dans un nouveau tableau filtré
    if (filtreCapacite.value === "1-5") {
        espaces = espaces.filter(espace => {
            return espace.capacite >= 1 && espace.capacite <= 5;
        });
    }
    if (filtreCapacite.value === "6-10") {
        espaces = espaces.filter(espace => {
            return espace.capacite >= 6 && espace.capacite <= 10;
        });
    }
    if (filtreCapacite.value === "11-20") {
        espaces = espaces.filter(espace => {
            return espace.capacite >= 11 && espace.capacite <= 20;
        });
    }
    if (filtreCapacite.value === "20+") {
        espaces = espaces.filter(espace => {
            return espace.capacite >20;
        });
    }

     /* =============
    CHECKBOX des options
    =================== */
    //Je parcours le tableau des espaces pour chaque option checkée et garde uniquement ceux qui correspondent au de l'option sélectionnée. 
    if (wifiOption.checked) {
        espaces= espaces.filter(espace => {
            return espace.equipements.some(equipement => {
                return equipement.toLowerCase().includes("wifi");
            });
        });
    }
     if (pmrOption.checked) {
        espaces= espaces.filter(espace => {
            return espace.equipements.some(equipement => {
                return equipement.toLowerCase().includes("pmr");
            });
        });
    }
    if (screen4kOption.checked) {
        espaces= espaces.filter(espace => {
            return espace.equipements.some(equipement => {
                return equipement.toLowerCase().includes("4k");
            });

        });

    }
    //Je vérifie si au moins un filtre est sélectionné
    if (filtreVilles.value !== "" || filtreCapacite.value !== "" || wifiOption.checked || pmrOption.checked ||
        screen4kOption.checked) {
        popNb.textContent = `${espaces.length} résultats`;
    } else {
        popNb.textContent = "";
    }

    //J'affiche les espaces correspondant aux critères sélectionnés
    afficherEspaces(espaces);
}

function updateCoeurFavori(bouton, idEspace){
    //Role : met à jour l'image du coeur selon l'état du favori
    //Paramètres:
    //      bouton : bouton favori de la card
    //      idEspace : identifiant de l'espace
    //Retour : néant

    //Je récupère les favoris enregistrés
    const favoris = getFavoris();
    //Je récupère l'image du coeur dans le bouton
    const coeur = bouton.querySelector("img");
    //Si l'espace est dans les favoris, j'affiche le coeur rouge
    if (favoris.includes(idEspace)) {
        coeur.src = "public/assets/img/icon/hearth.svg";
    }
    //Sinon j'affiche le coeur vide
    else {
        coeur.src = "public/assets/img/icon/hearth-uncolor.svg";
    }
}



/* Lance l'initialisation de la page d'accueil */
initAccueil();