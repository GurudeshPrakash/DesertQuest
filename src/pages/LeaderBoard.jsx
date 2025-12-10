import React, { useEffect, useState } from "react";
import { FaChartLine, FaStar, FaCrown } from "react-icons/fa";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../style/LeaderBoard.css";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("Level1");

  const [loading, setLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const [page, setPage] = useState(0);
  const playersPerPage = 5; 
  const navigate = useNavigate();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserLoggedIn(true);
      else {
        setUserLoggedIn(false);
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

 
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

  if (!userLoggedIn) return <div className="leaderboard-loading">Redirecting...</div>;
  if (loading) return <div className="leaderboard-loading">Loading leaderboard...</div>;

 
  const startIndex = page * playersPerPage;
  const endIndex = startIndex + playersPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const totalPages = Math.ceil(users.length / playersPerPage);

  return (
    <div className="leaderboard-container">
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>

      <div className="leaderboard-box">
        <h1 className="leaderboard-title">
          <FaChartLine /> Global Leaderboard
        </h1>

        <select
          className="level-select"
          value={selectedLevel}
          onChange={(e) => {
            setSelectedLevel(e.target.value);
            setPage(0); 
          }}
        >
          <option value="Level1">🏆 Beginner</option>
          <option value="Level2">🥈 Medium</option>
          <option value="Level3">🥉 Hard</option>
        </select>

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
            {paginatedUsers.map((user, index) => (
              <tr key={user.id}>
                <td>
                  {startIndex + index === 0 ? (
                    <FaCrown color="gold" />
                  ) : (
                    startIndex + index + 1
                  )}
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <FaStar className="score-icon" /> {user[selectedLevel]} pts
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      
        <div className="pagination-buttons">
          <button
            className="page-btn"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            ⬅ Previous
          </button>

          <span className="page-number">
            Page {page + 1} of {totalPages}
          </span>

          <button
            className="page-btn"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next ➡
          </button>
        </div>

        <div className="button-group">
          <button className="back-btn" onClick={() => navigate("/level")}> Back</button>
          <button className="back-btn" onClick={() => navigate("/profile")}> View Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
