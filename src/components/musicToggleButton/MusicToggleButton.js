import React from "react";
import { useMusic } from "../../context/MusicContext";
import "./MusicToggleButton.css";

function MusicToggleButton() {
  const { isPlaying, toggleMusic } = useMusic();

  return (
    <button className="music-toggle" onClick={toggleMusic}>
      {isPlaying ? "🔊" : "🔇"}
    </button>
  );
}

export default MusicToggleButton;
