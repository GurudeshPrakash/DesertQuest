import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./message.css"; // Add styles for better UI

const Message = ({ message, score }) => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate(); // Use the hook inside the component

  const handleClose = () => {
    setVisible(false);
    document.body.classList.remove("overlay-active"); // Remove overlay effect
    navigate("/level"); // Correct way to navigate
  };

  if (!visible) return null;

  return (
    <div className="overlay">
      <div className="message-container">
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        <p className="message-text">{message}</p>
        {score !== null && <p className="score-text">Your Final Score: {score}</p>}
      </div>
    </div>
  );
};

export default Message;
