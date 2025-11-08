import React, { useEffect, useState } from "react";
import { FaChartLine, FaStar, FaCrown } from "react-icons/fa";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./style/LeaderBoard.css";

const Leaderboard = () => {
  const [userData, setUserData] = useState(null);
  const [scores, setScores] = useState({ Level1: 0, Level2: 0, Level3: 0 });
  const [selectedLevel, setSelectedLevel] = useState("Level1");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserScores = async () => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
          console.warn("No user logged in");
          setLoading(false);
          return;
        }

        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            console.log("✅ User data from Firestore:", data);

            // 🔹 Handle your structure (score.Level3, etc.)
            const scoreData = data.score || {};
            const formattedScores = {
              Level1: scoreData.Level1 || 0,
              Level2: scoreData.Level2 || 0,
              Level3: scoreData.Level3 || 0,
            };

            setUserData({
              name: data.name || "Unknown Player",
              email: data.email || "No email",
            });

            setScores(formattedScores);
          } else {
            console.warn("⚠️ No document found for this user!");
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        } finally {
          setLoading(false);
        }
      });

      return () => unsubscribe();
    };

    fetchUserScores();
  }, []);

  if (loading) return <div className="leaderboard-loading">Loading your stats...</div>;

  if (!userData)
    return (
      <div className="leaderboard-loading">
        Please log in to view your leaderboard.
      </div>
    );

  const currentScore = scores[selectedLevel] || 0;

  return (
    <div className="leaderboard-container">
      {/* ☁️ Clouds */}
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>

      <div className="leaderboard-box">
        <h1 className="leaderboard-title">
          <FaChartLine /> Your Leaderboard
        </h1>

        <div className="player-info">
          <p className="player-name">
            <FaCrown className="icon" /> {userData.name}
          </p>
          <p className="player-email">{userData.email}</p>
        </div>

        {/* Level Selector */}
        <select
          className="level-select"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          <option value="Level1">🏆 Beginner</option>
          <option value="Level2">🥈 Intermediate</option>
          <option value="Level3">🥉 Advanced</option>
        </select>

        {/* Score Display */}
        <div className="score-display">
          <FaStar className="score-icon" />
          <h2>{selectedLevel}</h2>
          <p className="score-value">{currentScore} pts</p>
        </div>

        <button className="back-btn" onClick={() => window.history.back()}>
          ⬅ Back
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
