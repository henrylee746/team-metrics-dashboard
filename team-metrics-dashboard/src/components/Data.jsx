import "../styles/global.css"; // Import global styles
import KPISection from "../components/KPISection.jsx";
import ChartsSection from "../components/ChartsSection.jsx";
import TableSection from "../components/TableSection.jsx";
import { useOutletContext } from "react-router-dom";
import { useParams } from "react-router-dom";

function Data() {
  const [responseData, dataFetched] = useOutletContext();
  const { index } = useParams();

  const currentData = responseData[index];

  return (
    <>
      <KPISection
        responseData={currentData}
        dataFetched={dataFetched}
        index={index}
      />
      <ChartsSection
        responseData={currentData}
        dataFetched={dataFetched}
        index={index}
      />
      <TableSection
        responseData={currentData}
        dataFetched={dataFetched}
        index={index}
      />
    </>
  );
}

export default Data;
