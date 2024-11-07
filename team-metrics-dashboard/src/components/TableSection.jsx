import "../output.css";
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
          <h5 className="label">{`Days since 1st commit  : ${label} | % of test: ${payload[0].value}`}</h5>
          <h5 className="label">{`% of design: ${payload[1].value}`}</h5>{" "}
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
            <CartesianGrid strokeDasharray="1 1" />
            <XAxis
              padding={{ left: 30, right: 30 }}
              dataKey="days from 1st commit"
              interval={0}
            />
            <YAxis />
            <Tooltip position={{ y: 10 }} content={CustomTooltip} />
            <Legend verticalAlign="top" />
            <Bar
              dataKey="% of total test (cumulative)"
              stackId="a"
              fill="#8884d8"
              activeBar={<Rectangle fill="gold" stroke="blue" />}
            />
            <Bar
              dataKey="% of total design (cumulative)"
              stackId="a"
              fill="#82ca9d"
              activeBar={<Rectangle fill="pink" stroke="blue" />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default TableSection;
