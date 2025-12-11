import { Link } from "react-router-dom";
import { FaUser, FaTrophy } from "react-icons/fa";
import "./header.css";
import logo from "./desetquestlogo.png"; 
const Header = () => {
  return (
    <header className="header">

      <Link to="/" className="logo-link">
        <img src={logo} alt="Desert Quest" className="logo-img" />
        <h1 className="logo-text">Desert Quest</h1>
      </Link>

      <nav className="nav-icons">
        <Link to="/leaderboard" className="icon">
          <FaTrophy size={24} />
        </Link>
        <Link to="/profile" className="icon">
          <FaUser size={24} />
        </Link>
      </nav>
    </header>
  );
};

export default Header;
