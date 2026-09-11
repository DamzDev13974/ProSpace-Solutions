//Fichier Js principal du site contenant les fonctions communes utilisées sur plusieurs pages. 


/* =========================================================================
-getEspaces() : récupère les données des espaces depuis le fichier JSON
-getFavoris():  récupère la liste des favoris enregistrés dans le localStorage
-updateNbFavoris(): met à jour le nombre de favoris affiché dans le badge du header
-addOrRemoveFavori(idEspace): ajoute ou retire un espace des favoris
=========================================================================== */

async function getEspaces(){
    //Role : récupère les données des espaces depuis le fichier JSON
    //Paramètres:
    //      néant
    //Retour : tableau contenant les espaces

    try {
        //Je récupère le fichier JSON
        const response = await fetch("public/data/espaces.json");
        //Je vérifie que la requête s'est bien déroulée
        if (!response.ok) {
            throw new Error("Erreur lors du chargement des espaces");
        }
        //Je convertis les données JSON en tableau d'objets
        const espaces = await response.json();
        //Je retourne le tableau des espaces
        return espaces;
    } catch (error) {
        //J'affiche l'erreur dans la console
        console.error(error);
        //Je retourne un tableau vide en cas d'erreur
        return [];
    }
}

function getFavoris(){
    //Role : récupère la liste des favoris enregistrés dans le localStorage
    //Paramètres:
    //      néant
    //Retour : tableau vide ou données du localStorage converties en tableau

    //Je récupère les favoris depuis le localStorage
    const favoris = localStorage.getItem("favoris");
    //Si favoris déjà enregistrés
    if (favoris){
        return JSON.parse(favoris);
    }

    //Sinon tableau vide
    return [];
}

function updateNbFavoris(){
    //Role : met à jour le nombre de favoris affiché dans le badge du header
    //Paramètres:
    //      néant
    //Retour : néant

    //Je récupère l'endroit où le nombre de favoris va s'afficher
    const nbFavoris = document.getElementById("nb-favorite");
    //Je récupère les favoris 
    const favoris = getFavoris();
    //Si aucun favori n'est enregistré, je masque le badge
    if (favoris.length === 0) {
        nbFavoris.style.display = "none";
    }//Sinon j'affiche le badge et le nombre de favoris
    else {
        nbFavoris.style.display = "flex";
        nbFavoris.textContent = favoris.length;
    }
}

function addOrRemoveFavori(idEspace){
    //Role : ajoute ou retire un espace des favoris
    //Paramètres:
    //      idEspace : identifiant de l'espace sélectionné
    //Retour : néant

    //Je récupère les favoris déjà enregistrés
    let favoris = getFavoris();
    //Si l'espace est déjà dans les favoris, je le retire
    if (favoris.includes(idEspace)) {
        favoris = favoris.filter(id => {
            return id !== idEspace;
        });
    }
    //Sinon je l'ajoute
    else {
        favoris.push(idEspace);
    }
    //J'enregistre le tableau mis à jour dans le localStorage
    localStorage.setItem("favoris", JSON.stringify(favoris));

    //Je mets à jour le compteur du header
    updateNbFavoris();
}



