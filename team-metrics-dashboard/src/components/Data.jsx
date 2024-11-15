import "../output.css"; // Import global styles
import KPISection from "../components/KPISection.jsx";
import ChartsSection from "../components/ChartsSection.jsx";
import { useOutletContext } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";

function Data() {
  const [responseData] = useOutletContext();
  const { index } = useParams(); //grabs current index in URL
  const ref = useRef(null);

  useEffect(() => {
    const div = ref.current;
    div.classList.add("dataIn");
  }, [responseData]);

  const currentData = responseData[index]; //sets data according to option chosen
  return (
    <div
      ref={ref}
      className={`transition ease-in-out delay-150 duration-300 "translate-y-100"${
        "dataIn" ? "translate-y-0" : null
      }`}
    >
      <KPISection responseData={currentData} />
      <ChartsSection responseData={currentData} />
    </div>
  );
}

export default Data;
