import React from "react";
import "./styles/global.css"; // Import global styles
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import SearchForm from "./components/SearchForm.jsx";
import KPISection from "./components/KPISection.jsx";
import ChartsSection from "./components/ChartsSection.jsx";
import TableSection from "./components/TableSection.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="container">
        <Sidebar />
        <main className="main-content">
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
