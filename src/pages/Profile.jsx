import React, { useState, useEffect } from "react";
import { FaSignOutAlt, FaChartLine, FaStar, FaRedo } from "react-icons/fa";
import "../style/Profile.css";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "@firebase/firestore";
import { auth, db } from "../firebase";
import { useWeather } from "../context/WeatherContext"; 

const Profile = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({ Level1: 0, Level2: 0, Level3: 0 });
  const [changingAvatar, setChangingAvatar] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);

        const unsubscribeSnapshot = onSnapshot(userRef, async (userSnap) => {
          if (userSnap.exists()) {
            const data = userSnap.data();
            const scoreData = data.score || { Level1: 0, Level2: 0, Level3: 0 };

            const totalScore =
              (scoreData.Level1 || 0) +
              (scoreData.Level2 || 0) +
              (scoreData.Level3 || 0);

            setPlayer({
              name: data.name || "No Name",
              email: data.email || user.email,
              highestScore: totalScore, 
              avatarSeed: data.avatarSeed,
            });

            setScores(scoreData);
          } else {
            const randomSeed = `${user.displayName || "Player"}-${Math.floor(
              Math.random() * 10000
            )}`;
            const defaultData = {
              name: user.displayName || "New Player",
              email: user.email,
              highestScore: 0,
              score: { Level1: 0, Level2: 0, Level3: 0 },
              avatarSeed: randomSeed,
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


  const handleChangeAvatar = async () => {
    if (!player) return;
    setChangingAvatar(true);
    try {
      const newSeed = `${player.name}-${Math.floor(Math.random() * 100000)}`;
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { avatarSeed: newSeed });
      setPlayer((prev) => ({ ...prev, avatarSeed: newSeed }));
    } catch (error) {
      console.error("Failed to change avatar:", error);
    } finally {
      setChangingAvatar(false);
    }
  };

  if (loading) return <p className="loading-message">Loading profile...</p>;

  if (!player) {
    return (
      <div className="profile-container">
  
        <div className="profile-box">
          <div className="profile-header">
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


  const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(
    player.avatarSeed || player.name || "Explorer"
  )}`;

  return (
    <div className="profile-container">
 
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>

      <div className="profile-content">
        <div className="profile-box">
          <div className="profile-header">
         
            <img src={avatarUrl} alt="Avatar" className="player-avatar" />

            <h2>{player.name}</h2>
            <p>{player.email}</p>

            <button
              className="avatar-change-btn"
              onClick={handleChangeAvatar}
              disabled={changingAvatar}
            >
              <FaRedo className="avatar-icon" />
              {changingAvatar ? "Changing..." : "Change Avatar"}
            </button>
          </div>

        
          <div className="profile-stats">
            <h3> Total Score: {player.highestScore}</h3>
          </div>

          <div className="profile-scores">
            <h3>
              <FaChartLine /> Your Scores
            </h3>
            <div className="score-cards">
              <div className="score-card">
                <p>Easy</p>
                <FaStar className="score-icon" />
                <span>{scores.Level1 || 0}</span>
              </div>
              <div className="score-card">
                <p>Medium</p>
                <FaStar className="score-icon" />
                <span>{scores.Level2 || 0}</span>
              </div>
              <div className="score-card">
                <p>Hard</p>
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
