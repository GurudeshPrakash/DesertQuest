import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, provider } from "../firebase";
import "../style/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("authToken", token);
      navigate("/disclaimer");
    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid email or password");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "New Player",
          email: user.email,
          highestScore: 0,
          score: { Level1: 0, Level2: 0, Level3: 0 },
          createdAt: new Date().toISOString(),
        });
      }

      navigate("/disclaimer");
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>

      <div className="auth-box">
        <h2 className="auth-title">Login</h2>
        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleLogin}>
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
            Login
          </button>
        </form>

        <button className="google-btn" onClick={handleGoogleLogin}>
          Sign in with Google
        </button>

        <p className="auth-toggle">
          Don't have an account?{" "}
          <Link to="/signup" className="auth-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
