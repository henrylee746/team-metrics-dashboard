import "./styles/global.css"; // Import global styles
import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import SearchForm from "./components/SearchForm.jsx";
import KPISection from "./components/KPISection.jsx";
import ChartsSection from "./components/ChartsSection.jsx";
import TableSection from "./components/TableSection.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  const [theme, setTheme] = useState("dark"); // Default to dark mode
  const [isSidebarOpen, setIsSideBarOpen] = useState(false);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const sidebarToggle = () => {
    setIsSideBarOpen((prevState) => !prevState);
  };

  return (
    <div className="App">
      <Header
        sidebarToggle={sidebarToggle}
        toggleTheme={toggleTheme}
        currentTheme={theme}
        className="header"
      />
      <div className="container">
        <Sidebar isSidebarOpen={isSidebarOpen} sidebarToggle={sidebarToggle} />
        <main className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
          <SearchForm />
          <KPISection />
          <ChartsSection />
          <TableSection />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
