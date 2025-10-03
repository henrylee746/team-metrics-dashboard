/*eslint-disable*/
import "./output.css"; // Import global styles
import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import SearchForm from "./components/SearchForm.tsx";
import Footer from "./components/Footer.jsx";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Component } from "./components/PlaceholderCharts.tsx";
import { ProgressDemo } from "./components/Progress.tsx";

/*UI components*/
import { TypographyMuted } from "./components/ui/Typography.tsx";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

function App() {
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState(null);
  const [preliminaryData, setPreliminaryData] = useState(null);
  const [isRendered, setIsRendered] = useState(false);
  const [theme, setTheme] = useState("dark"); // Default to dark mode
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [value, setValue] = useState("0");

  async function fetchPreliminaryData() {
    try {
      const response = await fetch("/api/preliminary");
      if (!response.ok)
        throw new Error(`HTTP Error: ${response.status} - ${response.error}`);
      const result = await response.json();
      console.log(result);
      return result.data;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }

  useEffect(() => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem("theme");
    console.log(`${savedTheme} mode is currently on`);
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setIsRendered(true);
    /*Run Preliminary Data Fetch*/
    async function loadData() {
      const data = await fetchPreliminaryData();
      setPreliminaryData(data);
    }
    loadData();
  }, []);

  //Once data is fetched, redirect to first array of data
  //(and disable loading animation)
  useEffect(() => {
    if (responseData) {
      setValue("0");
      navigate("/0");
    }
  }, [responseData]);

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
        <main className={`main-content`}>
          <SearchForm
            setResponseData={setResponseData}
            loading={loading}
            setLoading={setLoading}
            setError={setError}
            className={`transition-opacity duration-1000 delay-200 ${
              isRendered
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-10"
            }`}
          />
          {!responseData && !loading && !preliminaryData && (
            <div className="flex justify-center">
              <ProgressDemo
                className={`header transition-opacity duration-1500 delay-100`}
              />
            </div>
          )}
          {!responseData && !loading && preliminaryData && (
            <div
              className={`header transition-opacity duration-3000 delay-100 ${
                preliminaryData
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-10"
              }`}
            >
              <TypographyMuted className="p-2 flex justify-center">
                <span>
                  Start a search with either a subject and/or owner to get
                  customized responses like these charts below.
                </span>
              </TypographyMuted>
              <TypographyMuted className="p-2 flex justify-center text-center">
                <span>
                  Disclaimer: Results are scraped using a dataset of mock data
                  and is not meant to be 100% realistic nor accurate of the
                  performance metrics of an actual software developer.
                </span>
              </TypographyMuted>
              <div className="flex justify-center my-8">
                <Component preliminaryData={preliminaryData} />
              </div>
            </div>
          )}
          {loading && (
            <div className="flex flex-wrap gap-8 items-center justify-center ">
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[250px] w-full sm:w-[350px] md:w-[500px] lg:w-[450px] xl:w-[800px] rounded-xl" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-[350px]" />
                  <Skeleton className="h-4 w-[300px]" />
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[250px] w-full sm:w-[350px] md:w-[500px] lg:w-[450px] xl:w-[800px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[350px]" />
                  <Skeleton className="h-4 w-[300px]" />
                </div>
              </div>
            </div>
          )}

          {responseData && !loading && (
            <>
              {responseData.data.length > 0 ? (
                <div className="w-full">
                  <Select value={value} onValueChange={handleLinkChange}>
                    <SelectTrigger className="w-3/12 ml-4">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {responseData.intersect &&
                        responseData.data.map((arr, index) => {
                          return (
                            <SelectItem key={index} value={`${index}`}>
                              Subject:{" "}
                              {responseData.subject[index].label.replace(
                                /[\[\]]/g,
                                ""
                              )}
                            </SelectItem>
                          );
                        })}
                      {!responseData.intersect &&
                        responseData.data.map((arr, index) => {
                          if (index + 1 <= responseData.subjectSplit) {
                            return (
                              <SelectItem key={index} value={`${index}`}>
                                Subject:{" "}
                                {responseData.subject[index].label.replace(
                                  /[\[\]]/g,
                                  ""
                                )}
                              </SelectItem>
                            );
                          } else {
                            return (
                              <SelectItem key={index} value={`${index}`}>
                                Owner:{" "}
                                {responseData.owner.replace(/[\[\]]/g, "")}
                              </SelectItem>
                            );
                          }
                        })}
                    </SelectContent>
                  </Select>
                  {responseData.data.length > 0 ? (
                    <Outlet context={[responseData.data]} />
                  ) : null}
                  {/*Only renders the Outlet components (Data.jsx and descendants) if responses from query were found*/}
                </div>
              ) : (
                <p className="flex items-center justify-center font-medium italic">
                  No responses found, please try another query.
                </p>
              )}
            </>
          )}
          {error && <p>{error}.</p>}
        </main>
      </div>
    </>
  );
}

export default App;
