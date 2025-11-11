import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { auth, db } from "../firebase";
import "./style/auth.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const validateEmail=(email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword=(password) => {
    const regex=/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long, contain at least one uppercase letter and one special character.");
      return;
    }

    try {
      // ✅ Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Update display name
      await updateProfile(user, { displayName: name });

      // ✅ Store user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        highestScore: 0,
        createdAt: new Date().toISOString(),
      });

      // ✅ Save token and redirect
      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      navigate("login");
    } catch (err) {
      console.error("Signup Error:", err);
      setError("Error: " + err.message);
    }
  };



  return (
    <div className="auth-container">
      {/* ☁️ Clouds */}
      <div className="cloud"></div>
      <div className="cloud"></div>
      <div className="cloud"></div>

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
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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
