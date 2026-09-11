//Fichier Js de la page espace
//Permettant de gérer l'affichage dynamique des informations à afficher pour avoir les détails d'un espace via son id et URLsearchparams()

/* =========================================================================
-initEspaces() : récupère et affiche les informations de l'espace correspondant à l'id de l'URL
-updateSeo(espace): met à jour le titre et la meta description selon l'espace affiché
-afficherSectionArianne(espace): affiche les élements nécessaire à la section arianne de la page
-afficherSectionGallery(espace): affiche les élements nécessaire à la section gallery de la page
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
    afficherSectionArianne(espace);
    //J'affiche les images de l'espace
    afficherSectionGallery(espace);
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

function afficherSectionArianne(espace){
    //Role : affiche les élements nécessaire à la section arianne de la page
    //Paramètres:
    //      espace : objet contenant les informations de l'espace
    //Retour : néant

    //Je récupère les emplacements du fil d'arianne
    const quartier = document.getElementById("liste-arianne");
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
            <div class="stars-note">
                <div class="nb-stars">
                    <!-- à gérer via fonction pour calculer par rapport à la note -->
                    <img src="../assets/img/icon/star.svg" alt="">
                    <p>${espace.nombreAvis} avis</p>
                </div>
                <p><span>.</span> ${espace.note}</p>
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
    galleryMain.innerHTML =`
        <img src="../${espace.images[0]}" alt="Espace de travail ${espace.nom}">
    `;
    gallerySide.innerHTML = `
    <img src="../${espace.images[1]}" alt="Vue de l'espace ${espace.nom}">
    <img src="../${espace.images[2]}" alt="Vue de l'espace ${espace.nom}">
`;

}




initEspace();