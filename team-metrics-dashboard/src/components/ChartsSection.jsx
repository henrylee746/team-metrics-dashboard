import "../output.css";

import React, { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Label } from "@/components/ui/label";

const ChartsSection = ({ responseData, index }) => {
  const chartConfig = {
    oneOverX: {
      label: "1/x",
      color: "hsl(var(--chart-1))",
    },
    totalTest: {
      label: "% of total test (cumulative)",
      color: "hsl(var(--chart-2))",
    },
    totalDesign: {
      label: "% of total design (cumulative)",
      color: "hsl(var(--chart-3))",
    },
  };

  function Component() {
    return (
      <ChartContainer
        config={chartConfig}
        className="min-h-[200px] max-w-[700px] w-full"
      >
        <BarChart accessibilityLayer data={responseData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="days from 1st commit"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />

          <Bar dataKey="1/x" fill="var(--color-oneOverX)" radius={4} />
        </BarChart>
      </ChartContainer>
    );
  }
  return (
    <section
      className="charts-section flex gap-12 p-20 flex-wrap justify-center items-center"
      id="charts-section"
    >
      <Label />
      1/x
      <ChartContainer
        config={chartConfig}
        className="min-h-[200px] max-w-[700px] w-full"
      >
        <BarChart accessibilityLayer data={responseData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="days from 1st commit"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />

          <Bar dataKey="1/x" fill="var(--color-oneOverX)" radius={4} />
        </BarChart>
      </ChartContainer>
      <ChartContainer
        config={chartConfig}
        className="min-h-[200px] max-w-[700px] w-full"
      >
        <BarChart accessibilityLayer data={responseData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="days from 1st commit"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />

          <Bar
            dataKey="% of total test (cumulative)"
            fill="var(--color-totalTest)"
            radius={4}
          />

          <Bar
            dataKey="% of total design (cumulative)"
            fill="var(--color-totalDesign)"
            radius={4}
          />
        </BarChart>
      </ChartContainer>
      <ChartContainer
        config={chartConfig}
        className="min-h-[200px] max-w-[700px] w-full"
      >
        <LineChart
          accessibilityLayer
          data={responseData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="days from 1st commit"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            dataKey="% of total test (cumulative)"
            type="monotone"
            stroke="var(--color-totalTest)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="% of total design (cumulative)"
            type="monotone"
            stroke="var(--color-totalDesign)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </section>
  );
};

export default ChartsSection;
