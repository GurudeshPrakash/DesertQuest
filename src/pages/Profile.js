import React, { useState, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt, FaChartLine, FaStar } from "react-icons/fa";
import "./style/Profile.css";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "@firebase/firestore";
import { auth, db } from "../firebase";

const Profile = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({ Level1: 0, Level2: 0, Level3: 0 });


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);

        const unsubscribeSnapshot = onSnapshot(userRef, async (userSnap) => {
          if (userSnap.exists()) {
            const data = userSnap.data();
            setPlayer({
              name: data.name || "No Name",
              email: data.email || user.email,
              highestScore: data.highestScore || 0,
            });
            setScores(data.score || { Level1: 0, Level2: 0, Level3: 0 });
          } else {
            const defaultData = {
              name: user.displayName || "New Player",
              email: user.email,
              highestScore: 0,
              score: { Level1: 0, Level2: 0, Level3: 0 },
              createdAt: new Date().toISOString(),
            };
            await setDoc(userRef, defaultData);
            setPlayer(defaultData);
          }
          setLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        setPlayer(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      navigate("/desertAuth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

 
  const handleDesertClick = () => navigate("/level");

  if (loading) {
    return <p className="loading-message">Loading profile...</p>;
  }

  if (!player) {
    return (
      <div className="profile-container">
        <div className="sun" />
        <div className="profile-box">
          <div className="profile-header">
            <FaUserCircle className="profile-icon" />
            <h2>Not Logged In</h2>
            <p>Please log in to view your profile.</p>
          </div>
          <div className="button-group">
            <button className="logout-button" onClick={() => navigate("/desertAuth")}>
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
   
      <div className="sun"></div>

   
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>


    
      <div className="profile-content">
        <div className="profile-box">
       
          <div className="profile-header">
            <FaUserCircle className="profile-icon" />
            <h2>{player.name}</h2>
            <p>{player.email}</p>
          </div>

          <div className="profile-stats">
            <h3>🏆 Highest Score: {player.highestScore}</h3>
          </div>

          <div className="profile-scores">
            <h3>
              <FaChartLine /> Your Scores
            </h3>
            <div className="score-cards">
              <div className="score-card">
                <p>Level 1</p>
                <FaStar className="score-icon" />
                <span>{scores.Level1 || 0}</span>
              </div>
              <div className="score-card">
                <p>Level 2</p>
                <FaStar className="score-icon" />
                <span>{scores.Level2 || 0}</span>
              </div>
              <div className="score-card">
                <p>Level 3</p>
                <FaStar className="score-icon" />
                <span>{scores.Level3 || 0}</span>
              </div>
            </div>
          </div>

        
          <div className="button-group">
            <button className="desert-button" onClick={handleDesertClick}>
               Back to Desert Adventure
            </button>
            <button className="logout-button" onClick={handleLogout}>
              <FaSignOutAlt className="logout-icon" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
