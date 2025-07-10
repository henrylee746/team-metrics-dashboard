import "./output.css"; // Import global styles
/* eslint-disable*/
import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import SearchForm from "./components/SearchForm.tsx";
import Footer from "./components/Footer.jsx";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

/*UI components*/
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function App() {
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState(null);
  const [theme, setTheme] = useState("dark"); // Default to dark mode
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //Saving preferred viewing mode currently does not work..
  useEffect(() => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem("theme");
    console.log(savedTheme);
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  //Once data is fetched, redirect to first array of data
  //(and disable loading animation)
  useEffect(() => {
    if (responseData) {
      navigate("/0");
    }
  }, [responseData]);

  const handleLinkChange = (e) => {
    //handles option changes, modifies URL based on selected option
    if (e) {
      navigate(e); //triggers re-render of Data component as it's dependent on dynamic parameter of :index
    }
  };

  /*The theme can be manipulated using state.. 
  but effects are necessary to directly change the DOM 
  depending on dark/light mode
  
  Changes in state will rerender the whole app, while 
  changes in effect are dependent upon the parameters in the 
  dep. array
  */
  useEffect(() => {
    // Apply theme class to root element
    document.documentElement.classList.remove(
      theme === "dark" ? "light" : "dark",
    );
    document.documentElement.classList.add(theme);

    // Save theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="App">
      <Header
        toggleTheme={toggleTheme}
        currentTheme={theme}
        className="header"
      />
      <div className="container">
        <main className={`main-content`}>
          {responseData && <Outlet context={[responseData.data]} />}
          {error && <p>{error}.</p>}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
