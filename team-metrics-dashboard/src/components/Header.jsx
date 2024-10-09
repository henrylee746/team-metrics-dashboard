import "../styles/Header.css";
import lightbulb from "../assets/lightbulb.png";
import moon from "../assets/moon.png";

const Header = () => (
  <header className="header">
    <h1>Team Metrics Dashboard</h1>
    <div className="images">
      <img src={lightbulb} alt="Lightbulb" width={10} height={10} />
      <img src={moon} alt="Moon" width={10} height={10} />
    </div>
  </header>
);

export default Header;
