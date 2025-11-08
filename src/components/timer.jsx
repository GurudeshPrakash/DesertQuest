import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./style/timer.css"; // merged styles

const CircularTimer = ({ timeLimit, onTimeEnd }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) return prev - 1;
        clearInterval(timer);
        if (onTimeEnd) onTimeEnd();
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeEnd]);

  const progress = (timeLeft / timeLimit) * circumference;

  return (
    <div className="timer-wrapper">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#eee"
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#ff6b35"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </svg>
      <p className="timer-text">{timeLeft}s</p>
    </div>
  );
};

export default CircularTimer;
