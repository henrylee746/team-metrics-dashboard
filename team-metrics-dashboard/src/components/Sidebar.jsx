import "../styles/Sidebar.css";

const Sidebar = (props) => {
  return (
    <aside className={`sidebar ${props.isSidebarOpen ? "open" : ""}`}>
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
