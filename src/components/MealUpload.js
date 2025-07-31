 import React, { useState } from 'react';
 import axios from 'axios';
 import './MealUpload.css';
 
 const MealUpload = () => {
 // Nutritionix API details
        const appId = 'bbd2d85e';  // Replace with your Nutritionix App ID
        const appKey = '0dc5923a5187ebfbbec4376879ce2155'; // Replace with your Nutritionix App Key

        // Accessing camera and setting up video stream
        const videoElement = document.getElementById('camera');
        const canvas = document.getElementById('canvas');
        const captureButton = document.getElementById('capture-btn');
        const nutritionInfoDiv = document.getElementById('nutrition-info');
        
        // Get user media (camera)
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoElement.srcObject = stream;
            })
            .catch(error => {
                console.error('Error accessing the camera:', error);
            });

        // Function to capture image from camera
        captureButton.addEventListener('click', () => {
            const context = canvas.getContext('2d');
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const imageDataUrl = canvas.toDataURL('image/png');
            analyzeImage(imageDataUrl);  // Analyze the captured image
        });

        // Function to analyze the food image using Nutritionix API
        async function analyzeImage(imageDataUrl) {
            try {
                // You can replace 'apple' with the detected food item
                const foodDescription = 'apple';  // Placeholder for food detection
                const response = await fetch(`https://api.nutritionix.com/v1_1/search/${encodeURIComponent(foodDescription)}?appId=${appId}&appKey=${appKey}`, {
                    method: 'GET',
                    headers: {
                        'x-app-id': appId,
                        'x-app-key': appKey,
                    }
                });

                const data = await response.json();
                displayNutritionInfo(data);
            } catch (error) {
                console.error('Error analyzing image:', error);
                alert('Error analyzing the image. Please try again.');
            }
        }

        // Function to display nutrition info
        function displayNutritionInfo(data) {
            nutritionInfoDiv.innerHTML = '';
            if (data.hits && data.hits.length > 0) {
                const food = data.hits[0].fields;  // Get first result

                const nutritionList = `
                    <h2>Nutrition Information for ${food.item_name}</h2>
                    <ul>
                        <li><strong>Calories:</strong> ${food.nf_calories} kcal</li>
                        <li><strong>Protein:</strong> ${food.nf_protein} g</li>
                        <li><strong>Carbohydrates:</strong> ${food.nf_total_carbohydrate} g</li>
                        <li><strong>Fat:</strong> ${food.nf_total_fat} g</li>
                        <li><strong>Fiber:</strong> ${food.nf_dietary_fiber} g</li>
                        <li><strong>Sugars:</strong> ${food.nf_sugars} g</li>
                    </ul>
                `;
                nutritionInfoDiv.innerHTML = nutritionList;
                nutritionInfoDiv.style.display = 'block';
            } else {
                nutritionInfoDiv.innerHTML = `<p>No data found for the recognized food. Please try again with a clearer image or food name.</p>`;
                nutritionInfoDiv.style.display = 'block';
            }
        }

      }
      export default MealUpload;