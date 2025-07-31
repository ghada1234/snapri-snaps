// src/components/Profile.js

import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  // Profile state
  const [name, setName] = useState('John Doe');
  const [nationality, setNationality] = useState('American');
  const [weight, setWeight] = useState(70); // kg
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(175); // cm
  const [avatar, setAvatar] = useState(null);
  const [dietaryPreference, setDietaryPreference] = useState('Balanced');
  const [likes, setLikes] = useState('Chicken, Rice, Fruits');
  const [dislikes, setDislikes] = useState('Broccoli');
  const [allergens, setAllergens] = useState('Peanuts');
  
  // BMI Calculation
  const calculateBMI = (weight, height) => {
    return (weight / Math.pow(height / 100, 2)).toFixed(1); // BMI formula
  };

  const bmi = calculateBMI(weight, height);

  // Macronutrient Goal (simple calculation based on activity level)
  const [macros, setMacros] = useState({
    protein: 2.2 * weight, // grams per kg body weight
    fat: 1 * weight, // grams per kg body weight
    carbs: 4 * weight, // adjusted for weight maintenance
  });

  // Calculate Total Calories
  const calculateTotalCalories = (macros) => {
    const caloriesFromProtein = macros.protein * 4;
    const caloriesFromFat = macros.fat * 9;
    const caloriesFromCarbs = macros.carbs * 4;
    return caloriesFromProtein + caloriesFromFat + caloriesFromCarbs;
  };

  const totalCalories = calculateTotalCalories(macros);

  // Estimate Micronutrient intake based on user preferences (simple estimations)
  const estimateMicronutrients = (likes, dietaryPreference) => {
    let micronutrients = {
      vitaminA: 800,  // IU (Average daily requirement for Vitamin A)
      vitaminC: 90,   // mg (Average daily requirement for Vitamin C)
      iron: 18,       // mg (Average daily requirement for Iron)
      calcium: 1000,  // mg (Average daily requirement for Calcium)
    };

    if (likes.includes('Fruits')) {
      micronutrients.vitaminC += 50; // Adding extra Vitamin C for fruits
    }

    if (likes.includes('Leafy Greens')) {
      micronutrients.vitaminA += 200; // Adding Vitamin A from leafy greens
      micronutrients.iron += 5; // Adding Iron from greens
    }

    if (dietaryPreference === 'Vegan') {
      micronutrients.iron += 10; // More Iron for a Vegan diet
      micronutrients.calcium -= 200; // Lower Calcium if no dairy
    }

    return micronutrients;
  };

  const micronutrients = estimateMicronutrients(likes, dietaryPreference);

  // Handle avatar change
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file)); // Set image preview
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile Updated!');
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="avatar-container">
          <label htmlFor="avatar-upload">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="avatar" />
            ) : (
              <div className="avatar-placeholder">Upload Avatar</div>
            )}
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className="input-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="input-group">
          <label>Nationality:</label>
          <input
            type="text"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            placeholder="Enter your nationality"
          />
        </div>

        <div className="input-group">
          <label>Age:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
          />
        </div>

        <div className="input-group">
          <label>Weight (kg):</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter your weight"
            required
          />
        </div>

        <div className="input-group">
          <label>Height (cm):</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter your height"
            required
          />
        </div>

        <div className="input-group">
          <label>BMI:</label>
          <input type="text" value={bmi} disabled />
        </div>

        <div className="input-group">
          <label>Total Calories:</label>
          <input type="text" value={`${totalCalories} kcal`} disabled />
        </div>

        <div className="input-group">
          <label>Dietary Preference:</label>
          <input
            type="text"
            value={dietaryPreference}
            onChange={(e) => setDietaryPreference(e.target.value)}
            placeholder="e.g., Balanced, Keto, Vegan"
          />
        </div>

        <div className="input-group">
          <label>Likes:</label>
          <input
            type="text"
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            placeholder="e.g., Chicken, Rice"
          />
        </div>

        <div className="input-group">
          <label>Dislikes:</label>
          <input
            type="text"
            value={dislikes}
            onChange={(e) => setDislikes(e.target.value)}
            placeholder="e.g., Broccoli"
          />
        </div>

        <div className="input-group">
          <label>Allergens:</label>
          <input
            type="text"
            value={allergens}
            onChange={(e) => setAllergens(e.target.value)}
            placeholder="e.g., Peanuts"
          />
        </div>

        <h3>Macronutrient Goals:</h3>
        <div className="input-group">
          <label>Protein:</label>
          <input type="text" value={`${macros.protein}g`} disabled />
        </div>

        <div className="input-group">
          <label>Fat:</label>
          <input type="text" value={`${macros.fat}g`} disabled />
        </div>

        <div className="input-group">
          <label>Carbs:</label>
          <input type="text" value={`${macros.carbs}g`} disabled />
        </div>

        <h3>Micronutrient Estimates:</h3>
        <div className="input-group">
          <label>Vitamin A:</label>
          <input type="text" value={`${micronutrients.vitaminA} IU`} disabled />
        </div>

        <div className="input-group">
          <label>Vitamin C:</label>
          <input type="text" value={`${micronutrients.vitaminC} mg`} disabled />
        </div>

        <div className="input-group">
          <label>Iron:</label>
          <input type="text" value={`${micronutrients.iron} mg`} disabled />
        </div>

        <div className="input-group">
          <label>Calcium:</label>
          <input type="text" value={`${micronutrients.calcium} mg`} disabled />
        </div>

        <button type="submit" className="submit-btn">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
