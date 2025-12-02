import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { auth, db } from "../firebase";
import "../style/auth.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(password);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long, include 1 uppercase letter & 1 special character."
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        highestScore: 0,
        score: { Level1: 0, Level2: 0, Level3: 0 },
        createdAt: new Date().toISOString(),
      });

      navigate("/login");
    } catch (err) {
      console.error("Signup Error:", err);
      setError("Error: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>

      <div className="auth-box">
        <h2 className="auth-title">Sign Up</h2>
        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            className="auth-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD + EYE */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="auth-input password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span className="password-toggle" onClick={togglePassword}>
              {showPassword ? "👁️" : "⌣"}
            </span>
          </div>

          <button type="submit" className="auth-button">
            Sign Up
          </button>
        </form>

        <p className="auth-toggle">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
