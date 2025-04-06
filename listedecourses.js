
// Charger la liste de courses au démarrage
document.addEventListener('DOMContentLoaded', chargerListeCourses);
// Liste de courses globale
let shoppingList = [];

// Fonction pour charger la liste de courses depuis le localStorage
function chargerListeCourses() {
    const listeCoursesJSON = localStorage.getItem('shoppingList');
    if (listeCoursesJSON) {
        shoppingList = JSON.parse(listeCoursesJSON);
    }
    afficherListeCourses();
}

// Fonction pour afficher la liste de courses
function afficherListeCourses() {
    const listeElement = document.getElementById('shopping-list');
    listeElement.innerHTML = ''; // Réinitialiser la liste

    if (shoppingList.length === 0) {
        listeElement.innerHTML = '<li class="list-group-item">Aucun élément dans la liste de courses.</li>';
        return;
    }

    shoppingList.forEach((ingredient, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.textContent = ingredient;

        // Bouton pour supprimer l'élément de la liste
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.onclick = () => {
            supprimerElementListe(index);
        };

        li.appendChild(deleteButton);
        listeElement.appendChild(li);
    });
}

// Fonction pour ajouter un élément à la liste de courses
function ajouterElementListe(ingredient) {
    if (!shoppingList.includes(ingredient)) {
        shoppingList.push(ingredient);
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList)); // Sauvegarder dans le localStorage
        afficherListeCourses();
        alert(`${ingredient} a été ajouté à votre liste de courses.`);
    } else {
        alert(`${ingredient} est déjà dans votre liste de courses.`);
    }
}

// Fonction pour supprimer un élément de la liste de courses
function supprimerElementListe(index) {
    shoppingList.splice(index, 1); // Supprimer l'élément à l'index donné
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList)); // Mettre à jour le localStorage
    afficherListeCourses(); // Mettre à jour l'affichage
}

// Fonction pour vider la liste de courses
function viderListeCourses() {
    shoppingList = []; // Réinitialiser la liste
    localStorage.removeItem('shoppingList'); // Supprimer la liste du localStorage
    afficherListeCourses(); // Mettre à jour l'affichage
}

// Fonction pour générer un PDF de la liste de courses
async function genererPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Liste de Courses", 10, 10);
    doc.setFontSize(12);

    shoppingList.forEach((ingredient, index) => {
        doc.text(`${index + 1}. ${ingredient}`, 10, 20 + (index * 10));
    });

    doc.save("liste_de_courses.pdf");
    
}
async function genererPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Couleurs
    const gold = [212, 175, 55];
    const darkGray = [51, 51, 51];
    const lightGray = [240, 240, 240];
    
    // En-tête avec cadre doré
    doc.setFillColor(...gold);
    doc.rect(5, 5, 200, 15, 'F');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text("LISTE DE COURSES", 105, 15, { align: 'center' });
    
    // Date
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const today = new Date().toLocaleDateString('fr-FR', options);
    doc.setFontSize(10);
    doc.text(`Date: ${today}`, 10, 25);
    
    // Cadre principal doré
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.5);
    doc.rect(5, 30, 200, doc.internal.pageSize.height - 40);
    
    // Contenu de la liste
    doc.setFontSize(14);
    doc.setTextColor(...darkGray);
    
    // Créer des sections par catégorie (exemple)
    const categories = {
        'Fruits & Légumes': [],
        'Produits Frais': [],
        'Épicerie': [],
        'Surgelés': [],
        'Divers': []
    };
    
    // Répartir les ingrédients dans les catégories (simplifié)
    shoppingList.forEach(ingredient => {
        if (ingredient.match(/pomme|banane|salade|tomate/i)) {
            categories['Fruits & Légumes'].push(ingredient);
        } else if (ingredient.match(/lait|fromage|yaourt/i)) {
            categories['Produits Frais'].push(ingredient);
        } else {
            categories['Divers'].push(ingredient);
        }
    });
    
    let yPosition = 40;
    
    // Parcourir les catégories
    Object.entries(categories).forEach(([category, items]) => {
        if (items.length > 0) {
            // Titre de catégorie
            doc.setFillColor(...lightGray);
            doc.rect(10, yPosition - 5, 190, 8, 'F');
            doc.setTextColor(...gold);
            doc.setFont('helvetica', 'bold');
            doc.text(category.toUpperCase(), 15, yPosition);
            yPosition += 10;
            
            // Items
            doc.setTextColor(...darkGray);
            doc.setFont('helvetica', 'normal');
            
            items.forEach((item, index) => {
                // Case à cocher
                doc.setDrawColor(...gold);
                doc.rect(15, yPosition + 2, 5, 5);
                
                // Texte de l'ingrédient
                doc.text(`   ${item}`, 25, yPosition + 6);
                yPosition += 8;
                
                // Nouvelle page si nécessaire
                if (yPosition > doc.internal.pageSize.height - 20) {
                    doc.addPage();
                    yPosition = 20;
                    doc.rect(5, 5, 200, doc.internal.pageSize.height - 10);
                }
            });
            
            yPosition += 8; // Espace entre catégories
        }
    });
    
    // Pied de page
    doc.setFontSize(10);
    doc.setTextColor(...gold);
    doc.text("Bonnes courses !", 105, doc.internal.pageSize.height - 10, { align: 'center' });
    
    // Enregistrer
    doc.save(`Liste_Courses_${today.replace(/\//g, '-')}.pdf`);
}
// Événements pour les boutons
document.getElementById('clear-list').addEventListener('click', viderListeCourses);
document.getElementById('generate-pdf').addEventListener('click', genererPDF);

// shopping-list-manager.js
class ShoppingListManager {
    static getList() {
        return JSON.parse(localStorage.getItem('shoppingList')) || [];
    }

    static addItem(ingredient) {
        const list = this.getList();
        if (!list.includes(ingredient)) {
            list.push(ingredient);
            localStorage.setItem('shoppingList', JSON.stringify(list));
            return true;
        }
        return false;
    }

    static removeItem(index) {
        const list = this.getList();
        list.splice(index, 1);
        localStorage.setItem('shoppingList', JSON.stringify(list));
    }

    static clearList() {
        localStorage.removeItem('shoppingList');
    }
}

// Utilisation dans favoris.js :
function ajouterIngredientListe(ingredient) {
    if (ShoppingListManager.addItem(ingredient)) {
        showSuccessToast(ingredient);
    } else {
        showDuplicateAlert(ingredient);
    }
}

// Utilisation dans listedecourses.js :
function supprimerElementListe(index) {
    ShoppingListManager.removeItem(index);
    afficherListeCourses();
}

function viderListeCourses() {
    ShoppingListManager.clearList();
    afficherListeCourses();
}