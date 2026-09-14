//Fichier Js de la page contact. 
//Permettant de gérer le formulaire et ses contraintes, le caroussel

/* =========================================================================
-clearErrors(): efface tous les messages d'erreurs du formulaire
-showError(fieldId, message): affiche un message d'erreur pour un champ
-validateName(): vérifie que le nom respecte les contraintes demandées
-validateEmail(): vérifie que l'email respecte le format demandé
-validateCompany(): vérifie que le nom de l'entreprise respecte les contraintes demandées
-validatePhone(): vérifie le format du numéro de téléphone s'il est renseigné
-validateMessage(): vérifie que le message est renseigné
-validatePrivacy(): vérifie que la politique de confidentialité est acceptée
-validateForm(): vérifie les différents champs du formulaire
=========================================================================== */

/* ------ Récupération des éléments réutilisés ---------- */
//Je récupère le formulaire
const formContact = document.querySelector(".form-contact");
//Je récupère les champs du formulaire
const nameElement = document.getElementById("name");
const emailElement = document.getElementById("email");
const companyElement = document.getElementById("company");
const phoneElement = document.getElementById("phone");
const subjectElement = document.getElementById("subject");
const messageElement = document.getElementById("message");
const privacyElement = document.getElementById("privacy");

/* ================= Validation de tous les champs ================== */

function clearErrors(){
    //Role : efface tous les messages d'erreurs du formulaire
    //Paramètres:
    //      néant
    //Retour : néant

    //Je récupère tout les span par la classe et je vide leur contenu
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach(message => {
        message.textContent = "";
    });
}

function showError(fieldId, message){
    //Role : affiche le message d'erreur correspondant au champ
    //Paramètres:
    //      fieldId : id du champ concerné
    //      message : message d'erreur à afficher
    //Retour : néant

    //Je récupère le span correspondant à l'input en erreur par son id et si il existe je lui attribue un message
    const errorMessage = document.getElementById(fieldId + "-error");
    if (errorMessage) {
        errorMessage.textContent = message;
    }
}

/* =======================
Bloc pour les contraintes des champs
=========================*/

/* Nom */
function validateName(){
    //Role : vérifie que le nom respecte les contraintes demandées
    //Paramètres:
    //      néant
    //Retour : true si le nom est valide, false sinon

    ////Je récupère et nettoie la valeur du champ 
    const nameValue = nameElement.value.trim();
    //Je vérifie que la contrainte est respesctée
    if (nameValue.length < 2 || nameValue.length > 50) {
        showError("name", "Le nom doit comprendre entre 2 et 50 caractères");
        return false;
    }
    //Si le champ est valide, je supprime l'ancien message d'erreur
    document.getElementById("name-error").textContent = "";
    return true;
}

/* Email */
function validateEmail(){
    //Role : vérifie que l'email respecte le format demandé
    //Paramètres:
    //      néant
    //Retour : true si l'email est valide, false sinon

    //Je définis le format attendu pour l'email via un regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValue = emailElement.value.trim();
    //Je vérifie si il respecte le format demandé
    if (!emailRegex.test(emailValue)) {
        showError("email", "Format d'email invalide");
        return false;
    }
    //Si le champ est valide, je supprime l'ancien message d'erreur
    document.getElementById("email-error").textContent = "";
    return true;
}

/* Entreprise */
function validateCompany(){
    //Role : vérifie que le nom de l'entreprise respecte les contraintes demandées
    //Paramètres:
    //      néant
    //Retour : true si l'entreprise est valide, false sinon

    const companyValue = companyElement.value.trim();
    if (companyValue.length < 2 || companyValue.length > 100) {
        showError("company", "Le nom de l'entreprise doit comprendre entre 2 et 100 caractères");
        return false;
    }

    document.getElementById("company-error").textContent = "";
    return true;
}

/* Téléphone */
function validatePhone(){
    //Role : vérifie le format du numéro de téléphone s'il est renseigné
    //Paramètres:
    //      néant
    //Retour : true si le téléphone est valide ou vide, false sinon

    //Je définis le format attendu pour le numéro de téléphone
    const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\d{9,12}$/;
    const phoneValue = phoneElement.value.trim();
    //Le téléphone est facultatif, je le vérifie seulement s'il est renseigné
    if (phoneValue !== "" && !phoneRegex.test(phoneValue)) {
        showError("phone", "Format de numéro de téléphone invalide");
        return false;
    }

    document.getElementById("phone-error").textContent = "";
    return true;
}

/* Message */
function validateMessage(){
    //Role : vérifie que le message est renseigné
    //Paramètres:
    //      néant
    //Retour : true si le message est valide, false sinon

    const messageValue = messageElement.value.trim();
    if (messageValue === "") {
        showError("message", "Le message est requis");
        return false;
    }

    document.getElementById("message-error").textContent = "";
    return true;
}


/* Checkbox confidentialité */
function validatePrivacy(){
    //Role : vérifie que la politique de confidentialité est acceptée
    //Paramètres:
    //      néant
    //Retour : true si la case est cochée, false sinon

    //Si le checbox n'est pas coché
    if (!privacyElement.checked) {
        showError("privacy", "Veuillez accepter la politique de confidentialité");
        return false;
    }

    document.getElementById("privacy-error").textContent = "";
    return true;
}

function validateForm(){
    //Role : vérifie les différents champs du formulaire
    //Paramètres:
    //      néant
    //Retour : true si le formulaire est valide, false sinon

    //Je crée un booleen pour la validité du formulaire
    let isValid = true;
    //Je supprime les anciens messages d'erreurs
    clearErrors();

    //Je vérifie tout les champs obligatoires 
    if (!validateName()) {
        isValid = false;
    }
    if (!validateEmail()) {
        isValid = false;
    }
    if (!validateCompany()) {
        isValid = false;
    }
    if (!validatePhone()) {
        isValid = false;
    }
    if (!validateMessage()) {
        isValid = false;
    }
    if (!validatePrivacy()) {
        isValid = false;
    }

    return isValid;
}

/* ================= 
Validation en temps réel 
================== */
//J'ajoute des écouteurs aux champs pour la validation en temps réel.
nameElement.addEventListener("blur", validateName);
emailElement.addEventListener("blur", validateEmail);
companyElement.addEventListener("blur", validateCompany);
phoneElement.addEventListener("blur", validatePhone);
messageElement.addEventListener("blur", validateMessage);
privacyElement.addEventListener("change", validatePrivacy);

/* ================= 
Submit et confirmation
================== */
formContact.addEventListener("submit", function(event){
    //J'empêche le rechargement de la page
    event.preventDefault();
    //Je récupère l'emplacement pour le message de confirmation
    const formContent = document.getElementById("form-card");
    //Je vérifie le formulaire et si il est valide j'affiche la div de confirmation à la place du formulaire
    if (validateForm()) {
        formContent.innerHTML = `
        <div class="success-message">
            <div class="success-icon">
                <img src="../assets/img/icon/checked.svg" alt="">
            </div>
            <h2>Message envoyé !</h2>
            <p>Merci <span>${nameElement.value}</span>, nous avons bien reçu votre message. Notre équipe vous contactera sous 2h ouvrées à l'adresse <span>${emailElement.value}</span>. </p>
            <button type="button" class="btn btn-primary" id="new-message">
                Nouveau message
            </button>
        </div>
    `;
    }

    //J'ajoute l'ecouteur pour renvoyer un nouveau message
    document.getElementById("new-message").addEventListener("click", function(){
            window.location.reload();
        });
});

