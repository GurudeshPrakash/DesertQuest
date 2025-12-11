import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchQuizData } from "../Services/Heart";
import CircularTimer from "../components/timer/timer";
import Message from "../components/message/message";
import { useWeather } from "../context/WeatherContext"; 
import { useTheme } from "../context/ThemeContext"; 
import "../style/Game.css";
import { updateUserScore } from "../Services/Score";

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
  const { weatherMood } = useWeather();

  const getTimeLimit = (level) => {
    switch (level) {
      case 1: return 60;
      case 2: return 45;
      case 3: return 30;
      default: return 0;
    }
  };

  const getPenalty = (level) => {
    switch (level) {
      case 1: return -10;
      case 2: return -10;
      case 3: return -10;
      default: return -10;
    }
  };

  const getPreScore = (level) => {
    switch (level) {
      case 1: return 30;
      case 2: return 20;
      case 3: return 10;
      default: return 0;
    }
  };

  const timeLimit = getTimeLimit(level);
  const penalty = getPenalty(level);

  const [quizImage, setQuizImage] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(getPreScore(level));
  const [questionCount, setQuestionCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const generateAnswerOptions = (correct) => {
    const options = new Set([correct]);
    while (options.size < 4) {
      const random = Math.floor(Math.random() * 10);
      if (random !== correct) options.add(random);
    }
    return [...options].sort(() => Math.random() - 0.5);
  };

  const loadQuiz = async () => {
    if (questionCount >= 30 || score <= 0) return;
    const quizData = await fetchQuizData();
    if (quizData) {
      const correct = Number(quizData.solution);
      const options = generateAnswerOptions(correct);
      setIsImageLoaded(false);
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
    <div
      className={`game-desert-containerL ${isNightL ? "night" : "day"} ${
        weatherMood.moodClass
      }`}
    >

    
      <div className="heart-info-text">
        Count the number of hearts ❤️
      </div>

    
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>

      {gameOver ? (
        <Message message={resultMessage} score={score} />
      ) : (
        <div className="game-contentL">
          <div className="headerL">
            <CircularTimer
              timeLimit={timeLimit}
              onTimeEnd={handleTimeEnd}
              isPaused={!isImageLoaded}
            />
            <div className="score-boxL">Score: {score}</div>
          </div>

          {quizImage && (
            <div className="quiz-sectionL">
              <img
                src={quizImage}
                alt="Quiz"
                className="quiz-imageL"
                onLoad={() => setIsImageLoaded(true)}
                onError={() => {
                  console.error(" Image failed to load");
                  setIsImageLoaded(false);
                  handleGameOver();
                }}
              />

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
    </div>
  );
};

export default Game;
