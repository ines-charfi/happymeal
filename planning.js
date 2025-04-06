document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let planning = {};
    let favoris = [];
    let currentRecipeToAdd = null;
    
    // Initialisation
    initPlanning();
    loadFavorites();
    
    // Charger le planning depuis le localStorage
    function initPlanning() {
        const savedPlanning = localStorage.getItem('mealPlanning');
        if (savedPlanning) {
            planning = JSON.parse(savedPlanning);
        } else {
            // Structure initiale vide
            planning = {
                lundi: { midi: null, soir: null },
                mardi: { midi: null, soir: null },
                mercredi: { midi: null, soir: null },
                jeudi: { midi: null, soir: null },
                vendredi: { midi: null, soir: null },
                samedi: { midi: null, soir: null },
                dimanche: { midi: null, soir: null }
            };
        }
        renderPlanning();
    }
    
    // Charger les recettes favorites
    function loadFavorites() {
        const favorisJSON = localStorage.getItem('favoris');
        if (favorisJSON) {
            favoris = JSON.parse(favorisJSON);
        }
    }
    
    // Afficher le planning dans le tableau
    function renderPlanning() {
        const tableBody = document.getElementById('planning-table');
        tableBody.innerHTML = '';
        
        Object.entries(planning).forEach(([day, meals]) => {
            const row = document.createElement('tr');
            
            // Colonne Jour
            const dayCell = document.createElement('td');
            dayCell.textContent = day.charAt(0).toUpperCase() + day.slice(1);
            row.appendChild(dayCell);
            
            // Colonne Midi
            const lunchCell = document.createElement('td');
            if (meals.midi) {
                lunchCell.innerHTML = createMealCard(meals.midi, day, 'midi');
            } else {
                lunchCell.innerHTML = createAddButton(day, 'midi');
            }
            row.appendChild(lunchCell);
            
            // Colonne Soir
            const dinnerCell = document.createElement('td');
            if (meals.soir) {
                dinnerCell.innerHTML = createMealCard(meals.soir, day, 'soir');
            } else {
                dinnerCell.innerHTML = createAddButton(day, 'soir');
            }
            row.appendChild(dinnerCell);
            
            tableBody.appendChild(row);
        });
    }
    
    // Ajouter un repas au planning
    function addMeal(day, mealType, recipe) {
        planning[day][mealType] = recipe;
        localStorage.setItem('mealPlanning', JSON.stringify(planning));
        renderPlanning();
    }
    
    
    // Créer un bouton pour ajouter une recette
    function createAddButton(day, mealType) {
        return `
            <button class="btn btn-outline-secondary add-meal" 
                    data-day="${day}" data-meal="${mealType}">
                <i class="fas fa-plus"></i> Ajouter
            </button>
        `;
    }
    
    // Gestion des événements
    document.addEventListener('click', function(e) {
        // Bouton Ajouter
        if (e.target.closest('.add-meal')) {
            const button = e.target.closest('.add-meal');
            const day = button.dataset.day;
            const mealType = button.dataset.meal;
            openRecipeSelectionModal(day, mealType);
        }
        
        // Bouton Supprimer
        if (e.target.closest('.remove-meal')) {
            const button = e.target.closest('.remove-meal');
            const day = button.dataset.day;
            const mealType = button.dataset.meal;
            removeMeal(day, mealType);
        }
        
        // Bouton Voir la recette
        if (e.target.closest('.view-recipe')) {
            const button = e.target.closest('.view-recipe');
            const recipeName = button.dataset.recipe;
            showRecipeDetails(recipeName);
        }
    });
    
    // Modifiez la fonction openRecipeSelectionModal comme ceci :
