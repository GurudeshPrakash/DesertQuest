import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../style/DesertAuth.css";

const DesertAuth = () => {
  const navigate = useNavigate();
  const { isNightL, toggleTheme } = useTheme(); // for optional toggle button

  const handleLogin = () => {
    console.log("➡ Navigating to Login");
    navigate("/login");
  };

  const handleSignup = () => {
    console.log("➡ Navigating to Signup");
    navigate("/signup");
  };

  return (
    <div className={`auth-desert-containerL ${isNightL ? "nightL" : "day"}`}>
   

      {isNightL && <div className="moon"></div>}
      <div className="cloud cloud-1" ></div>
      <div className="cloud cloud-2" ></div>


 
      <div className="content-boxL">
        <h1 className="landing-titleL">Desert Quest</h1>

        <div className="button-boxL">
          <button className="desert-btnL" onClick={handleLogin}>
            LOGIN
          </button>
          <button className="desert-btnL" onClick={handleSignup}>
            SIGN UP
          </button>
        </div>

     
      
      </div>

     
    </div>
  );
};

export default DesertAuth;
