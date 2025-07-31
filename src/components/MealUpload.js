import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const MealAnalyzer = () => {
  // States to handle image, OCR result, and nutritional info
  const [image, setImage] = useState(null);
  const [ocrResult, setOcrResult] = useState('');
  const [nutritionalInfo, setNutritionalInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle image upload
  const handleImageUpload = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  // Handle OCR analysis
  const handleAnalyzeMeal = async () => {
    if (!image) {
      setError('Please upload an image first.');
      return;
    }

    setLoading(true);
    setError('');
    setOcrResult('');

    try {
      // OCR Process using Tesseract.js
      const result = await Tesseract.recognize(image, 'eng', {
        logger: (m) => console.log(m),
      });

      const recognizedText = result.data.text;
      setOcrResult(recognizedText);

      if (!recognizedText.trim()) {
        setError('No ingredients detected. Please upload a clearer image.');
        setLoading(false);
        return;
      }

      // Fetch nutritional information
      await getNutritionalInfo(recognizedText);
    } catch (error) {
      setError('Error during OCR processing. Please try again.');
      setLoading(false);
    }
  };

  // Fetch nutritional information from Nutritionix API
  const getNutritionalInfo = async (ingredients) => {
    const apiKey = '0dc5923a5187ebfbbec4376879ce2155'; // Replace with your API key
    const appId = 'bbd2d85e'; // Replace with your App ID

    const formattedIngredients = ingredients.split(',').map(item => item.trim()).join(', ');

    try {
      const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
        method: 'POST',
        headers: {
          'x-app-id': appId,
          'x-app-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: formattedIngredients }),
      });

      const data = await response.json();
      console.log('Nutritionix API Response:', data);  // Log the API response for debugging

      if (data.foods && data.foods[0]) {
        setNutritionalInfo(data.foods[0]);
      } else {
        setError('Could not retrieve nutritional information. Please check the ingredients or try again.');
      }
    } catch (error) {
      setError('Error fetching nutritional information. Please try again later.');
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>Meal Analyzer - Upload Image</h1>
      <p>Upload an image of your meal, and we'll analyze the ingredients and nutritional information!</p>

      {/* Image Upload Input */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <br />

      {/* Analyze Meal Button */}
      <button onClick={handleAnalyzeMeal} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        Analyze Meal
      </button>

      {/* Loading and Error States */}
      {loading && <p>Analyzing image... Please wait.</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display OCR Result */}
      {ocrResult && !loading && (
        <div>
          <h3>OCR Result (Ingredients Extracted):</h3>
          <p>{ocrResult}</p>
        </div>
      )}

      {/* Display Nutritional Information */}
      {nutritionalInfo && (
        <div>
          <h3>Meal Analysis</h3>
          <p><strong>Ingredients:</strong> {nutritionalInfo.food_name}</p>
          <p><strong>Calories:</strong> {nutritionalInfo.nf_calories} kcal</p>
          <p><strong>Protein:</strong> {nutritionalInfo.nf_protein}g</p>
          <p><strong>Carbs:</strong> {nutritionalInfo.nf_total_carbohydrate}g</p>
          <p><strong>Fat:</strong> {nutritionalInfo.nf_total_fat}g</p>
          <p><strong>Serving Size:</strong> {nutritionalInfo.serving_size_qty} {nutritionalInfo.serving_size_unit}</p>
        </div>
      )}
    </div>
  );
};

export default MealAnalyzer;
