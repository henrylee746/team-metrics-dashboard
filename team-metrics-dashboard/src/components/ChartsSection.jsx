/* eslint-disable*/

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
import { Clock, ChartArea, TestTube, TestTubes } from "lucide-react";

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

  return responseData && responseData.length > 0 ? (
    <section
      className="charts-section grid lg:grid-cols-2 sm:grid-cols-1 gap-12 p-8 justify-center items-center"
      id="charts-section"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            1/x * 100 <Clock height={20} />
          </CardTitle>
          <CardDescription>
            (1 divided by x (days since last commit) * 100)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart
              accessibilityLayer
              data={responseData.slice(1, responseData.length - 1)}
              margin={{ top: 30 }}
            >
              <CartesianGrid vertical={true} />
              <XAxis
                dataKey="days from 1st commit"
                tickLine={true}
                tickMargin={10}
                axisLine={true}
                tickFormatter={(value) => `Day ${value}`}
              />
              <YAxis
                tickLine={true}
                axisLine={false}
                tickMargin={8}
                tickCount={3}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend
                content={(props) => (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    {props.payload.map((entry, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "14px",
                          margin: "16px",
                        }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            backgroundColor: entry.color,
                          }}
                        />
                        <span>{entry.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Bar dataKey="1/x" fill="var(--color-oneOverX)" radius={4}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            The higher the bars, the better
          </div>
          <div className="text-muted-foreground leading-none">
            Means commits were updated/pushed more often in between days
          </div>
        </CardFooter>
      </Card>
      {/*Area Chart*/}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            1/x * 100 Area Chart <ChartArea height={20} />
          </CardTitle>{" "}
          <CardDescription>
            Showing 1/x * 100 in continuous format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={responseData.slice(1, responseData.length - 1)}
              margin={{
                top: 30,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="days from 1st commit"
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                tickFormatter={(value) => `Day ${value}`}
              />
              <YAxis
                tickLine={true}
                axisLine={false}
                tickMargin={8}
                tickCount={3}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <defs>
                <linearGradient id="1/x" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-2)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-2)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="1/x"
                type="natural"
                fill="url(#1/x)"
                fillOpacity={0.3}
                stroke="hsl(var(--chart-2))"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            The more area covered, the better
          </div>
          <div className="text-muted-foreground leading-none">
            Means commits were updated/pushed more often in between days
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            Total Test and Design code <TestTube height={20} />
          </CardTitle>{" "}
          <CardDescription>
            Displays percentage of total test and design code over time. 200%
            means completion (100% of the design and 100% of the test code
            done.)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart
              accessibilityLayer
              data={responseData.slice(0, responseData.length - 1)}
              margin={{ top: 30 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="days from 1st commit"
                tickLine={true}
                tickMargin={20}
                axisLine={true}
                tickFormatter={(value) => `Day ${value}`}
              />
              <YAxis
                tickLine={true}
                axisLine={false}
                tickMargin={15}
                tickCount={3}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend
                content={(props) => (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    {props.payload.map((entry, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "14px",
                          margin: "16px",
                        }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            backgroundColor: entry.color,
                          }}
                        />
                        <span>{entry.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Bar
                dataKey="% of total test (cumulative)"
                stackId={"a"}
                fill="var(--color-totalTest)"
                radius={[0, 0, 4, 4]}
              />

              <Bar
                dataKey="% of total design (cumulative)"
                stackId={"a"}
                fill="var(--color-totalDesign)"
                radius={[0, 0, 4, 4]}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value) => `${value.toFixed(0)}%`}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            The closer the bars are to a 1:1 ratio, the better
          </div>
          <div className="text-muted-foreground leading-none">
            Means design code was being tested often with test code
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            Total Test and Design Code (Line Graph) <TestTubes height={20} />
          </CardTitle>{" "}
          <CardDescription>
            Test and Design Code over time, but in lines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={responseData.slice(0, responseData.length - 1)}
              margin={{
                top: 30,
                right: 10,
              }}
            >
              <CartesianGrid vertical={true} />
              <XAxis
                dataKey="days from 1st commit"
                tickLine={true}
                axisLine={true}
                tickMargin={20}
                tickFormatter={(value) => `Day ${value}`}
              />
              <YAxis
                tickLine={true}
                axisLine={false}
                tickMargin={8}
                tickCount={3}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <ChartLegend
                content={(props) => (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    {props.payload.map((entry, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "14px",
                          margin: "16px",
                        }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            backgroundColor: entry.color,
                          }}
                        />
                        <span>{entry.value}</span>
                      </div>
                    ))}
                  </div>
                )}
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
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            The more closely correlated the lines are, the better
          </div>
          <div className="text-muted-foreground leading-none">
            Means design code was being tested often with test code
          </div>
        </CardFooter>
      </Card>
    </section>
  ) : (
    <div className="text-center text-gray-500 p-8">
      No results found for this subject/owner
    </div>
  );
};

export default ChartsSection;
