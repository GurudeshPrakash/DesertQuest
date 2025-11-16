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

  
  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
          console.error("Invalid coordinates:", lat, lon);
          return;
        }

    
        const url = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;

        console.log("Fetching weather from:", url);

        const res = await fetch(url);
        const data = await res.json();

        
        const now = new Date();
        const currentHour = now.toISOString().slice(0, 13) + ":00";
        const hourIndex = data.hourly?.time?.indexOf(currentHour);
        const currentTemp =
          hourIndex !== -1 && hourIndex !== undefined
            ? data.hourly.temperature_2m[hourIndex]
            : null;

        if (currentTemp !== null) {
          const current = { temperature: currentTemp, windspeed: 10 }; 
          setWeather(current);
          updateWeatherMood(current);
        } else {
          console.warn("No temperature data found for current hour:", data);
        }
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
        () => fetchWeather(52.52, 13.41)
      );
    } else {
      fetchWeather(52.52, 13.41);
    }
  }, []);

  
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
