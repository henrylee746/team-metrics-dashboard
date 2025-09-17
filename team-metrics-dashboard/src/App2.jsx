/*eslint-disable*/
import "./output.css"; // Import global styles
import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import { useNavigate } from "react-router-dom";
import Page from "./components/Typography.jsx";

function App() {
  const navigate = useNavigate();
  const [isRendered, setIsRendered] = useState(false);
  const [theme, setTheme] = useState("dark"); // Default to dark mode

  useEffect(() => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem("theme");
    console.log(`${savedTheme} mode is currently on`);
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setIsRendered(true);
  }, []);

  const handleLinkChange = (e) => {
    //handles option changes, modifies URL based on selected option
    if (e) {
      setValue(e);
      navigate(e); //triggers re-render of Data component as it's dependent on dynamic parameter of :index
    }
  };

  useEffect(() => {
    // Apply theme class to root element
    document.documentElement.classList.remove(
      theme === "dark" ? "light" : "dark"
    );
    document.documentElement.classList.add(theme);

    // Save theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <>
      <div className={`App box-border`}>
        <Header
          toggleTheme={toggleTheme}
          currentTheme={theme}
          className={`header transition-opacity duration-500 delay-100 ${
            isRendered
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}
        />
        <hr />
        <Page />
      </div>
    </>
  );
}

export default App;
