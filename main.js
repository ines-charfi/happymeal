// main.js

// Ce fichier JavaScript gère l'affichage des recettes, la sélection aléatoire de recettes, et l'affichage des détails d'une recette dans un modal.
// Il utilise Bootstrap pour le modal et Font Awesome pour les icônes.
// Il est également responsable de la gestion de la liste de courses et des favoris.
// Il est divisé en plusieurs sections pour une meilleure lisibilité et maintenabilité.
// Fonction pour ajouter une recette aux favoris
let recettes = [];

// Fonction pour charger les recettes depuis le fichier JSON
async function chargerRecettes() {
    const response = await fetch('data.json');
    const data = await response.json();
    recettes = data.recettes; // Utiliser la clé "recettes"
    afficherRecettesAleatoires();
}

// Fonction pour afficher des recettes aléatoires
function afficherRecettesAleatoires() {
    const randomRecipes = [];
    while (randomRecipes.length < 3) { // Afficher 3 recettes aléatoires
        const randomIndex = Math.floor(Math.random() * recettes.length);
        if (!randomRecipes.includes(recettes[randomIndex])) {
            randomRecipes.push(recettes[randomIndex]);
        }
    }
    const randomRecipesContainer = document.getElementById('random-recipes');
    randomRecipesContainer.innerHTML = randomRecipes.map(recette => `
        <div class="col-md-4">
            <div class="card">
               
                <div class="card-body">
                    <h5 class="card-title">${recette.nom}</h5>
                    <img src="${recette.img}" class="card-img-top" alt="${recette.nom}">
                    <p class="card-text">Temps de préparation: ${recette.temps_preparation}</p>
                    <p class="card-text">Catégorie: ${recette.categorie}</p>
                    
                    <button class="btn btn-info" onclick="afficherDetails('${recette.nom}')">Voir la recette</button>
                    <span class="favorite-icon" onclick="ajouterauxfavoris('${recette.nom}')" style="cursor: pointer;">
                        <i class="far fa-heart"></i> <!-- Icône de cœur -->
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// Fonction pour afficher les détails d'une recette
function afficherDetails(nom) {
    const recette = recettes.find(r => r.nom === nom);
    const modal = document.getElementById('recipeModal');
    document.getElementById('recipeModalTitle').innerText = recette.nom;
    document.getElementById('recipeModalTime').innerText = recette.temps_preparation;
    document.getElementById('recipeModalCategory').innerText = recette.categorie;

    // Afficher l'image de la recette
    const imgElement = document.createElement('img');
    imgElement.src = recette.img;
    imgElement.alt = recette.nom;
    imgElement.classList.add('img-fluid');
    imgElement.style.width = '20px'; // Ajuster la largeur de l'image
    imgElement.style.height = '20px'; // Ajuster la hauteur de l'image
    const imgContainer = document.getElementById('recipeModalImage');
    imgContainer.innerHTML = ''; // Vider le conteneur avant d'ajouter une nouvelle image
    imgContainer.appendChild(imgElement);

    // Afficher les ingrédients
    document.getElementById('recipeModalIngredients').innerHTML = recette.ingredients.map(ingredient => `
        <li>${ingredient.nom} (${ingredient.quantite}) <button onclick="ajouterListeCourses('${ingredient.nom}')">Ajouter</button></li>
    `).join('');

    // Afficher les étapes
    document.getElementById('recipeModalSteps').innerHTML = recette.etapes.map(etape => `<li>${etape}</li>`).join('');

    // Afficher le modal
    modal.style.display = 'block';

}


// Appeler la fonction pour charger les recettes au démarrage
chargerRecettes();
// Fonction pour ajouter une recette aux favoris

// Fonction pour ajouter un ingrédient à la liste de courses
function ajouterListeCourses(ingredient) {
    const listeCourses = document.getElementById('shoppingList');
    const li = document.createElement('li');
    li.innerText = ingredient;
    listeCourses.appendChild(li);
}
// Fonction pour fermer le modal
function fermerModal() {
    const modal = document.getElementById('recipeModal');
    modal.style.display = 'none';
}

    
