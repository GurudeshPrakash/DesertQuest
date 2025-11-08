import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchQuizData } from "../Api/Heart";
import CircularTimer from "../components/timer";
import Message from "../components/message";
import { useTheme } from "../context/ThemeContext";
import "./style/Game.css";
import { updateUserScore } from "../Api/Score";


const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const levelParam = queryParams.get("level") || "easy";


  const levelMap = {
    easy: 1,
    medium: 2,
    hard: 3,
  };

  const level = levelMap[levelParam];

  const { isNightL } = useTheme();

  // 🕒 Timer duration by level
  const getTimeLimit = (level) => {
    switch (level) {
      case 1:
        return 60;
      case 2:
        return 45;
      case 3:
        return 20;
      default:
        return 0;
    }
  };

  // 💀 Penalty
  const getPenalty = (level) => {
    switch (level) {
      case 1:
        return -10;
      case 2:
        return -10;
      case 3:
        return -10;
      default:
        return -10;
    }
  };

  // 🎯 Pre-score (starting score)
  const getPreScore = (level) => {
    switch (level) {
      case 1:
        return 30;
      case 2:
        return 20;
      case 3:
        return 10;
      default:
        return 0;
    }
  };

  const timeLimit = getTimeLimit(level);
  const penalty = getPenalty(level);

  const [quizImage, setQuizImage] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(getPreScore(level)); // ✅ Start with pre-score
  const [questionCount, setQuestionCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  // Generate 4 answer options
  const generateAnswerOptions = (correct) => {
    const options = new Set([correct]);
    while (options.size < 4) {
      const random = Math.floor(Math.random() * 10);
      if (random !== correct) options.add(random);
    }
    return [...options].sort(() => Math.random() - 0.5);
  };

  // Load quiz data
  const loadQuiz = async () => {
    if (questionCount >= 10 || score <= 0) return;
    const quizData = await fetchQuizData();
    if (quizData) {
      const correct = Number(quizData.solution);
      const options = generateAnswerOptions(correct);
      setQuizImage(quizData.question);
      setCorrectAnswer(correct);
      setAnswers(options);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, []);

  
  const handleAnswerClick = (answer) => {
    if (gameOver) return;

    if (answer === correctAnswer) {
      setScore((prev) => prev + 10);
    } else {
      setScore((prev) => {
        const newScore = prev + penalty;
        if (newScore <= 0) {
          handleGameOver(0);
        }
        return newScore;
      });
    }

    setQuestionCount((prev) => prev + 1);

    setTimeout(() => {
      if (!gameOver && score > 0) loadQuiz();
    }, 800);
  };

  
  const handleGameOver = async (finalScore = score) => {
    setGameOver(true);
    setResultMessage("Game Over!");
    await updateUserScore(finalScore, level);

  
    setTimeout(() => {
      navigate("/leaderboard");
    }, 3000);
  };

  const handleTimeEnd = () => handleGameOver();

  return (
    <div className={`game-desert-containerL ${isNightL ? "night" : "day"}`}>
      {}
      <div className="heat-waves"></div>
      <div className="sun"></div>
      <div className="moon"></div>
    
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>

      {gameOver ? (
        <Message message={resultMessage} score={score} />
      ) : (
        <div className="game-contentL">
          <div className="headerL">
            <CircularTimer timeLimit={timeLimit} onTimeEnd={handleTimeEnd} />
            <div className="score-boxL">Score: {score}</div>
          </div>

          {quizImage && (
            <div className="quiz-sectionL">
              <img src={quizImage} alt="Quiz" className="quiz-imageL" />
              <div className="answers-gridL">
                {answers.map((ans, i) => (
                  <button
                    key={i}
                    className="desert-answer-btnL"
                    onClick={() => handleAnswerClick(ans)}
                  >
                    {ans}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {}
      
      <div className="cactus-group">
        <div className="cactus-1"></div>
        <div className="cactus-2"></div>
      </div>
    </div>
  );
};

export default Game;
