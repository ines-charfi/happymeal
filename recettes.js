let recettes = [];
let currentPage = 1;
const recipesPerPage = 9;
let favoris = [];

// Fonction pour charger les recettes depuis le fichier JSON
async function chargerRecettes() {
    const response = await fetch('data.json');
    const data = await response.json();
    recettes = data.recettes; // Utiliser la clé "recettes"
    chargerFavoris(); // Charger les favoris au démarrage
    afficherRecettes(currentPage);
}

// Fonction pour charger les favoris depuis le localStorage
function chargerFavoris() {
    const favorisJSON = localStorage.getItem('favoris');
    if (favorisJSON) {
        favoris = JSON.parse(favorisJSON);
    }
}

// Fonction pour afficher les recettes de la page actuelle
function afficherRecettes(page) {
    const startIndex = (page - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    const recettesPage = recettes.slice(startIndex, endIndex);

    const allRecipesContainer = document.getElementById('all-recipes');
    allRecipesContainer.innerHTML = recettesPage.map(recette => {
        const isFavori = favoris.some(r => r.nom === recette.nom); // Vérifiez si la recette est déjà dans les favoris
        return `
            <div class="col-md-4">
                <div class="card">
                    <img src="${recette.img}" class="card-img-top" alt="${recette.nom}">
                    <div class="card-body">
                        <h5 class="card-title">${recette.nom}</h5>
                        <p class="card-text">Temps de préparation: ${recette.temps_preparation}</p>
                        <p class="card-text">Catégorie: ${recette.categorie}</p>
                        <button class="btn btn-info" onclick="afficherDetails('${recette.nom}')">Voir la recette</button>
                        <span class="favorite-icon" onclick="ajouterauxfavoris('${recette.nom}')" style="cursor: pointer;">
                            <i class="${isFavori ? 'fas' : 'far'} fa-heart" style="color: ${isFavori ? 'red' : 'black'};"></i> <!-- Icône de cœur -->
                        </span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    

    afficherPagination(page);
}


// Fonction pour afficher la pagination
function afficherPagination(page) {
    const paginationContainer = document.getElementById('pagination');
    const totalPages = Math.ceil(recettes.length / recipesPerPage);
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.className = 'btn btn-secondary me-1';
        button.onclick = () => {
            currentPage = i;
            afficherRecettes(currentPage);
        };
        if (i === page) {
            button.classList.add('active'); // Mettre en surbrillance le bouton de la page actuelle
        }
        paginationContainer.appendChild(button);
    }
}
function afficherDetails(nomRecette) {
    const recette = recettes.find(r => r.nom === nomRecette); // Cherchez dans la liste des recettes
    if (recette) {
        document.getElementById('recipeModalTitle').innerText = recette.nom;
        document.getElementById('recipeModalImage').src = recette.img;
        document.getElementById('recipeModalTime').innerText = recette.temps_preparation;
        document.getElementById('recipeModalCategory').innerText = recette.categorie;

        const ingredientsList = document.getElementById('recipeModalIngredients');
        ingredientsList.innerHTML = recette.ingredients.map(ing => `<li>${ing.nom} (${ing.quantite})</li>`).join('');

        const stepsList = document.getElementById('recipeModalSteps');
        stepsList.innerHTML = recette.etapes.map(step => `<li>${step}</li>`).join('');

        // Afficher le modal
        const modal = new bootstrap.Modal(document.getElementById('recipeModal'));
        modal.show();
    } else {
        console.error("Recette non trouvée:", nomRecette);
    }
}
// Fonction pour ajouter une recette aux favoris
function ajouterauxfavoris(nomRecette) {
    const recette = recettes.find(r => r.nom === nomRecette);
    if (recette) {
        // Vérifiez si la recette est déjà dans les favoris
        if (!favoris.some(r => r.nom === recette.nom)) {
            favoris.push(recette);
            localStorage.setItem('favoris', JSON.stringify(favoris)); // Sauvegarder dans le localStorage
            alert(`${recette.nom} a été ajouté aux favoris !`);
            // Mettre à jour l'icône de cœur
            document.querySelector(`span[onclick="ajouterauxfavoris('${recette.nom            }')"] i`).classList.remove('far');
            document.querySelector(`span[onclick="ajouterauxfavoris('${recette.nom}')"] i`).classList.add('fas'); // Changer en cœur plein
            document.querySelector(`span[onclick="ajouterauxfavoris('${recette.nom}')"]`).style.color = 'red'; // Changer la couleur en rouge
        } else {
            alert(`${recette.nom} est déjà dans vos favoris.`);
        }
    }
}

// Appeler la fonction pour charger les recettes au démarrage
chargerRecettes();