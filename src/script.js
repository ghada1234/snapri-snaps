const captureButton = document.getElementById('capture-btn');
const videoElement = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const nutritionInfoDiv = document.getElementById('nutrition-info');

// Access the camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        videoElement.srcObject = stream;
    })
    .catch((error) => {
        console.error('Error accessing camera:', error);
    });

// Capture image from the camera when the user clicks the button
captureButton.addEventListener('click', () => {
    // Draw the current video frame on the canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Convert the canvas to an image URL
    const imageDataUrl = canvas.toDataURL('image/jpeg');

    // Call your image recognition API (Nutritionix, Clarifai, Google Vision API, etc.)
    analyzeImage(imageDataUrl);
});

// Analyze the captured image
async function analyzeImage(imageDataUrl) {
    // API setup (replace with your own API keys and URL)
    const apiUrl = 'YOUR_IMAGE_RECOGNITION_API_URL';  // Replace with actual URL for food image recognition
    const appId = 'YOUR_APP_ID';  // Your Nutritionix App ID or equivalent
    const appKey = 'YOUR_APP_KEY';  // Your Nutritionix App Key or equivalent

    const requestData = {
        image: imageDataUrl, // The image data URL from the camera
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'x-app-id': appId,
                'x-app-key': appKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        const data = await response.json();
        displayNutritionInfo(data);  // Display the nutritional data on the page
    } catch (error) {
        console.error('Error analyzing image:', error);
        alert('Error analyzing image. Please try again.');
    }
}

// Display the nutrition information
function displayNutritionInfo(data) {
    nutritionInfoDiv.innerHTML = '';

    if (data.foods && data.foods.length > 0) {
        const food = data.foods[0];

        const nutritionList = `
            <h2>Nutrition Information for ${food.food_name}</h2>
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
        nutritionInfoDiv.innerHTML = `<p>No data found for the recognized food. Please try again with a clearer image.</p>`;
        nutritionInfoDiv.style.display = 'block';
    }
}
