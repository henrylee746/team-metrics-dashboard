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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
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
import Autoplay from "embla-carousel-autoplay";

const KPISection = ({ responseData }) => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false }),
  );

  return (
    <section className="kpi-section grid sm:grid-cols-1 lg:grid-cols-2 items-center justify-center gap-12 p-8 mt-16">
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-full rounded-lg border text-center min-h-[200px]"
      >
        <ResizablePanel
          defaultSize={25}
          className="flex items-center justify-center"
        >
          <div className=" xl:text-lg md:text-md sm:text-sm p-2">
            <span>
              <p>
                First Commit:{" "}
                <i className="text-sm font-semibold">
                  {responseData.length > 0
                    ? responseData[responseData.length - 1]["First Commit"]
                    : null}
                </i>
              </p>
              <br />
              <p>
                {" "}
                Last Commit:{" "}
                <i className="text-sm font-semibold">
                  {responseData.length > 0
                    ? responseData[responseData.length - 1]["Last commit"]
                    : null}
                </i>
              </p>
            </span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={25}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel
              defaultSize={50}
              className="flex items-center justify-center"
            >
              <div className="flex xl:text-lg md:text-md sm:text-sm  items-center justify-center p-2">
                <span>
                  <h4>
                    Last Commit - First Commit:
                    <i className="text-sm font-semibold">
                      {" "}
                      {responseData.length > 0
                        ? responseData[responseData.length - 1][
                            "Last Commit-First Commit"
                          ]
                        : null}{" "}
                      days
                    </i>
                  </h4>
                </span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel
              defaultSize={50}
              className="flex items-center justify-center"
            >
              <div className="flex text-xs xl:text-lg md:text-md sm:text-sm items-center justify-center p-2">
                <span>
                  <h4>
                    Avg. days between each commit:
                    <i className="text-sm font-semibold">
                      {" "}
                      {
                        responseData[responseData.length - 1][
                          "Average days between each commit"
                        ]
                      }
                    </i>
                  </h4>
                </span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={25}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel className="flex items-center justify-center">
              <div className="flex xl:text-lg md:text-md sm:text-sm items-center justify-center p-2">
                <span>
                  <h4 className="text-sm lg:text-md">
                    Average design code churn per commit:
                    <i className="text-sm font-semibold">
                      {" "}
                      {
                        responseData[responseData.length - 1][
                          "Average design code churn per commit"
                        ]
                      }
                    </i>
                  </h4>
                  <br />
                  <h4 className="text-sm lg:text-md">
                    Average test code churn per commit:
                    <i className="text-sm font-semibold">
                      {" "}
                      {
                        responseData[responseData.length - 1][
                          "Average test code churn per commit"
                        ]
                      }
                    </i>
                  </h4>
                </span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={25}>
          <ResizablePanel className="flex items-center justify-center">
            <div className="flex xl:text-lg md:text-md sm:text-sm items-center justify-center p-2">
              <span>
                <h4>
                  Total Code Churn:{" "}
                  <i className="text-sm font-semibold">
                    {responseData.length > 0
                      ? responseData[responseData.length - 1][
                          "Total code churn"
                        ]
                      : null}
                  </i>
                </h4>
                <h4>
                  Velocity:{" "}
                  <i className="text-sm font-semibold">
                    {responseData.length > 0
                      ? responseData[responseData.length - 1]["Velocity (4/x)"]
                      : null}
                  </i>
                </h4>
              </span>
            </div>
          </ResizablePanel>
        </ResizablePanel>
        <ResizableHandle />
      </ResizablePanelGroup>

      {/*<Carousel
        opts={{
          align: "start",
        }}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.play}
        orientation="horizontal"
        style={{
          width: "300px",
        }}
      >
        <CarouselContent>
          <CarouselItem>
            <Card className="text-center">
              <CardContent className="flex aspect-square items-center justify-center">
                <span>
                  <h4>
                    Average design & test code per commit:
                    <i className="text-sm font-semibold"></i>
                  </h4>
                </span>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem>
            <Card className="text-center">
              <CardContent className="flex aspect-square items-center justify-center">
                <h4>
                  Total Code Churn:{"   "}
                  <i className="text-sm font-semibold">
                    {responseData.length > 0
                      ? responseData[responseData.length - 1][
                          "Total code churn"
                        ]
                      : null}{" "}
                    lines
                  </i>
                </h4>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
                      </Carousel>*/}

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
                            {index == 0 ? "-" : commit["days from 1st commit"]}
                          </TableCell>
                          <TableCell>
                            {index == 0
                              ? "-"
                              : commit["days from 1st commit"] -
                                responseData[index - 1]["days from 1st commit"]}
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
  );
};

export default KPISection;
