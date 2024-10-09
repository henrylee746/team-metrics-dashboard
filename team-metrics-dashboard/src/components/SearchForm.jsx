import { useState, useEffect } from "react";
import "../styles/SearchForm.css";

const SearchForm = () => {
  const [advancedVisible, setAdvancedVisible] = useState(false);
  const [formData, setFormData] = useState({
    command: "",
    owner: "",
    team: "",
    startDate: "",
    endDate: "",
    intersect: false,
  });
  const [autocompleteList, setAutocompleteList] = useState([]);
  const teams = [
    { email: "team1@example.com", name: "Alpha", totalCommits: 123 },
    { email: "team2@example.com", name: "Beta", openReviews: 8 },
    { email: "team3@example.com", name: "Gamma", bugsFixed: 15 },
  ];

  useEffect(() => {
    // Prevent future dates by setting max attribute (handled in input elements)
  }, []);

  const handleToggleAdvanced = () => {
    setAdvancedVisible(!advancedVisible);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "command") {
      filterKPIs(value);
    }
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
    e.preventDefault();
    const { command, owner, team, startDate, endDate, intersect } = formData;

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
        // Optionally, reset the form or provide user feedback
        setFormData({
          command: "",
          owner: "",
          team: "",
          startDate: "",
          endDate: "",
          intersect: false,
        });
        setAutocompleteList([]);
      } else {
        // Handle error response
        const errorData = await response.json();
        console.error("Form submission failed:", errorData.message);
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

  return (
    <section className="search-section" id="overview">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="split-search">
          {/* Left side with Reason/Owner */}
          <div className="left-half">
            <div className="searchbar-container">
              <label htmlFor="command">Enter Reason or Subject:</label>
              <input
                type="text"
                name="command"
                id="search-input"
                placeholder="Reason/Subject..."
                autoComplete="off"
                value={formData.command}
                onChange={handleChange}
              />
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
            <div className="searchbar-container">
              <label htmlFor="owner">Owners:</label>
              <input
                type="text"
                name="owner"
                id="owner-input"
                placeholder="Owner..."
                autoComplete="off"
                value={formData.owner}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Center 'OR' */}
          <div className="or-divider">
            <div className="vertical-line"></div>
            <div className="or">OR</div>
            <div className="vertical-line"></div>
          </div>

          {/* Right side with new 'Team' input */}
          <div className="right-half">
            <div className="searchbar-container2">
              <label htmlFor="team">Team:</label>
              <input
                type="text"
                name="team"
                id="team-input"
                placeholder="Team..."
                autoComplete="off"
                value={formData.team}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          id="toggle-advanced"
          onClick={handleToggleAdvanced}
        >
          <b>Advanced Settings</b>
        </button>

        {/* Hidden Advanced Settings */}
        {advancedVisible && (
          <div
            className="advanced-settings"
            id="advanced-settings"
            data-testid="advanced-settings"
          >
            <div className="date-fields">
              <div className="date-container">
                <label htmlFor="start-date">
                  <b>Start Date:</b>
                </label>
                <input
                  type="date"
                  id="start-date"
                  name="startDate"
                  max={new Date().toISOString().split("T")[0]}
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="date-container">
                <label htmlFor="end-date">
                  <b>End Date:</b>
                </label>
                <input
                  type="date"
                  id="end-date"
                  name="endDate"
                  max={new Date().toISOString().split("T")[0]}
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="checkbox-container">
              <label htmlFor="intersect-checkbox" id="intersect-label">
                <b>Intersect</b>
              </label>
              <input
                type="checkbox"
                id="intersect-checkbox"
                name="intersect"
                checked={formData.intersect}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <button type="submit" id="submitButton">
          <b>Search</b>
        </button>
      </form>
    </section>
  );
};

export default SearchForm;
