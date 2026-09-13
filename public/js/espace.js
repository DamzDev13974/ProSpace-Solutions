//Fichier Js de la page espace
//Permettant de gérer l'affichage dynamique des informations à afficher pour avoir les détails d'un espace via son id et URLsearchparams()

/* =========================================================================
-initEspaces() : récupère et affiche les informations de l'espace correspondant à l'id de l'URL
-updateSeo(espace): met à jour le titre et la meta description selon l'espace affiché
-afficherSectionariane(espace): affiche les élements nécessaire à la section ariane de la page
-afficherSectionGallery(espace): affiche les élements nécessaire à la section gallery de la page
-afficherSectionDetails(espace): affiche les élements nécessaire à la section space-details de la page
-updateBoutonFavori(idEspace): met à jour l'affichage du bouton favori selon l'état de l'espace
=========================================================================== */


/* ------ Récupération des éléments réutilisés ---------- */
//Url pour l'appel de l'api
const url = "../data/espaces.json";
/* ----Config URLSearchParams ----*/
//Je récupère les paramètres présents dans l'URL
const params = new URLSearchParams(window.location.search);
//Je récupère l'id de l'espace et je le convertis en nombre
const idEspace = Number(params.get("id"));
/* --------------------------------- */

async function initEspace(){
    //Role : récupère et affiche les informations de l'espace correspondant à l'id de l'URL
    //Paramètres:
    //      néant
    //Retour : néant

    //Je récupère les données des espaces
    const espaces = await getEspaces(url);
    //Je recherche l'espace correspondant à l'id récupéré dans l'URL
    const espace = espaces.find(espace => {
        return espace.id === idEspace;
    });
    
    //Maj du head
    updateSeo(espace);
    //J'affiche l'entete des détails
    afficherSectionariane(espace);
    //J'affiche les images de l'espace
    afficherSectionGallery(espace);
    //J'affiche les détails de l'espace
    afficherSectionDetails(espace);
    //Je mets à jour le bouton sauvegarde de favoris
    updateBoutonFavori(espace.id);
}

function updateSeo(espace){
    //Role : met à jour le titre et la meta description selon l'espace affiché
    //Paramètres:
    //      espace : objet contenant les informations de l'espace
    //Retour : néant

    //Je récupère le title 
    const pageTitle = document.getElementById("page-title");
    //Je récupère la meta-description
    const metaDescription = document.getElementById("meta-description");
    //Je les mets à jour via les données de l'espace affiché
    pageTitle.textContent = `${espace.nom} - Espace de travail ${espace.capacite} p. | ProSpace Solutions`;
    metaDescription.setAttribute("content", espace.metaDescription);
}

function afficherSectionariane(espace){
    //Role : affiche les élements nécessaire à la section ariane de la page
    //Paramètres:
    //      espace : objet contenant les informations de l'espace
    //Retour : néant

    //Je récupère les emplacements du fil d'ariane
    const quartier = document.getElementById("liste-ariane");
    //Je récupère les emplacements pour le titre
    const titleSpace = document.getElementById("space-title");
    //Je crée l'html pour ces emplacements
    quartier.innerHTML = `
        <li>
            <a href="../../index.html" aria-label="Aller à la page d'accueil" title="Aller à la page d'accueil">Accueil</a>
        </li>
        <li>
            <span>
                <img src="../assets/img/icon/right-arrow.svg" alt="">
            </span>
            ${espace.quartier}
        </li>
        <li>
            <span>
                <img src="../assets/img/icon/right-arrow.svg" alt="">
            </span>
            ${espace.nom}
        </li>
    `;
    titleSpace.innerHTML = `
        <h1>${espace.nom}</h1>
        <div class="space-adresse">
            <div class="wrapper">
                <img src="../assets/img/icon/gps.svg" alt="">
                <p>${espace.adresse}</p>
            </div>
            <div class="stars-note-details">
                <div class="nb-stars">
                    ${afficherEtoiles(espace.note,"../assets/img/icon/")}
                    <p>${espace.note}</p>
                </div>
                <p>.${espace.nombreAvis} avis vérifiés</p>
            </div>
        </div>
    `;
}

function afficherSectionGallery(espace){
    //Role : affiche les élements nécessaire à la section gallery de la page
    //Paramètres:
    //      espace : objet contenant les informations de l'espace
    //Retour : néant

    //Je récupère les emplacements de la gallery principale
    const galleryMain = document.getElementById("gallery-main");
    //Je récupère les emplacements de la gallery secondaire
    const gallerySide = document.getElementById("gallery-side");
    //Je crée l'html pour ces emplacements
    galleryMain.innerHTML =`
        <img src="../${espace.images[0]}" alt="Espace de travail ${espace.nom}">
    `;
    gallerySide.innerHTML = `
        <div class="gallery-side-top">
            <img src="../${espace.images[1]}" alt="Vue de l'espace ${espace.nom}">
        </div>
        <div class="gallery-side-bottom">
            <img src="../${espace.images[2]}" alt="Vue de l'espace ${espace.nom}">
        </div>
    `;
}

