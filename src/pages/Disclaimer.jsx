import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "./style/Disclaimer.css";

function Disclaimer() {
  const navigate = useNavigate();
  const { isNightL } = useTheme(); // access global theme

  const handleAccept = () => navigate("/level");
  const handleDecline = () => {
    if (window.confirm("Are you sure you want to exit the game?")) {
      window.close();
      navigate("/");
    }
  };

  return (
    <div className={`desert-containerL ${isNightL ? "night" : "day"}`}>
      <div className="heat-wavesL"></div>
      
  
      

      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>

      <div className="disclaimer-boxL">
        <h1 className="disclaimer-titleL">DISCLAIMER</h1>
        <p className="disclaimer-textL">
          By continuing, you acknowledge that this is a fictional desert adventure
          experience. Proceed only if you’re ready to brave the heat and the dunes!
        </p>

        <div className="disclaimer-buttonsL">
          <button className="accept-btnL" onClick={handleAccept}>ACCEPT</button>
          <button className="decline-btnL" onClick={handleDecline}>DECLINE</button>
        </div>
      </div>

      
    </div>
  );
}
 export default Disclaimer;
