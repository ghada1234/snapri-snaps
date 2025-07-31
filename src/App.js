// frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import Profile from './components/Profile'; 
import MealAnalyzer from './components/MealAnalyzer'; 
import MealUpload from './components/MealUpload'
function App() {
 

  return (
    <div className="App">
      <Profile></Profile><MealAnalyzer></MealAnalyzer>
     <MealUpload></MealUpload>
     
    </div>
  );
}

export default App;
