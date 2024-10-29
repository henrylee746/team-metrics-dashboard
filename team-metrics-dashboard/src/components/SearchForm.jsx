import { useState, useEffect } from "react";
import "../styles/SearchForm.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SearchForm = ({
  formData,
  setFormData,
  resetData,
  dataFetched,
  setDataFetched,
  responseData,
  setResponseData,
  setLoading,
  setError,
  loading,
}) => {
  const [advancedVisible, setAdvancedVisible] = useState(false);

  const [autocompleteList, setAutocompleteList] = useState([]);
  const teams = [
    { email: "team1@example.com", name: "Alpha", totalCommits: 123 },
    { email: "team2@example.com", name: "Beta", openReviews: 8 },
    { email: "team3@example.com", name: "Gamma", bugsFixed: 15 },
  ];

  const navigate = useNavigate();

  const handleToggleAdvanced = () => {
    setAdvancedVisible(!advancedVisible);
  };

  const filterKPIs = (input) => {
    const searchInput = input.toLowerCase();
    if (!searchInput) {
      setAutocompleteList([]);
      return;
    }
    const matchingTeams = teams.filter((team) =>
      team.email.toLowerCase().includes(searchInput),
    );
    setAutocompleteList(matchingTeams);
  };

  const selectAutocompleteItem = (email) => {
    setFormData((prevData) => ({
      ...prevData,
      command: email,
    }));
    setAutocompleteList([]);
  };

  const handleSubmit = async (e) => {
    navigate("/"); //resets URL back to homepage
    e.preventDefault();
    const { command, owner, team, startDate, endDate, intersect } = formData;

    if (document.querySelector(".links") !== null)
      document.querySelector(".links").classList.remove("shown");

    if (!command && !owner && !team && !startDate && !endDate && !intersect) {
      return;
    }

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parcel: command,
          owners: owner,
          team: team,
          startDate: startDate,
          endDate: endDate,
          intersectCheckBox: intersect,
        }),
      });

      if (response.ok) {
        // Handle successful response
        console.log("Form submitted successfully");
        const data = await response.json();
        console.log(data.data);
        setResponseData(data.data);
        setDataFetched(true);
        setError(null);
        resetData({
          command: "",
          owner: "",
          team: "",
          startDate: "",
          endDate: "",
        });

        //setAutocompleteList([]);
      } else {
        // Handle error response
        const errorData = await response.json();
        throw new Error(`HTTP Error: Status ${response.status}`);
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      setDataFetched(false);
      setResponseData(null);
      setError(error.message);
    } finally {
    }
  };

  /*To prevent labels of text inputs lowering when there is present input*/
  const inputs = document.querySelectorAll("input[type=text]");

  inputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (input.value) {
        input.nextElementSibling.style.transform = "translateY(-25px)";
      } else {
        input.nextElementSibling.style.transform = "";
      }
    });
  });

  return (
    <section className="search-section" id="overview">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="split-search">
          {/* Left side with Reason/Owner */}
          <div className="left-half">
            <div className="searchbar-container">
              <input
                type="text"
                name="command"
                id="search-input"
                autoComplete="off"
                value={formData.command}
                onChange={setFormData}
              />
              <label htmlFor="command">Reason/Subject(s)</label>
              {autocompleteList.length > 0 && (
                <div className="autocomplete-items">
                  {autocompleteList.map((team) => (
                    <div
                      key={team.email}
                      className="autocomplete-item"
                      onClick={() => selectAutocompleteItem(team.email)}
                    >
                      {team.email}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="searchbar-container2">
              <input
                type="text"
                name="team"
                id="team-input"
                autoComplete="off"
                value={formData.team}
                onChange={setFormData}
              />
              <label htmlFor="team">Team(s)</label>
            </div>
          </div>

          {/* Center 'OR' 
            <div className="or-divider">
              <div className="vertical-line"></div>
              <div className="or">OR</div>
              <div className="vertical-line"></div>
            </div>
                  */}

          {/* Right side with new 'Team' input */}
          <div className="right-half">
            <div className="searchbar-container">
              <input
                type="text"
                name="owner"
                id="owner-input"
                autoComplete="off"
                value={formData.owner}
                onChange={setFormData}
              />
              <label htmlFor="owner">Owner(s)</label>
            </div>
            <div className="date-fields">
              <div className="date-container">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="start-date"
                  name="startDate"
                  max={new Date().toISOString().split("T")[0]}
                  value={formData.startDate}
                  onChange={setFormData}
                />
              </div>
              <div className="date-container">
                <label htmlFor="endDate">End Date</label>

                <input
                  type="date"
                  id="end-date"
                  name="endDate"
                  max={new Date().toISOString().split("T")[0]}
                  value={formData.endDate}
                  onChange={setFormData}
                />
              </div>
            </div>
          </div>
        </div>

        {/*<button
          type="button"
          id="toggle-advanced"
          onClick={handleToggleAdvanced}
        >
          <b>Advanced Settings</b>
                </button>*/}

        {/* Hidden Advanced Settings }
        {advancedVisible && (
          <div
            className="advanced-settings"
            id="advanced-settings"
            data-testid="advanced-settings"
          >
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="intersect-checkbox"
                name="intersect"
                checked={formData.intersect}
                onChange={handleChange}
                className="css-checkbox"
              />
              <label htmlFor="intersect-checkbox" id="intersect-label">
                <b>Intersect</b>
              </label>
            </div>
          </div>
        )*/}

        <button type="submit" id="submitButton">
          <b>Search</b>
        </button>
      </form>
    </section>
  );
};

export default SearchForm;
