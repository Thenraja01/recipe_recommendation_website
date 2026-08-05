const config = require('../config/env');

// Common allergens list for detection
const COMMON_ALLERGENS = [
  'milk', 'dairy', 'eggs', 'fish', 'shellfish', 'tree nuts', 'peanuts', 
  'wheat', 'gluten', 'soy', 'sesame', 'celery', 'mustard', 'sulfites', 'lupin'
];

class NutritionService {
  constructor() {
    this.appId = config.edamamAppId || process.env.EDAMAM_APP_ID;
    this.appKey = config.edamamAppKey || process.env.EDAMAM_APP_KEY;
    this.baseUrl = 'https://api.edamam.com/api/nutrition-details';
  }

  /**
   * Get nutrition information from Edamam API
   * @param {Object} recipeData - Recipe ingredients and data
   * @returns {Promise<Object>} Nutrition data
   */
  async getNutritionInfo(recipeData) {
    if (!this.appId || !this.appKey) {
      console.warn('Edamam API credentials not configured, returning mock data');
      return this.getMockNutrition(recipeData);
    }

    try {
      const ingredients = this.formatIngredients(recipeData);
      
      const response = await fetch(
        `${this.baseUrl}?app_id=${this.appId}&app_key=${this.appKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            ingr: ingredients
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Edamam API error: ${response.status}`);
      }

      const data = await response.json();
      
      return this.parseNutritionResponse(data, recipeData);
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
      return this.getMockNutrition(recipeData);
    }
  }

  /**
   * Format recipe ingredients for Edamam API
   */
  formatIngredients(recipeData) {
    const ingredients = [];
    
    if (recipeData.ingredients && Array.isArray(recipeData.ingredients)) {
      recipeData.ingredients.forEach(ing => {
        if (typeof ing === 'object') {
          ingredients.push(`${ing.quantity || 1} ${ing.unit || ''} ${ing.name || ing}`);
        } else {
          ingredients.push(ing);
        }
      });
    } else if (typeof recipeData.ingredients === 'string') {
      ingredients.push(recipeData.ingredients);
    }

    return ingredients;
  }

  /**
   * Parse Edamam API response
   */
  parseNutritionResponse(data, recipeData) {
    const total = data.total || {};
    const healthLabels = data.healthLabels || [];
    const dietLabels = data.dietLabels || [];
    const warnings = data.cautions || [];

    return {
      calories: Math.round(total.ENERC_KCAL || 0),
      protein: Math.round(total.PROCNT || 0),
      carbs: Math.round(total.CHOCDF || 0),
      fat: Math.round(total.FAT || 0),
      fiber: Math.round(total.FIBTG || 0),
      sugar: Math.round(total.SUGAR || 0),
      sodium: Math.round(total.NA || 0),
      cholesterol: Math.round(total.CHOLE || 0),
      saturatedFat: Math.round(total.FASAT || 0),
      transFat: Math.round(total.FATRN || 0),
      vitaminA: Math.round(total.VITA_RAE || 0),
      vitaminC: Math.round(total.VITC || 0),
      calcium: Math.round(total.CA || 0),
      iron: Math.round(total.FE || 0),
      servingSize: total.quantity || 1,
      healthLabels,
      dietLabels,
      warnings,
      allergens: this.detectAllergens(recipeData, healthLabels, warnings)
    };
  }

  /**
   * Detect allergens from recipe data and API response
   */
  detectAllergens(recipeData, healthLabels = [], warnings = []) {
    const detectedAllergens = new Set();
    
    // Check from health labels and warnings
    const allLabels = [...healthLabels, ...warnings].join(' ').toLowerCase();
    
    COMMON_ALLERGENS.forEach(allergen => {
      if (allLabels.includes(allergen)) {
        detectedAllergens.add(allergen);
      }
    });

    // Check from ingredients
    if (recipeData.ingredients) {
      const ingredientsText = Array.isArray(recipeData.ingredients)
        ? recipeData.ingredients.map(i => typeof i === 'object' ? i.name : i).join(' ').toLowerCase()
        : recipeData.ingredients.toLowerCase();

      COMMON_ALLERGENS.forEach(allergen => {
        if (ingredientsText.includes(allergen)) {
          detectedAllergens.add(allergen);
        }
      });
    }

    return Array.from(detectedAllergens);
  }

  /**
   * Check if recipe contains user's allergens
   */
  checkAllergenWarnings(recipeAllergens, userAllergens = []) {
    if (!userAllergens || userAllergens.length === 0) {
      return { hasAllergens: false, matched: [] };
    }

    const userAllergensLower = userAllergens.map(a => a.toLowerCase());
    const matched = recipeAllergens.filter(ra => 
      userAllergensLower.some(ua => 
        ra.includes(ua) || ua.includes(ra)
      )
    );

    return {
      hasAllergens: matched.length > 0,
      matched
    };
  }

  /**
   * Get mock nutrition data when API is not available
   */
  getMockNutrition(recipeData) {
    const ingredientCount = Array.isArray(recipeData.ingredients) 
      ? recipeData.ingredients.length 
      : 1;
    
    const baseCalories = 150 * ingredientCount;
    
    return {
      calories: baseCalories,
      protein: Math.round(baseCalories * 0.15),
      carbs: Math.round(baseCalories * 0.45),
      fat: Math.round(baseCalories * 0.30),
      fiber: Math.round(ingredientCount * 3),
      sugar: Math.round(baseCalories * 0.10),
      sodium: Math.round(ingredientCount * 200),
      cholesterol: Math.round(ingredientCount * 20),
      saturatedFat: Math.round(baseCalories * 0.10),
      transFat: 0,
      vitaminA: Math.round(ingredientCount * 100),
      vitaminC: Math.round(ingredientCount * 15),
      calcium: Math.round(ingredientCount * 50),
      iron: Math.round(ingredientCount * 2),
      servingSize: 1,
      healthLabels: [],
      dietLabels: [],
      warnings: [],
      allergens: this.detectAllergens(recipeData)
    };
  }

  /**
   * Get nutrition summary text
   */
  getNutritionSummary(nutrition) {
    return `Calories: ${nutrition.calories} | Protein: ${nutrition.protein}g | Carbs: ${nutrition.carbs}g | Fat: ${nutrition.fat}g`;
  }
}

module.exports = new NutritionService();
