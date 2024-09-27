document.addEventListener("DOMContentLoaded", () => {
  // Example: Update KPIs dynamically
});

const teams = [
  { email: "team1@example.com", name: "Alpha", totalCommits: 123 },
  { email: "team2@example.com", name: "Beta", openReviews: 8 },
  { email: "team3@example.com", name: "Gamma", bugsFixed: 15 },
];

function filterKPIs() {
  const searchInput = document
    .getElementById("search-input")
    .value.toLowerCase();
  const kpiCards = document.querySelectorAll(".kpi-card");
  const autocompleteList = document.getElementById("autocomplete-list");
  autocompleteList.innerHTML = "";

  if (!searchInput) {
    // If input is empty, show all KPI cards and hide autocomplete suggestions
    kpiCards.forEach((card) => (card.style.display = "flex"));
    return;
  }

  // Filter KPI cards based on search input
  kpiCards.forEach((card) => {
    const email = card.getAttribute("data-email").toLowerCase();
    if (email.includes(searchInput)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });

  // Generate autocomplete suggestions based on input
  const matchingTeams = teams.filter((team) =>
    team.email.toLowerCase().includes(searchInput)
  );
  matchingTeams.forEach((team) => {
    const item = document.createElement("div");
    item.classList.add("autocomplete-item");
    item.textContent = team.email;
    item.onclick = () => selectAutocompleteItem(team.email);
    autocompleteList.appendChild(item);
  });
}

function selectAutocompleteItem(email) {
  // Set the search input to the selected email and filter KPIs
  document.getElementById("search-input").value = email;
  filterKPIs();
  // Clear autocomplete suggestions after selection
  document.getElementById("autocomplete-list").innerHTML = "";
}

document
  .getElementById("commandForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const baseUrl = "http://localhost:3000/";
    const searchInput = document.getElementById("search-input").value;
    const ownersInput = document.getElementById("owner-input").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    const intersect = document.getElementById("intersect-checkbox").checked;

    if (
      searchInput == "" &&
      ownersInput == "" &&
      startDate == "" &&
      endDate == "" &&
      intersect == false
    )
      return;
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parcel: searchInput,
        owners: ownersInput,
        startDate: startDate,
        endDate: endDate,
        intersectCheckBox: intersect,
      }),
    });
  });
