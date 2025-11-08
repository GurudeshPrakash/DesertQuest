import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "./style/DesertAuth.css";

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
   
      <div className="auth-heat-waves" ></div>
      <div className="auth-sun" ></div>
      {isNightL && <div className="moon"></div>}
      <div className="auth-cloud auth-cloud-1" ></div>
      <div className="auth-cloud auth-cloud-2" ></div>


 
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

     
        <button className="toggle-theme-btnL" onClick={toggleTheme}>
          {isNightL ? "☀️ Day Mode" : "🌙 Night Mode"}
        </button>
      </div>

     
    </div>
  );
};

export default DesertAuth;
