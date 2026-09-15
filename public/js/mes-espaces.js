//Fichier Js de la page mes-espaces
//Permettant de voir les cards des espaces en favoris et gerer les favoris 

/* =========================================================================
-async function initMesEspaces(): initialise les données nécessaires à la page mes espaces
-afficherFavoris(favorisSave): affiche les cards des espaces enregistrés en favoris
-retirerFavori(idEspace): retire un espace des favoris et met à jour l'affichage

=========================================================================== */

/* ------ Récupération des éléments réutilisés ---------- */
//Pour le message et la liste des favoris
const espaceMessage = document.getElementById("selection-message");
const listeHtmlFavoris = document.getElementById("saved-space-list");
const clearFavorites = document.getElementById("clear-favorites");
//Url pour l'appel de l'api
const url = "../data/espaces.json";


async function initMesEspaces(){
    //Role : initialise les données nécessaires à la page mes espaces
    //Paramètres:
    //      néant
    //Retour : néant

    //Je récupère les données des espaces
    const espaces = await getEspaces(url);
    //Je récupère la liste actuelle des favoris
    const favoris = getFavoris();
    //Je filtre les espaces pour ne garder que ceux présents dans les favoris
    const favorisSave = espaces.filter(espace => {
        return favoris.includes(espace.id);
    });
    //J'affiche les cards favoris ou le message d'infos
    afficherFavoris(favorisSave);
}

function afficherFavoris(favorisSave){
    //Role : affiche les cards des espaces enregistrés en favoris
    //Paramètres:
    //      favorisSave : tableau contenant les espaces enregistrés en favoris
    //Retour : néant

    //Je vide la grille avant d'ajouter les nouvelles cards
    listeHtmlFavoris.innerHTML = "";

    //Si aucun espace n'est sauvegargé en favoris
    if (favorisSave.length === 0) {
        //Je masque le bouton vider la sélection et j'affiche le message d'infos
        clearFavorites.style.display = "none";
        listeHtmlFavoris.innerHTML += `
            <li class="no-result">
                <div class="no-result-icon">
                    <img src="../assets/img/icon/hearth-uncolor.svg" alt="">
                </div>
                <h2>Aucun espace sauvegardé</h2>
                <p>Ajoutez des espaces à vos favoris depuis le</p>
                <div class="wrapper">
                    <p>catalogue en cliquant sur l'icône</p>
                    <img src="../assets/img/icon/hearth-uncolor.svg" alt="">
                </div>
            </li>
        `;
        return;
    }

    //Je parcours les espaces favoris et crée une card pour chaque espace favori
    favorisSave.forEach(espace => {
        listeHtmlFavoris.innerHTML += `
        <li>
            <article class="space-save-card">
                <div class="img-save-card">
                    <img src="../${espace.images[0]}" alt="Espace de travail ${espace.nom}">
                </div>
                <div class="save-card-content">
                    <div class="content-save">
                        <h3>${espace.nom}</h3>
                        <div class="wrapper">
                            <img src="../assets/img/icon/gps.svg" alt="">
                            <p>${espace.quartier}</p>
                        </div>
                        <div class="wrapper-bottom">
                            <div class="wrapper">
                                <img src="../assets/img/icon/person.svg" alt="">
                                <p>${espace.capacite} pers.</p>
                            </div>
                            <p><span>${espace.tarifs.heure}</span> /h</p>
                            <div class="nb-stars">
                                ${afficherEtoiles(espace.note, "../assets/img/icon/")}
                                <p>${espace.note}</p>
                            </div>   
                        </div>
                    </div>
                    <div class="cta-save-card">
                        <a href="../pages/espace.html?id=${espace.id}" class="btn btn-primary" aria-label="Aller vers la page détails de l'espace ${espace.nom}" title="Aller vers la page détails de l'espace ${espace.nom}">Voir la fiche</a>
                        <button type="button" class="btn trash-btn" onclick="retirerFavori(${espace.id})"; aria-label="Retirer ${espace.nom} des favoris">
                            <img src="../assets/img/icon/trash-uncolor.svg" alt="">
                            Retirer
                        </button>
                    </div>
                </div>
            </article>
        </li>
         `;
    });
}

function retirerFavori(idEspace){
    //Role : retire un espace des favoris et met à jour l'affichage
    //Paramètres:
    //      idEspace : identifiant de l'espace à retirer
    //Retour : néant

    //Je retire l'espace des favoris
    addOrRemoveFavori(idEspace);
    //Je recharge les cards de la page
    initMesEspaces();
}

function resetFavoris(){
    //Role: efface tout les favoris du localStorage
    //Paramètres
    //      
    //Retour : néant

    //Je récupère les favoris
    let favoris = getFavoris();
    //Je vide le tableau favoris
    favoris = [];
    //Je sauvegarde le tableau vide dans le localStorage
    localStorage.setItem("favoris", JSON.stringify(favoris));
    //Je mets à jour le nombre da favoris
    updateNbFavoris();
    //Je recharge l'affichage de la page
    initMesEspaces();
}





initMesEspaces();