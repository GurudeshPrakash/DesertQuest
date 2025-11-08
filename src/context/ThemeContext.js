import React, { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isNightL, setIsNightL] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "nightL";
  });

  // Update body class & localStorage when theme changes
  useEffect(() => {
    document.body.classList.toggle("nightL", isNightL);
    document.body.classList.toggle("day", !isNightL);
    localStorage.setItem("theme", isNightL ? "nightL" : "day");
  }, [isNightL]);

  const toggleTheme = () => setIsNightL((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isNightL, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
