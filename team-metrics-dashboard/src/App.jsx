import "./styles/global.css"; // Import global styles
import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import SearchForm from "./components/SearchForm.jsx";
import Footer from "./components/Footer.jsx";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function App() {
  const navigate = useNavigate();
  const [dataFetched, setDataFetched] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [theme, setTheme] = useState("dark"); // Default to dark mode
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    command: "",
    owner: "",
    team: "",
    startDate: "",
    endDate: "",
    intersect: false,
  });
  const [isSidebarOpen, setIsSideBarOpen] = useState(false);

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
      document.querySelector(".links").classList.add("shown");
      setLoading(false);
    }
  }, [responseData]);

  //Handling Form Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLinkChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue) {
      navigate(selectedValue);
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
  const sidebarToggle = () => {
    setIsSideBarOpen((prevState) => !prevState);
  };

  /*********Responsive Design**********************************/
  /*if sidebar is toggled while window is small size, adjust sidebar 
  to fit height of main-content*/
  useEffect(() => {
    setTimeout(() => {
      const div1 = document.querySelector(".sidebar");
      const div2 = document.querySelector(".main-content");

      const div2Height = div2.offsetHeight;
      //offsetHeight takes border & padding into calculation

      //(plus 10 margin)
      div1.style.height = div2Height + 10 + "px";
    }, 400);
  }, [isSidebarOpen]);

  //resizes sidebar as main-content resizes when window resizes
  window.addEventListener("resize", () => {
    const div1 = document.querySelector(".sidebar");
    const div2 = document.querySelector(".main-content");

    const div2Height = div2.offsetHeight;
    //offsetHeight takes border & padding into calculation

    //(plus 10 margin)
    div1.style.height = div2Height + 10 + "px";
  });

  /********************************************/

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
          <SearchForm
            formData={formData}
            setFormData={handleChange}
            resetData={setFormData}
            setDataFetched={setDataFetched}
            responseData={responseData}
            setResponseData={setResponseData}
            setLoading={setLoading}
            setError={setError}
            loading={loading}
          />
          {dataFetched && (
            <>
              <select className="links" onChange={handleLinkChange}>
                Toggle by Subject:
                {responseData.map((arr, index) => {
                  if (index == responseData.length - 1) {
                    if (responseData.length == 1) {
                      return (
                        <option key={index} value={`${index}`}>
                          Subject {arr[responseData.length - 1]["reason"]}
                        </option>
                      );
                    }
                    return (
                      <option key={index} value={`${index}`}>
                        Total
                      </option>
                    );
                  }
                  return (
                    <option key={index} value={`${index}`}>
                      Subject {arr[0]["reason"]}
                    </option>
                  );
                })}
              </select>
              <Outlet context={[responseData, dataFetched]} />
            </>
          )}
          {loading && <div className="loader"></div>}
          {error && <p>{error}.</p>}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
