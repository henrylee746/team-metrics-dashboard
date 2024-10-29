import "../styles/TableSection.css";
import { useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TableSection = ({ responseData, dataFetched, index }) => {
  useEffect(() => {
    const tableCards = document.querySelectorAll(".table-card");
    tableCards.forEach((card) => {
      if (!card.className.includes(index)) {
        card.classList.remove("shown");
        return;
      }
      card.classList.add("shown");
    });
  }, [index]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <h2 className="label">{`Days since 1st commit: ${label} | y: ${payload[0].value * 2}`}</h2>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="table-section" id="table-section">
      <div className={`table-card ${index}`}>
        <h3>Total Test vs Design Code (Stacked Bar Chart)</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            width={700}
            height={700}
            data={responseData.slice(0, responseData.length - 1)}
            margin={{
              top: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="days from 1st commit" interval={0} />
            <YAxis />
            <Tooltip position={{ x: 900, y: -15 }} content={CustomTooltip} />
            <Legend verticalAlign="top" />
            <Bar
              dataKey="% of total test (cumulative)"
              stackId="a"
              fill="#8884d8"
            />
            <Bar
              dataKey="% of total design (cumulative)"
              stackId="a"
              fill="#82ca9d"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default TableSection;
