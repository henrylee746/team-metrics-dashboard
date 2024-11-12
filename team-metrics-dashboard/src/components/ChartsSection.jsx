import "../output.css";

import React, { useState, useEffect } from "react";
import {
  LabelList,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Area,
  AreaChart,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ChartsSection = ({ responseData }) => {
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
    oneOverXArea: {
      label: "1/x",
      color: "hsl(var(--chart-4))",
    },
  };

  return (
    <section
      className="charts-section w-screen grid sm:grid-cols-1 lg:grid-cols-2 gap-12 p-8 justify-center items-center"
      id="charts-section"
    >
      <Card>
        <CardHeader>
          <CardTitle>1/x</CardTitle>
          <CardDescription>
            Displays amount of days in between each respective commit done
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={responseData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="days from 1st commit"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={3}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend
                content={<ChartLegendContent nameKey="days from 1st commit" />}
              />

              <Bar dataKey="1/x" fill="var(--color-oneOverX)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>1/x Area Chart</CardTitle>
          <CardDescription>Showing 1/x in continuous format</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
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
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={3}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="1/x"
                type="natural"
                fill="var(--color-oneOverXArea)"
                fillOpacity={0.4}
                stroke="var(--color-oneOverXArea)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Test and Total Design Code</CardTitle>
          <CardDescription>
            Displays percentage of total test and design code over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="min-h-[200px]  w-full"
          >
            <BarChart accessibilityLayer data={responseData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="days from 1st commit"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={3}
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
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Test and Design Code (Line Graph)</CardTitle>
          <CardDescription>
            Test and Design Code over time, but in lines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
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
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={3}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
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
        </CardContent>
      </Card>
    </section>
  );
};

export default ChartsSection;
