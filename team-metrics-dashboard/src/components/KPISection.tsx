/* eslint-disable*/
"use client";

import * as React from "react";
import "../output.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LabelList,
  RadialBar,
  RadialBarChart,
  Label,
  Pie,
  PieChart,
  Sector,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  PolarRadiusAxis,
} from "recharts";
import { Calendar } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Code } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const KPISection = ({ responseData }) => {
  if (!Array.isArray(responseData) || responseData.length === 0) {
    return null;
  }

  console.log("KPI Section Response:", responseData);

  //Grab all dates for the subject/employee selected
  const dates =
    responseData && responseData.length > 0
      ? responseData.map((commit: any, index: number) => {
          return { id: index, updated: commit.updated };
        })
      : [];

  const uniqueDates = Array.from(new Set(dates.map((d) => d.updated)));
  //prevents duplicate dates (e.g. two commits on same day)
  //used when displaying select options

  // Track which date is currently selected
  const [selectedDate, setselectedDate] = React.useState(
    dates.length > 0 ? dates[0]["updated"] : null
  );

  // Instead of find, aggregate all commits with the same date
  const commitsForDate = responseData.filter(
    (commit) => commit.updated === selectedDate
  );

  const aggregatedCommit = commitsForDate.reduce(
    (acc, commit) => {
      acc.testCodeChurn += commit.testCodeChurn || 0;
      acc.sourceCodeChurn += commit.sourceCodeChurn || 0;
      return acc;
    },
    { testCodeChurn: 0, sourceCodeChurn: 0 }
  );

  // Use aggregatedCommit for chart
  const pieData = [
    {
      name: "Test Code Churn",
      date: aggregatedCommit.updated,
      value: aggregatedCommit.testCodeChurn,
      fill: "hsl(200, 70%, 50%)",
    },
    {
      name: "Design Code Churn",
      date: aggregatedCommit.updated,
      value: aggregatedCommit.sourceCodeChurn,
      fill: "hsl(40, 70%, 50%)",
    },
  ];

  const totalCodeChurn = aggregatedCommit
    ? (aggregatedCommit.testCodeChurn || 0) +
      (aggregatedCommit.sourceCodeChurn || 0)
    : 0;

  // Pie Chart config: static since we always use 2 fields
  const pieChartConfig: ChartConfig = {
    testCodeChurn: { label: "Test Code Churn", color: "hsl(200, 30%, 50%)" },
    designCodeChurn: { label: "Design Code Churn", color: "hsl(40, 70%, 50%)" },
  } satisfies ChartConfig;

  //Reset date selection back to first one if subject/employee selection switched
  React.useEffect(() => {
    setselectedDate(dates[0]["updated"]);
  }, [responseData]);

  /*Radial Chart Functions/Vars*/
  const totalCodeChurned = responseData.reduce(
    (acc, commit) =>
      acc + (commit.sourceCodeChurn || 0) + (commit.testCodeChurn || 0),
    0
  );

  const radialData = [
    {
      label: "Total Code Churn",
      totalCodeChurn: totalCodeChurned,
      fill: "hsl(200, 70%, 50%)",
    },
  ];
  //Radial Chart Config
  const radialChartConfig: ChartConfig = {
    totalCodeChurn: {
      label: "Total Code Churn",
    },
    label: {
      label: "Subject/Employee",
      color: "hsl(200, 70%, 50%)",
    },
  } satisfies ChartConfig;

  return responseData && responseData.length > 0 ? (
    <>
      <section className="kpi-section grid grid-cols-1 xl:grid-cols-2 items-center justify-center gap-12 p-8 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center justify-center">
          <Card className="flex flex-col items-center justify-center">
            <CardHeader className="flex flex-col items-center">
              <CardTitle>Commits Pie Chart</CardTitle>
              <CardDescription className="text-center">
                Breakdown of churn on {selectedDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Date selector */}
              <div className="mb-4 w-48 mx-auto">
                <Select
                  value={selectedDate || ""}
                  onValueChange={(val) => {
                    setselectedDate(val);
                  }}
                >
                  <SelectTrigger>
                    <Calendar />
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueDates.map((d, index) => (
                      <SelectItem key={index} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pie Chart */}
              {pieData.length > 0 && (
                <ChartContainer
                  config={pieChartConfig}
                  className="h-[220px] w-[300px]"
                >
                  <PieChart>
                    <ChartStyle id={"pie chart"} config={pieChartConfig} />{" "}
                    <Pie
                      data={pieData}
                      dataKey="value"
                      label
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={100}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                                >
                                  {totalCodeChurn}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  Lines of Code Churn
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="text-center text-muted-foreground leading-none">
                Hover over Chart to see specific amount of design/test code
              </div>
            </CardFooter>
          </Card>
          {/*Radial Chart*/}
          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Radial Chart - Shape</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={radialChartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <RadialBarChart
                  data={radialData}
                  endAngle={100}
                  innerRadius={80}
                  outerRadius={140}
                >
                  <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-muted last:fill-background"
                    polarRadius={[86, 74]}
                  />
                  <RadialBar dataKey="totalCodeChurn" background />
                  <PolarRadiusAxis
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-4xl font-bold"
                              >
                                {radialData[0].totalCodeChurn.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Lines of Code Churned
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                </RadialBarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 leading-none font-medium">
                25% of annual goal achieved
              </div>
              <div className="text-muted-foreground leading-none text-center">
                Showing total code churn from entire subject/employee's commit
                history
              </div>
            </CardFooter>
          </Card>
        </div>
        {/*Commits Table*/}
        <ScrollArea className="h-96 rounded-md border">
          <div className="p-4">
            <h4 className="flex gap-2 mb-4 text-md font-medium leading-none items-center">
              Commits
              <Code className="text-muted-foreground" />
            </h4>
            <Separator className="my-4" />
            <Accordion
              type="multiple"
              defaultValue={["item-1"]}
              collapsible="true"
            >
              {responseData.map((commit, index) => {
                if (index == responseData.length - 1) return;
                return (
                  <AccordionItem key={index} value={`item-${index + 1}`}>
                    <div className="text-xs xl:text-sm lg:text-xs flex justify-between items-center gap-8">
                      <span>
                        {commit["name"]}:{" "}
                        <span className="text-muted-foreground">
                          {commit["subject"]}
                        </span>
                      </span>
                      <div className="flex items-center gap-2">
                        Merged:{" "}
                        <span className="font-bold">{commit["merged"]}</span>
                        <AccordionTrigger></AccordionTrigger>
                      </div>
                    </div>
                    <AccordionContent>
                      <Table className="my-4">
                        <TableCaption>Commit {index + 1}</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Days since First Commit</TableHead>
                            <TableHead>Days since Last Commit</TableHead>
                            <TableHead>Total Test Code %</TableHead>
                            <TableHead className="text-right">
                              Total Design Code %
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {index == 0
                                ? "-"
                                : commit["days from 1st commit"]}
                            </TableCell>
                            <TableCell>
                              {index == 0
                                ? "-"
                                : commit["days from 1st commit"] -
                                  responseData[index - 1][
                                    "days from 1st commit"
                                  ]}
                            </TableCell>
                            <TableCell>
                              {commit["% of total test (cumulative)"]}
                            </TableCell>
                            <TableCell className="text-right">
                              {commit["% of total design (cumulative)"]}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </ScrollArea>
      </section>
    </>
  ) : null;
};

export default KPISection;
