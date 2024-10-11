import "../styles/Header.css";
import { FaSun, FaMoon, FaBars } from "react-icons/fa";

const Header = ({ sidebarToggle, toggleTheme, currentTheme }) => (
  <header className="header">
    <div className="left-header-icon">
      <FaBars className="menu-icon" onClick={sidebarToggle}></FaBars>
      <h1>Team Metrics Dashboard</h1>
    </div>
    <div className="right-header-icon" onClick={toggleTheme}>
      {currentTheme == "dark" ? (
        <FaSun className="toggle-icon"></FaSun>
      ) : (
        <FaMoon className="toggle-icon"></FaMoon>
      )}
    </div>
  </header>
);

export default Header;
