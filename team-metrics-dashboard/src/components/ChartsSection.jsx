import "../output.css";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  ComposedChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
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
      if (!chart.className.includes(index)) {
        chart.classList.remove("shown");
        return;
      }
      chart.classList.add("shown");
    });
  }, [index]);

  useEffect(() => {
    console.log(responseData.slice(0, responseData.length - 1));
  }, [dataFetched]);

  /*From Recharts Docs
  active: determines if tooltip is visible or not
  payload: input data (automatically calculated)
  label: by default, is: "`${x}${y}`"
  */
  const CustomTooltip = ({ active, payload, label }) => {
    //for % of test and design charts
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <h5 className="label">{`Days since 1st commit  : ${label} | % of test: ${payload[0].value}`}</h5>
          <h5 className="label">{`% of design: ${payload[1].value}`}</h5>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipForOneOverX = ({ active, payload, label }) => {
    //for 1/x chart
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <h4 className="label">{`Days since 1st commit  : ${label} | 1/x: ${payload[0].value}`}</h4>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="charts-section" id="charts-section">
      <div className={`chart-card one ${index}`}>
        <h3>1/x</h3>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            width={700}
            height={600}
            data={responseData.slice(0, responseData.length - 1)}
            margin={{
              bottom: 15,
            }}
          >
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis
              type="number"
              dataKey="days from 1st commit"
              padding={{ left: 30, right: 30 }}
              interval={0}
            />
            <YAxis />
            <Tooltip position={{ y: -25 }} content={CustomTooltipForOneOverX} />

            <Legend verticalAlign="top" />
            <Bar
              dataKey="1/x"
              fill="#8884d8"
              barSize={2} //5 if large input?
              activeBar={<Rectangle fill="pink" stroke="blue" />}
            />
            <Line type="monotone" dataKey="1/x" stroke="#ff7300" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className={`chart-card two ${index}`}>
        <h3>Total Test vs Design Code</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={700}
            height={500}
            data={responseData.slice(0, responseData.length - 1)}
            margin={{
              bottom: 15,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              interval={0}
              dataKey="days from 1st commit"
              padding={{ left: 30, right: 30 }}
            />
            <YAxis />
            <Tooltip position={{ y: 5 }} content={CustomTooltip} />
            <Legend verticalAlign="top" />
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
