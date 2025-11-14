import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./timer.css";

const CircularTimer = ({ timeLimit, onTimeEnd, isPaused = false }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const intervalRef = useRef(null);

  // 🔁 Reset timer when timeLimit changes
  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  // 🕒 Timer logic with pause support
  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;
        clearInterval(intervalRef.current);
        if (onTimeEnd) onTimeEnd();
        return 0;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isPaused, onTimeEnd]);

  const progress = (timeLeft / timeLimit) * circumference;

  return (
    <div className="timer-wrapper">
      <svg width="100" height="100" viewBox="0 0 100 100">
        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#eee"
          strokeWidth="8"
          fill="none"
        />

        {/* Progress Circle */}
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

      {/* Timer Text */}
      <p className="timer-text">{timeLeft}s</p>

      {/* Optional paused indicator */}
      {isPaused && <p className="paused-text"></p>}
    </div>
  );
};

export default CircularTimer;
