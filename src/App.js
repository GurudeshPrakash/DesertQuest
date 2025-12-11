import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Disclaimer from "./pages/Disclaimer";
import DesertAuth from "./pages/DesertAuth";
import Game from "./pages/Game";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Level from "./pages/Levels";
import Header from "./components/header/header";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/LeaderBoard";

import { WeatherProvider } from "./context/WeatherContext";
import { MusicProvider } from "./context/MusicContext";

import MusicToggleButton from "./components/musicToggleButton/MusicToggleButton"; 

import "./App.css";

function App() {
  return (
    <WeatherProvider>
      <MusicProvider>    {/* ✅ FIX: MusicProvider added */}
        
        <Header />
        <MusicToggleButton />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/desertAuth" element={<DesertAuth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/level" element={<Level />} />
          <Route path="/game" element={<Game />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>

      </MusicProvider>
    </WeatherProvider>
  );
}

export default App;