function openRecipeSelectionModal(day, mealType) {
    currentRecipeToAdd = { day, mealType };
    const modalElement = document.getElementById('planningModal');
    const modal = new bootstrap.Modal(modalElement);
    
    // Remplir le modal avec les favoris
    const modalBody = document.querySelector('#planningModal .modal-body');
    modalBody.innerHTML = `
        <div class="form-group mb-3">
            <label for="planning-day" class="form-label">Jour</label>
            <select class="form-select" id="planning-day">
                ${Object.keys(planning).map(d => 
                    `<option value="${d}" ${d === day ? 'selected' : ''}>
                        ${d.charAt(0).toUpperCase() + d.slice(1)}
                    </option>`
                ).join('')}
            </select>
        </div>
        <div class="form-group mb-3">
            <label for="planning-meal" class="form-label">Repas</label>
            <select class="form-select" id="planning-meal">
                <option value="midi" ${mealType === 'midi' ? 'selected' : ''}>Midi</option>
                <option value="soir" ${mealType === 'soir' ? 'selected' : ''}>Soir</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Recettes favorites</label>
            <div class="favorites-list">
                ${favoris.length > 0 ? 
                    favoris.map(recipe => `
                        <div class="favorite-recipe card mb-2 p-2" data-recipe='${JSON.stringify(recipe)}' style="cursor: pointer;">
                            <div class="d-flex">
                                <img src="${recipe.img}" alt="${recipe.nom}" width="50" height="50" style="object-fit: cover;">
                                <div class="ms-3">
                                    <h5>${recipe.nom}</h5>
                                    <small>${recipe.temps_preparation}</small>
                                </div>
                            </div>
                        </div>
                    `).join('') : 
                    '<p class="text-center">Aucune recette favorite. Ajoutez-en depuis la page des recettes.</p>'
                }
            </div>
        </div>
    `;

    // Gestion de la sélection
    let selectedRecipe = null;
    
    // Sélection par clic sur une recette
    document.querySelectorAll('.favorite-recipe').forEach(item => {
        item.addEventListener('click', function() {
            // Retirer la sélection précédente
            document.querySelectorAll('.favorite-recipe').forEach(el => {
                el.style.backgroundColor = '';
            });
            // Sélectionner la nouvelle
            this.style.backgroundColor = '#f8f9fa';
            selectedRecipe = JSON.parse(this.dataset.recipe);
        });
    });

    // Bouton Confirmer
    document.getElementById('confirm-planning').addEventListener('click', function() {
        if (!selectedRecipe) {
            alert('Veuillez sélectionner une recette');
            return;
        }
        const day = document.getElementById('planning-day').value;
        const mealType = document.getElementById('planning-meal').value;
        addMeal(day, mealType, selectedRecipe);
        modal.hide();
    });

    // Bouton Annuler
    document.getElementById('cancel-planning').addEventListener('click', function() {
        modal.hide();
    });

    // Bouton Fermer
    document.getElementById('closePlanningModal').addEventListener('click', function() {
        modal.hide();
    });

    modal.show();
}
function genererPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configuration des styles
    const primaryColor = [220, 53, 69]; // Rouge Bootstrap
    const secondaryColor = [13, 110, 253]; // Bleu Bootstrap
    const lightColor = [248, 249, 250]; // Gris clair
    
    // En-tête du document
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("PLANNING DES REPAS", 105, 15, { align: 'center' });
    
    // Date de génération
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const today = new Date().toLocaleDateString('fr-FR', options);
    doc.setFontSize(10);
    doc.text(`Généré le ${today}`, 10, 25);
    
    // Contenu du planning
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    let yPosition = 40;
    const dayWidth = 30;
    const mealWidth = 80;
    
    // Entête du tableau
    doc.setFillColor(...lightColor);
    doc.rect(10, yPosition, dayWidth, 10, 'F');
    doc.rect(40, yPosition, mealWidth, 10, 'F');
    doc.rect(120, yPosition, mealWidth, 10, 'F');
    
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text("Jour", 25, yPosition + 7, { align: 'center' });
    doc.text("Repas de midi", 80, yPosition + 7, { align: 'center' });
    doc.text("Repas du soir", 160, yPosition + 7, { align: 'center' });
    
    yPosition += 15;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    // Remplissage des données
    Object.entries(planning).forEach(([day, meals]) => {
        // Fond alterné pour les jours
        if (yPosition % 30 < 15) {
            doc.setFillColor(...lightColor);
            doc.rect(10, yPosition - 3, 180, 15, 'F');
        }
        
        // Nom du jour
        doc.setTextColor(...primaryColor);
        doc.setFont('helvetica', 'bold');
        doc.text(
            day.charAt(0).toUpperCase() + day.slice(1), 
            25, 
            yPosition + 5, 
            { align: 'center' }
        );
        
        // Repas de midi
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        if (meals.midi) {
            doc.text(meals.midi.nom, 45, yPosition + 5, { maxWidth: mealWidth - 10 });
            doc.setFontSize(10);
            doc.text(meals.midi.temps_preparation, 45, yPosition + 10);
            doc.setFontSize(12);
        } else {
            doc.text("-", 80, yPosition + 5, { align: 'center' });
        }
        
        // Repas du soir
        if (meals.soir) {
            doc.text(meals.soir.nom, 125, yPosition + 5, { maxWidth: mealWidth - 10 });
            doc.setFontSize(10);
            doc.text(meals.soir.temps_preparation, 125, yPosition + 10);
            doc.setFontSize(12);
        } else {
            doc.text("-", 160, yPosition + 5, { align: 'center' });
        }
        
        yPosition += 20;
        
        // Nouvelle page si nécessaire
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
            
            // Répéter l'en-tête sur les nouvelles pages
            doc.setFillColor(...primaryColor);
            doc.rect(0, 0, 210, 20, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(20);
            doc.text("PLANNING DES REPAS (suite)", 105, 15, { align: 'center' });
            doc.setFontSize(12);
            
            yPosition = 30;
        }
    });
    
    // Pied de page
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Bon appétit !", 105, 285, { align: 'center' });
    doc.text("Generated by HappyMeal", 105, 290, { align: 'center' });
    
    // Sauvegarde du PDF
    doc.save(`planning_repas_${today.replace(/\s+/g, '_')}.pdf`);
}});