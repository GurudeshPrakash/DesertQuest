import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "./style/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("authToken", token);
      navigate("/level");
    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid email or password");
    }
  };

  const playAsGuest = () => navigate("/profile");

  return (
    <div className="auth-container">
      {/* ☁️ Clouds */}
      <div className="cloud"></div>
      <div className="cloud"></div>
      <div className="cloud"></div>

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
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>

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
