import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "./style/LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const { isNightL, toggleTheme } = useTheme();

  return (
    <div className={`desert-containerL ${isNightL ? "night" : "day"}`}>
      {/* Heat waves */}
      <div className="heat-wavesL"></div>

      {/* Sun and Moon */}
      <div className="sun"></div>
      <div className="moon"></div>
      

      {/* Clouds */}
      <div className="cloud cloud-1L"></div>
      <div className="cloud cloud-2L"></div>

  {/*  Wrap content */}
  <div className="content-boxL">
      <h1 className="landing-titleL">Welcome to Desert Quest</h1>

      {/* Buttons */}
      <div className="button-boxL">
        <button className="desert-btnL" onClick={() => navigate("/disclaimer")}>
          START
        </button>

        {/* Theme Toggle */}
        <button className="toggle-theme-btnL" onClick={toggleTheme}>
          {isNightL ? "☀️ Morning" : "🌙 Night"}
        </button>
      </div>
      </div>

      {/* Desert Dunes */}
      
      
    </div>
  );
}

export default LandingPage;
