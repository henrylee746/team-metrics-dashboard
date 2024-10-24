import { useState, useEffect } from "react";
import "../styles/KPISection.css";

const KPISection = ({ responseData, dataFetched, index }) => {
  useEffect(() => {
    const cardSection = document.querySelectorAll(".kpi-card");
    cardSection.forEach((card) => {
      console.log(card.className);
      if (!dataFetched) {
        card.classList.remove("shown");
        return;
      }
      card.classList.add("shown");
    });
  }, [dataFetched]);

  useEffect(() => {
    const cardSection = document.querySelectorAll(".kpi-card");
    cardSection.forEach((card) => {
      console.log(card.className);
      if (!card.className.includes(index)) {
        card.classList.remove("shown");
        return;
      }
      card.classList.add("shown");
    });
  }, [index]);

  return (
    <section className="kpi-section" id="kpi-section">
      <div className={`kpi-card ${index}`}>
        <h4>
          First Commit:{" "}
          <i>
            {responseData.length > 0
              ? responseData[responseData.length - 1]["First Commit"]
              : null}
          </i>
        </h4>

        <h4>
          Last Commit:{" "}
          <i>
            {responseData.length > 0
              ? responseData[responseData.length - 1]["Last commit"]
              : null}
          </i>
        </h4>
      </div>
      <div className={`kpi-card ${index}`}>
        <h4>
          Last Commit - First Commit:{" "}
          <i>
            {" "}
            {responseData.length > 0
              ? responseData[responseData.length - 1][
                  "Last Commit-First Commit"
                ]
              : null}
          </i>
        </h4>
      </div>
      <div className={`kpi-card ${index}`}>
        <h4>
          Total Code Churn:{" "}
          <i>
            {responseData.length > 0
              ? responseData[responseData.length - 1]["Total code churn"]
              : null}
          </i>
        </h4>
      </div>
    </section>
  );
};

export default KPISection;
