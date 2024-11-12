import "../output.css"; // Import global styles
import KPISection from "../components/KPISection.jsx";
import ChartsSection from "../components/ChartsSection.jsx";
import { useOutletContext } from "react-router-dom";
import { useParams } from "react-router-dom";

function Data() {
  const [responseData] = useOutletContext();
  const { index } = useParams(); //grabs current index in URL

  const currentData = responseData[index]; //sets data according to option chosen

  return (
    <>
      <KPISection responseData={currentData} />
      <ChartsSection responseData={currentData} />
    </>
  );
}

export default Data;
