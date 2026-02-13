import "../output.css"; // Import global styles
import KPISection from "../components/KPISection.tsx";
import ChartsSection from "../components/ChartsSection.jsx";
import { useOutletContext } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Data() {
  const [responseData] = useOutletContext();
  const [isRendered, setIsRendered] = useState(false);
  const { index } = useParams(); //grabs current index in URL

  useEffect(() => {
    setIsRendered(true);
  }, [responseData]);

  const currentData = responseData[index]; //sets data according to option chosen
  return (
    <div
      className={`transition-opacity duration-500 delay-100 ${
        isRendered ? "opacity-100 " : "opacity-0"
      }
      `}
    >
      <KPISection responseData={currentData} />
      <ChartsSection responseData={currentData} />
    </div>
  );
}

export default Data;
