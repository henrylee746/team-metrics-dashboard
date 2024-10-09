/*eslint-disable*/
import { useState, useEffect } from "react";
import "../styles/KPISection.css";

const KPISection = () => {
  const [kpis, setKpis] = useState([
    { email: "team1@example.com", name: "Alpha", totalCommits: 123 },
    { email: "team2@example.com", name: "Beta", openReviews: 8 },
    { email: "team3@example.com", name: "Gamma", bugsFixed: 15 },
  ]);

  useEffect(() => {
    // Fetch KPIs from the database (use handleFilter function)
    /*
    const initialKPIs = [
      { email: "team1@example.com", name: "Alpha", totalCommits: 123 },
      { email: "team2@example.com", name: "Beta", openReviews: 8 },
      { email: "team3@example.com", name: "Gamma", bugsFixed: 15 },
    ];
    setKpis(initialKPIs);
    */
  }, []);

  const handleFilter = (filteredKPIs) => {
    setKpis(filteredKPIs);
  };

  return (
    <section className="kpi-section" id="kpi-section">
      {kpis.map((team) => (
        <div className="kpi-card" key={team.email} data-email={team.email}>
          <h3>Team: {team.name}</h3>
          {team.totalCommits && (
            <p>
              Total Commits: <span>{team.totalCommits}</span>
            </p>
          )}
          {team.openReviews && (
            <p>
              Open Reviews: <span>{team.openReviews}</span>
            </p>
          )}
          {team.bugsFixed && (
            <p>
              Bugs Fixed: <span>{team.bugsFixed}</span>
            </p>
          )}
        </div>
      ))}
    </section>
  );
};

export default KPISection;
