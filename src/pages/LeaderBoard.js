import React, { useEffect, useState } from "react";
import { FaChartLine, FaStar, FaCrown } from "react-icons/fa";
import { db, auth } from "../firebase"; // ✅ import auth
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // ✅ import this
import { useNavigate } from "react-router-dom"; // ✅ for redirect
import "./style/LeaderBoard.css";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("Level1");
  const [loading, setLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const navigate = useNavigate();

  // ✅ Check login status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoggedIn(true);
      } else {
        setUserLoggedIn(false);
        navigate("/login"); // redirect to login page
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // ✅ Fetch scores (only if logged in)
  useEffect(() => {
    if (!userLoggedIn) return;

    const fetchAllScores = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const scoreData = data.score || {};
          userList.push({
            id: doc.id,
            name: data.name || "Unknown Player",
            email: data.email || "No email",
            Level1: scoreData.Level1 || 0,
            Level2: scoreData.Level2 || 0,
            Level3: scoreData.Level3 || 0,
          });
        });

        userList.sort((a, b) => b[selectedLevel] - a[selectedLevel]);
        setUsers(userList);
      } catch (err) {
        console.error("Error fetching all users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllScores();
  }, [selectedLevel, userLoggedIn]);

  if (!userLoggedIn) {
    return <div className="leaderboard-loading">Redirecting to login...</div>;
  }

  if (loading) {
    return <div className="leaderboard-loading">Loading leaderboard...</div>;
  }

  return (
    <div className="leaderboard-container">
      {/* ☁️ Clouds */}
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>

      <div className="leaderboard-box">
        <h1 className="leaderboard-title">
          <FaChartLine /> Global Leaderboard
        </h1>

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

        {/* 🏅 Leaderboard Table */}
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Email</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {users
              .sort((a, b) => b[selectedLevel] - a[selectedLevel])
              .map((user, index) => (
                <tr key={user.id}>
                  <td>{index === 0 ? <FaCrown color="gold" /> : index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <FaStar className="score-icon" /> {user[selectedLevel]} pts
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <button className="back-btn" onClick={() => window.history.back()}>
          ⬅ Back
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
