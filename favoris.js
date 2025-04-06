let favoris = [];
let shoppingList = [];

// Fonction pour charger les favoris depuis le localStorage
function chargerFavoris() {
  const favorisJSON = localStorage.getItem("favoris");
  if (favorisJSON) {
    favoris = JSON.parse(favorisJSON);
  }
  afficherFavoris();
}

// Fonction pour afficher les recettes favorites
function afficherFavoris() {
  const favoritesContainer = document.getElementById("favorites-container");
  if (favoris.length === 0) {
    favoritesContainer.innerHTML = "<p>Aucune recette favorite trouvée.</p>"; // Message si aucun favori
    return;
  }
  favoritesContainer.innerHTML = favoris
    .map(
      (recette) => `
        <div class="col-md-4">
            <div class="card">
                <img src="${recette.img}" class="card-img-top" alt="${recette.nom}">
                <div class="card-body">
                    <h5 class="card-title">${recette.nom}</h5>
                    <p class="card-text">Temps de préparation: ${recette.temps_preparation}</p>
                    <p class="card-text">Catégorie: ${recette.categorie}</p>
                    <button class="btn btn-info" onclick="afficherDetails('${recette.nom}')">Voir la recette</button>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

// Récupérer l'élément de la modal et créer l'instance une seule fois
const modalElement = document.getElementById("recipeModal");
const modal = new bootstrap.Modal(modalElement);
console.log("modal a la creation: " + modal);

// Ajouter un seul écouteur au bouton de fermeture
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("closeModal").addEventListener("click", function () {
    console.log("modal avant le hide: " + modal);
    modal.hide();
  });
});

// Fonction pour afficher les détails d'une recette
function afficherDetails(nomRecette) {
  const recette = favoris.find((r) => r.nom === nomRecette);
  if (recette) {
    document.getElementById("recipeModalTitle").innerText = recette.nom;
    document.getElementById("recipeModalImage").src = recette.img;
    document.getElementById("recipeModalTime").innerText =
      recette.temps_preparation;
    document.getElementById("recipeModalCategory").innerText =
      recette.categorie;

    const ingredientsList = document.getElementById("recipeModalIngredients");
    ingredientsList.innerHTML = recette.ingredients
      .map(
        (ing) => `
            <li>${ing.nom} (${ing.quantite})
                <button class="btn btn-sm btn-danger" onclick="ajouterIngredientListe('${ing.nom}')">Ajouter à la liste de courses</button>
            </li>
        `
      )
      .join("");

    const stepsList = document.getElementById("recipeModalSteps");
    stepsList.innerHTML = recette.etapes
      .map((step) => `<li>${step}</li>`)
      .join("");

    // Ajuster la taille de l'image
    const imgElement = document.getElementById("recipeModalImage");
    imgElement.style.width = "300px"; // Définir la largeur à 300 pixels
    imgElement.style.height = "auto"; // Garder le ratio d'aspect

    // Afficher le modal
    console.log("modal avant le show: " + modal);
    modal.show();
  }
}
// Fonction pour fermer le modal
function fermerModal() {
    const modal = document.getElementById('recipeModal');
    modal.style.display = 'none';
}


// Remplacer la fonction ajouterIngredientListe par :
function ajouterIngredientListe(ingredient) {
    // Charger la liste existante
    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    
    if (!shoppingList.includes(ingredient)) {
        shoppingList.push(ingredient);
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
        
        // Afficher une notification plus élégante
        const toast = document.createElement('div');
        toast.className = 'position-fixed bottom-0 end-0 p-3';
        toast.innerHTML = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-success text-white">
                    <strong class="me-auto">Liste de courses</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${ingredient} a été ajouté à votre liste !
                </div>
            </div>
        `;
        document.body.appendChild(toast);
        
        // Supprimer la notification après 3s
        setTimeout(() => toast.remove(), 3000);
    } else {
        alert(`${ingredient} a été ajouté dans votre liste.`);
    }
}

// Supprimer la fonction addToList qui est dupliquée

// Charger les favoris au démarrage
chargerFavoris();
