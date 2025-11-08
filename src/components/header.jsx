import { Link } from "react-router-dom";
import { FaUser, FaTrophy } from "react-icons/fa";
import "./style/header.css";

const Header = () => {
  return (
    <header className="header">
           
      <h1 className="logo">Desert Quest</h1>
      <Link to="/desertAuth" className="logo-link"></Link>

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
