import React, { useState } from 'react';
import axios from 'axios';
import './MealAnalyzer.css';

const MealAnalyzer = () => {
  const [foodItems, setFoodItems] = useState('');
  const [portionSize, setPortionSize] = useState(100); // Default portion size is 100g
  const [nutritionData, setNutritionData] = useState(null);
  const [mealCategory, setMealCategory] = useState('Breakfast');
  const [mealLog, setMealLog] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle food items input change
  const handleFoodItemsChange = (e) => {
    setFoodItems(e.target.value);
  };

  // Handle portion size input change (in grams)
  const handlePortionSizeChange = (e) => {
    setPortionSize(e.target.value);
  };

  // Handle meal category selection
  const handleCategoryChange = (e) => {
    setMealCategory(e.target.value);
  };

  // Function to fetch nutrition data from Nutritionix API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foodItems) {
      alert('Please enter food items.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiKey = '0dc5923a5187ebfbbec4376879ce2155';
      const response = await axios.post(
        'https://trackapi.nutritionix.com/v2/natural/nutrients',
        { query: foodItems },
        {
          headers: {
            'x-app-id': 'bbd2d85e',  // Replace with your App ID
            'x-app-key': apiKey,        // Replace with your API Key
          },
        }
      );

      const data = response.data.foods[0];
      const basePortionSize = 100; // Assuming the data from API is per 100g

      // Adjusting for portion size and preparing macro/micronutrient data
      setNutritionData({
        nf_calories: (data.nf_calories * (portionSize / basePortionSize)),
        nf_protein: (data.nf_protein * (portionSize / basePortionSize)),
        nf_total_fat: (data.nf_total_fat * (portionSize / basePortionSize)),
        nf_total_carbohydrate: (data.nf_total_carbohydrate * (portionSize / basePortionSize)),
        // Micronutrients (like vitamins, minerals)
        vitamins: data.full_nutrients.filter((nutrient) => nutrient.attr_id === 1162), // Vitamin C
        calcium: data.full_nutrients.filter((nutrient) => nutrient.attr_id === 301),  // Calcium
        iron: data.full_nutrients.filter((nutrient) => nutrient.attr_id === 303),   // Iron
      });
    } catch (err) {
      setError(`Failed to fetch nutrition data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding the analyzed meal to the log
  const handleLogMeal = () => {
    if (!nutritionData) return;

    const newMeal = {
      id: Date.now(), // Unique ID based on current timestamp
      foodItems,
      category: mealCategory,
      calories: nutritionData.nf_calories,
      protein: nutritionData.nf_protein,
      fat: nutritionData.nf_total_fat,
      carbs: nutritionData.nf_total_carbohydrate,
      portionSize, // Include portion size in the log
      dateLogged: new Date().toLocaleDateString(), // Store the current date
      // Adding micronutrients to the log
      vitamins: nutritionData.vitamins,
      calcium: nutritionData.calcium,
      iron: nutritionData.iron,
    };

    setMealLog([...mealLog, newMeal]);
    setFoodItems(''); // Reset food items input
    setPortionSize(100); // Reset portion size to default (100g)
    setNutritionData(null); // Reset nutrition data after logging
  };

  // Handle deleting a meal from the log
  const handleDeleteMeal = (mealId) => {
    setMealLog(mealLog.filter((meal) => meal.id !== mealId));
  };

  // Handle editing a meal in the log
  const handleEditMeal = (mealId) => {
    const mealToEdit = mealLog.find((meal) => meal.id === mealId);
    if (mealToEdit) {
      setFoodItems(mealToEdit.foodItems);
      setNutritionData({
        nf_calories: mealToEdit.calories,
        nf_protein: mealToEdit.protein,
        nf_total_fat: mealToEdit.fat,
        nf_total_carbohydrate: mealToEdit.carbs,
        vitamins: mealToEdit.vitamins,
        calcium: mealToEdit.calcium,
        iron: mealToEdit.iron,
      });
      setMealCategory(mealToEdit.category);
      setPortionSize(mealToEdit.portionSize); // Set portion size for editing
      handleDeleteMeal(mealId); // Delete old meal entry before updating
    }
  };

  return (
    <div className="meal-analyzer">
      <h1>Meal Analyzer</h1>

      {/* Food Items Input */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter food items (e.g., apple, banana, chicken)"
          value={foodItems}
          onChange={handleFoodItemsChange}
        />
        <input
          type="number"
          min="0.1"
          step="0.1"
          placeholder="Portion Size (in grams)"
          value={portionSize}
          onChange={handlePortionSizeChange}
        />
        <button type="submit" disabled={loading}>Analyze Meal</button>
      </form>

      {/* Meal Category Selection */}
      <select value={mealCategory} onChange={handleCategoryChange}>
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
        <option value="Snack">Snack</option>
        <option value="Dessert">Dessert</option>
      </select>

      {/* Nutrition Information */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {nutritionData && (
        <div className="nutrition-data">
          <h2>Nutrition Information</h2>
          <p><strong>Calories:</strong> {nutritionData.nf_calories} kcal</p>
          <p><strong>Protein:</strong> {nutritionData.nf_protein} g</p>
          <p><strong>Fat:</strong> {nutritionData.nf_total_fat} g</p>
          <p><strong>Carbs:</strong> {nutritionData.nf_total_carbohydrate} g</p>

          {/* Micronutrients */}
          <h3>Micronutrients</h3>
          {nutritionData.vitamins.length > 0 && (
            <p><strong>Vitamin C:</strong> {nutritionData.vitamins[0]?.value} mg</p>
          )}
          {nutritionData.calcium.length > 0 && (
            <p><strong>Calcium:</strong> {nutritionData.calcium[0]?.value} mg</p>
          )}
          {nutritionData.iron.length > 0 && (
            <p><strong>Iron:</strong> {nutritionData.iron[0]?.value} mg</p>
          )}

          <button onClick={handleLogMeal}>Log Meal</button>
        </div>
      )}

      {/* Meal Log */}
      <div className="meal-log">
        <h2>Meal Log</h2>
        {mealLog.length === 0 ? (
          <p>No meals logged yet.</p>
        ) : (
          <ul>
            {mealLog.map((meal) => (
              <li key={meal.id}>
                <p>{meal.foodItems} ({meal.category})</p>
                <p>Portion Size: {meal.portionSize}g</p>
                <p>Date: {meal.dateLogged}</p>
                <p>Calories: {meal.calories} kcal</p>
                <p>Iron: {meal.iron[0]?.value} mg</p>
                <button onClick={() => handleDeleteMeal(meal.id)}>Delete</button>
                <button onClick={() => handleEditMeal(meal.id)}>Edit</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MealAnalyzer;
