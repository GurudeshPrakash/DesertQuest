import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../style/Levels.css";

function Levels() {
  const navigate = useNavigate();
  const [level, setLevel] = useState(null);
  const { isNightL } = useTheme();

  const handleLevelSelect = (selectedLevel) => {
    setLevel(selectedLevel);
    navigate(`/game?level=${selectedLevel}`);
  };

  return (
    <div className={`levels-page desert-containerL ${isNightL ? "night" : "day"}`}>
      {/* Effects */}
      <div className="heat-waves"></div>
      
      <div className="moon"></div>
    
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>

      {/* Titles */}
      <h1 className="title">HAVE NICE DAY</h1>
      <p className="subtitle">LET’S BEGIN</p>

      {/* Level Buttons */}
      <div className="button-box1">
        <button className="desert-btn" onClick={() => handleLevelSelect("easy")}>
          EASY
        </button>
        <button className="desert-btn" onClick={() => handleLevelSelect("medium")}>
          MEDIUM
        </button>
        <button className="desert-btn" onClick={() => handleLevelSelect("hard")}>
          HARD
        </button>
      </div>

      {/* Desert Landscape */}
    

      
    </div>
  );
}

export default Levels;
