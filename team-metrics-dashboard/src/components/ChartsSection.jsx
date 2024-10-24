import "../styles/ChartsSection.css";

import React, { useState, useEffect } from "react";
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

const colors = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "red",
  "pink",
  "brown",
];

const ChartsSection = ({ responseData, dataFetched, index }) => {
  useEffect(() => {
    const chartSection = document.querySelectorAll(".chart-card");
    chartSection.forEach((chart) => {
      if (!dataFetched) {
        chart.classList.remove("shown");
        return;
      }
      chart.classList.add("shown");
    });
  }, [dataFetched]);

  useEffect(() => {
    const chartSection = document.querySelectorAll(".chart-card");

    chartSection.forEach((chart) => {
      if (!chart.className.includes(index)) {
        chart.classList.remove("shown");
        return;
      }
      chart.classList.add("shown");
    });
  }, [index]);

  return (
    <section className="charts-section" id="charts-section">
      <div className={`chart-card one ${index}`}>
        <h3>1/x</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={300}
            height={200}
            data={responseData.slice(0, responseData.length - 1)}
            margin={{
              top: 15,
              right: 20,
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
              dataKey="1/x"
              fill="#8884d8"
              activeBar={<Rectangle fill="pink" stroke="blue" />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={`chart-card two ${index}`}>
        <h3>Total Test vs Design Code</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={300}
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
            <Line
              type="monotone"
              dataKey="% of total test (cumulative)"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="% of total design (cumulative)"
              stroke="#82ca9d"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default ChartsSection;
