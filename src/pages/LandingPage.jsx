import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useWeather } from "../context/WeatherContext";
import "../style/LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const { isNightL, toggleTheme } = useTheme();
  const { weather, loadingWeather, weatherMood } = useWeather();

  // 🆕 GUESS button handler (navigate to /guess or open popup later)
  const handleGuessClick = () => {
    navigate("/disclaimer"); // 👈 change path if needed
  };

  return (
    <div
      className={`desert-containerL ${isNightL ? "night" : "day"} ${
        weatherMood.moodClass
      }`}
    >
      {/* Heat waves */}
      <div className="heat-wavesL"></div>



      {/* Clouds */}
      <div className="cloud cloud-1L"></div>
      <div className="cloud cloud-2L"></div>

      <div className="content-boxL">
        <h1 className="landing-titleL">Welcome to Desert Quest</h1>

        {/* Weather Info */}
        <div className="weather-boxL">
          {loadingWeather ? (
            <p>☁️ Checking desert skies...</p>
          ) : weather ? (
            <>
              <p className="weather-icon">{weatherMood.icon}</p>
              <p>
                {weatherMood.description}
                <br />
                🌡️ {weather.temperature}°C | 💨 {weather.windspeed} km/h
              </p>
            </>
          ) : (
            <p>⚠️ Weather data not available</p>
          )}
        </div>

        {/* Buttons */}
        <div className="button-boxL">
          <button
            className="desert-btnL"
            onClick={() => navigate("/login")}
          >
            START
          </button>

          {/* 🆕 New GUESS button */}
          <button className="guess-btnL" onClick={handleGuessClick}>
            GUEST
          </button>

         
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
