/* eslint-disable*/
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
import { Label, Pie, PieChart, Sector } from "recharts";
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

  // Track which date is currently selected
  const [selectedDate, setselectedDate] = React.useState(
    dates.length > 0 ? dates[0]["updated"] : null
  );

  console.log(selectedDate);

  // Find commit for selected date
  const selectedCommit = responseData.find(
    (commit) => commit.updated === selectedDate
  );

  // Transform into pie-friendly data
  const pieData = selectedCommit
    ? [
        {
          name: "Test Code Churn",
          value: selectedCommit.testCodeChurn || 0,
          fill: "hsl(200, 70%, 50%)",
        },
        {
          name: "Design Code Churn",
          value: selectedCommit.sourceCodeChurn || 0,
          fill: "hsl(40, 70%, 50%)",
        },
      ]
    : [];

  const totalCodeChurn = selectedCommit
    ? (selectedCommit.testCodeChurn || 0) +
      (selectedCommit.sourceCodeChurn || 0)
    : 0;

  // Chart config: static since we always use 2 fields
  const chartConfig: ChartConfig = {
    testCodeChurn: { label: "Test Code Churn", color: "hsl(200, 30%, 50%)" },
    designCodeChurn: { label: "Design Code Churn", color: "hsl(40, 70%, 50%)" },
  };

  //Reset date selection back to first one if subject/employee selection switched
  React.useEffect(() => {
    setselectedDate(dates[0]["updated"]);
  }, [responseData]);

  return responseData && responseData.length > 0 ? (
    <>
      <section className="kpi-section grid sm:grid-cols-1 lg:grid-cols-2 items-center justify-center gap-12 p-8 mt-4">
        <div className="flex gap-4 justify-center items-center gap-8">
          <Card className="flex flex-col items-center justify-center p-4">
            <CardHeader className="flex flex-col items-center">
              <CardTitle>Commits Pie Chart</CardTitle>
              <CardDescription>
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
                    {dates.map((d, index) => (
                      <SelectItem key={index} value={d.updated}>
                        {d.updated}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pie Chart */}
              {pieData.length > 0 && (
                <ChartContainer
                  config={chartConfig}
                  className="h-[300px] w-[300px]"
                >
                  <PieChart>
                    <ChartStyle id={"pie chart"} config={chartConfig} />{" "}
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
          </Card>
          <Card className="flex flex-col items-center justify-center p-4">
            <CardHeader className="flex flex-col items-center">
              <CardTitle>Commits Pie Chart</CardTitle>
              <CardDescription>
                Breakdown of churn on {selectedDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Date selector */}
              <div className="mb-4 w-48 mx-auto">
                <Select
                  value={selectedDate || ""}
                  onValueChange={(val) => setselectedDate(val)}
                >
                  <SelectTrigger>
                    <Calendar />
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {dates.map((d, index) => (
                      <SelectItem key={index} value={d.updated}>
                        {d.updated}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pie Chart */}
              {pieData.length > 0 && (
                <ChartContainer
                  config={chartConfig}
                  className="h-[300px] w-[300px]"
                >
                  <PieChart>
                    <ChartStyle id={"pie chart"} config={chartConfig} />{" "}
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
          </Card>
        </div>
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
