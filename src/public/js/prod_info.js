const ingredientsToTrust = ["Whole Wheat Flour", "Water", "Vegetable Oil"];
const redFlagIngredients = ["Monosodium Glutamate (MSG)", "Artificial Flavors", "High Sodium"];
const healthierAlternatives = ["Whole Grain Noodles", "Vegetable Broth"];
const aiSuggestions = ["Try adding more vegetables.", "Consider a low-sodium version."];
const allIngredients = ["Refined Wheat Flour (Maida)", "Palm Oil", "Iodized Salt", "Wheat Gluten", "Dehydrated Vegetables [Carrot (8.5%), Green Peas (5.3%), Onion (4.5%)]", "Spices & Condiments [Chilli Powder (0.7%), Turmeric Powder (0.5%), Dried Garlic (0.5%), Cumin Powder (0.4%), Coriander Powder (0.3%), Ginger Powder (0.3%), Black Pepper Powder (0.1%), Fenugreek Powder]", "Sugar", "Acidity Regulators (330, 500(ii))", "Flavour Enhancer (621)", "Yeast Extract", "Dried Kasuri Methi."];
const nutritionBreakdown = {
    "Energy": "385 kcal",
    "Protein": "8.1 g",
    "Carbohydrate": "57.5 g",
    "Total Fat": "13.8 g",
    "Sodium": "1200 mg"
};

// Function to populate ingredients
function populateIngredients(elementId, ingredients) {
    const container = document.querySelector(`#${elementId} .content`) || document.getElementById(elementId);
    if (container) {
        const ul = document.createElement('ul');
        ingredients.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    }
}

// Function to populate nutrition breakdown
function populateNutrition(elementId, nutrition) {
    const container = document.getElementById(elementId);
    if (container) {
        const ul = document.createElement('ul');
        for (const key in nutrition) {
            if (nutrition.hasOwnProperty(key)) {
                const li = document.createElement('li');
                li.textContent = `${key}: ${nutrition[key]}`;
                ul.appendChild(li);
            }
        }
        container.appendChild(ul);
    }
}

// Populate data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    populateIngredients('trust', ingredientsToTrust);
    populateIngredients('flags', redFlagIngredients);
    populateIngredients('alternatives', healthierAlternatives);
    populateIngredients('ai-suggestions', aiSuggestions);
    populateIngredients('ingredients', allIngredients);
    populateNutrition('nutrition', nutritionBreakdown);
});