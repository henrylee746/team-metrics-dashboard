/* eslint-disable*/

import "../output.css";
import * as React from "react";
("use client");
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  Area,
  AreaChart,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
} from "recharts";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export function Component(preliminaryData) {
  const chartData = preliminaryData; //originally the "data" object from the response obj
  const chartDataDestructured = chartData.preliminaryData; //destructure the object to only have the array of supabase entries

  const chartConfig = {
    design_code_churn: {
      label: "Design Code Churn",
      color: "hsl(var(--chart-1))", //colour painted if fill not specified in chartDataDestructured
    },
    test_code_churn: {
      label: "Test Code Churn",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("design_code_churn");
  const total = React.useMemo(
    () => ({
      design_code_churn: chartDataDestructured.reduce(
        (acc, curr) => acc + curr.design_code_churn,
        0
      ),
      test_code_churn: chartDataDestructured.reduce(
        (acc, curr) => acc + curr.test_code_churn,
        0
      ),
    }),
    []
  );
  return (
    <div className="flex flex-wrap gap-4 m-4 justify-center items-center w-full">
      <Card className="py-0">
        <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
            <CardTitle>Code Churn - Bar Chart</CardTitle>
            <CardDescription>
              Showing code churn from the last 5 months
            </CardDescription>
          </div>
          <div className="flex">
            {["design_code_churn", "test_code_churn"].map((key) => {
              const chart = key as keyof typeof chartConfig;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-muted-foreground text-xs">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-lg leading-none font-bold sm:text-3xl">
                    {total[key as keyof typeof total].toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartDataDestructured}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent className="w-[185px]" nameKey="views" />
                }
              />
              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 leading-none font-medium">
                Approx. 89% drop from January to February
              </div>
              <div className="text-muted-foreground flex items-center gap-2 leading-none">
                January - May 2025 (Toggle between Design and Test Code Churn)
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
      {/*Area Chart - Gradient*/}
      <Card>
        <CardHeader>
          <CardTitle>Code Churn - Gradient Area Chart</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartDataDestructured}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="design_code_churn"
                type="natural"
                fill="url(#fillMobile)"
                fillOpacity={0.4}
                stroke="var(--color-mobile)"
              />
              <Area
                dataKey="test_code_churn"
                type="natural"
                fill="url(#fillDesktop)"
                fillOpacity={0.4}
                stroke="var(--color-desktop)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 leading-none font-medium">
                What happened to the productivity?
              </div>
              <div className="text-muted-foreground flex items-center gap-2 leading-none">
                January - May 2025 (Hover over the graph to see specific month
                stats)
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
      {/*Radial Chart*/}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Radial Chart - Total Code Churn</CardTitle>
          <CardDescription>Across 5 months</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <RadialBarChart
              data={chartDataDestructured}
              startAngle={0}
              endAngle={250}
              innerRadius={80}
              outerRadius={110}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[86, 74]}
              />
              <RadialBar
                dataKey="total_code_churn"
                background
                cornerRadius={10}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                            {chartDataDestructured[0].total_code_churn.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Lines
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
            4031 lines across 5 months - how's that?
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
