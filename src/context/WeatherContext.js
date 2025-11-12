import React, { createContext, useContext, useState, useEffect } from "react";

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherMood, setWeatherMood] = useState({
    icon: "☀️",
    description: "Sunny and calm",
    moodClass: "sunny",
  });

  // 🌦️ Fetch Weather Data (once)
  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await res.json();
        const current = data.current_weather;
        setWeather(current);
        updateWeatherMood(current);
      } catch (err) {
        console.error("Weather fetch failed:", err);
      } finally {
        setLoadingWeather(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => fetchWeather(23.4162, 25.6628) // fallback
      );
    } else {
      fetchWeather(23.4162, 25.6628);
    }
  }, []);

  // 🌡️ Update Mood
  const updateWeatherMood = (current) => {
    const temp = current.temperature;
    const wind = current.windspeed;

    if (temp > 35) {
      setWeatherMood({
        icon: "🔥",
        description: "Scorching desert heat!",
        moodClass: "hot",
      });
    } else if (temp < 20) {
      setWeatherMood({
        icon: "❄️",
        description: "Chilly winds sweep the dunes",
        moodClass: "cold",
      });
    } else if (wind > 20) {
      setWeatherMood({
        icon: "🌪️",
        description: "Windy sandstorm approaching!",
        moodClass: "windy",
      });
    } else {
      setWeatherMood({
        icon: "☀️",
        description: "Calm desert day",
        moodClass: "sunny",
      });
    }
  };

  return (
    <WeatherContext.Provider
      value={{
        weather,
        loadingWeather,
        weatherMood,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);
