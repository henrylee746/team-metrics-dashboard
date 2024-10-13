import "../styles/Sidebar.css";
import { FaTimes } from "react-icons/fa";

const Sidebar = (props) => {
  return (
    <aside className={`sidebar ${props.isSidebarOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>Menu</h2>
        <FaTimes className="close-icon" onClick={props.sidebarToggle}></FaTimes>
      </div>
      <nav>
        <ul>
          <li>
            <a href="#overview">Overview</a>
          </li>
          <li>
            <a href="#commits">Commits</a>
          </li>
          <li>
            <a href="#code-quality">Code Quality</a>
          </li>
          <li>
            <a href="#reviews">Reviews</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
