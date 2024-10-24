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
      if (!dataFetched) {
        card.classList.remove("shown");
        return;
      }
      card.classList.add("shown");
    });
  }, [dataFetched]);

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

  return (
    <section className="table-section" id="table-section">
      <div className={`table-card ${index}`}>
        <h3>Total Test vs Design Code (Stacked Bar Chart)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={200}
            data={responseData.slice(0, responseData.length - 1)}
            margin={{
              top: 15,
              right: 30,
              left: 20,
              bottom: 15,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="days from 1st commit" />
            <YAxis />
            <Tooltip />
            <Legend />
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
