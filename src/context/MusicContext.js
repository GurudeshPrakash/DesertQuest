import React, { createContext, useContext, useRef, useState, useEffect } from "react";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const audioRef = useRef(new Audio("cowboys2.mp3")); 
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.5;

    
    const startMusic = () => {
      if (isPlaying) {
        audio.play().catch((err) => console.log("Autoplay blocked:", err));
      }
      document.removeEventListener("click", startMusic);
    };

    document.addEventListener("click", startMusic);

    return () => {
      audio.pause();
      document.removeEventListener("click", startMusic);
    };
  }, [isPlaying]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