function afficherSectionDetails(espace){
    //Role : affiche les élements nécessaire à la section space-details de la page
    //Paramètres:
    //      espace : objet contenant les informations de l'espace
    //Retour : néant

    //Je récupère les emplacements pour la div about-space
    const aboutSpace = document.getElementById("about-space");
    //Je récupère les emplacements pour la div équipements
    const equipementsList = document.getElementById("equipements-list");
    //Je récupère les emplacements pour la div capacity
    const capacity = document.getElementById("capacity");
    //Et celui du pricing. 
    const pricing = document.getElementById("pricing");
    //Je crée l'html pour ces emplacements
    aboutSpace.innerHTML=`
        <h2>À propos de cet espace</h2>
        <p>${espace.description}</p>
    `;
    //Je parcours le tableau des équipements et je crée un li pour chacun
    espace.equipements.forEach(equipement => {
        equipementsList.innerHTML += `
            <li >
                <div class="wrapper">
                    <img src="../assets/img/icon/checked.svg" alt="">
                    ${equipement}
                </div>
            </li>
        `;
    });
    capacity.innerHTML =`
        <h3>Capacité & Configuration</h3>
        <div class="infos-capacity wrapper">
            <img src="../assets/img/icon/person.svg" alt="">
            <div class="capacity-text">
                <p>Jusqu'à <span>${espace.capacite} personnes</span></p>
                <p>Configuration modulable : théâtre, classe, U, boardroom — sur demande.</p>
            </div>
        </div>
    `;
    pricing.innerHTML= `
        <h3>Tarifs</h3>
        <table class="pricing-table">
            <caption>Tarifs de l'espace ${espace.nom}</caption>
            <thead>
                <tr>
                    <th>Durée</th>
                    <th>Tarif</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <div class="wrapper">
                            <img src="../assets/img/icon/clock-uncolor.svg" alt="">
                            À l'heure
                        </div>
                    </td>
                    <td>${espace.tarifs.heure} €</td>
                </tr>
                <tr>
                    <td>
                        <div class="wrapper">
                            <img src="../assets/img/icon/clock-uncolor.svg" alt="">
                            Demi-journée (4h)
                        </div>
                    </td>
                    <td>${espace.tarifs.demiJournee} €</td>
                </tr>
                <tr>
                    <td>
                        <div class="wrapper">
                            <img src="../assets/img/icon/clock.svg" alt="">
                            Journée complète
                        </div>
                    </td>
                    <td>${espace.tarifs.journee} €</td>
                </tr>
            </tbody>
        </table>
        <button type="button" id="favorite-detail-btn" onclick="addOrRemoveFavori(${espace.id}); updateBoutonFavori(${espace.id})">
            <img src="../assets/img/icon/hearth-uncolor.svg" alt="">
            Sauvegarder en favoris
        </button>
        <a href="contact.html" class="btn-primary contact-btn" aria-label="Aller sur la page contact" title="Aller sur la page contact">
            <img src="../assets/img/icon/tel.svg" alt="">
            Contacter l'équipe
        </a>
        <p>Réponse garantie sous 2h ouvrées · Sans engagement</p>    
    `;
}

function updateBoutonFavori(idEspace){
    //Role : met à jour l'affichage du bouton favori selon l'état de l'espace
    //Paramètres:
    //      idEspace : identifiant de l'espace affiché
    //Retour : néant

    //Je récupère le bouton favori de la page détail
    const boutonFavori = document.getElementById("favorite-detail-btn");
    //Je récupère la liste des favoris enregistrés
    const favoris = getFavoris();
    //Si l'espace est déjà dans les favoris, j'affiche l'état sauvegardé
    if (favoris.includes(idEspace)) {
        boutonFavori.classList.add("is-favorite");
        boutonFavori.innerHTML = `
            <img src="../assets/img/icon/hearth.svg" alt="">
            Sauvegardé en favoris
        `;
    }
    //Sinon, j'affiche l'état non sauvegardé
    else {
        boutonFavori.classList.remove("is-favorite");
        boutonFavori.innerHTML = `
            <img src="../assets/img/icon/hearth-uncolor.svg" alt="">
            Sauvegarder en favoris
        `;
    }
}


initEspace();