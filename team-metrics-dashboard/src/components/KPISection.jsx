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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  return (
    <section className="kpi-section grid sm:grid-cols-1 lg:grid-cols-2 items-center justify-center gap-12 p-8 mt-16">
      <Carousel
        opts={{
          align: "start",
        }}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.play}
        orientation="vertical"
      >
        <CarouselContent className="p-8">
          <CarouselItem className="basis-1/2">
            <Card className="text-center">
              <CardContent>
                <span>
                  <p>
                    First Commit:{" "}
                    <i className="text-sm font-semibold">
                      {responseData.length > 0
                        ? responseData[responseData.length - 1]["First Commit"]
                        : null}
                    </i>
                  </p>
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
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem className="basis-1/2 ">
            <Card className="text-center">
              <CardContent>
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
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem className="basis-1/2 ">
            <Card className="text-center">
              <CardContent>
                <span>
                  <h4>
                    Average days between each commit:
                    <i className="text-sm font-semibold"></i>
                  </h4>
                </span>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem className="basis-1/2 ">
            <Card className="text-center">
              <CardContent>
                <span>
                  <h4>
                    Average design & test code per commit:
                    <i className="text-sm font-semibold"></i>
                  </h4>
                </span>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem className="basis-1/2">
            <Card className="text-center">
              <CardContent>
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
      </Carousel>

      <ScrollArea className="h-96 rounded-md border">
        <div className="p-4">
          <h4 className="flex gap-2 mb-4 text-md font-medium leading-none items-center">
            Commits
            <Code className="text-muted-foreground" />
          </h4>
          <Separator className="my-4" />
          <Accordion type="multiple" collapsible>
            {responseData.map((commit, index) => {
              if (index == responseData.length - 1) return;
              return (
                <AccordionItem value={`item-${index + 1}`}>
                  <div className="text-md flex justify-between items-center gap-12 p-4">
                    <span>
                      {commit["name"]}: {commit["subject"]}
                    </span>
                    <div className="flex items-center gap-4">
                      Merged: {commit["merged"]}
                      <AccordionTrigger></AccordionTrigger>
                    </div>
                  </div>
                  <AccordionContent>
                    <Table className="my-4">
                      <TableCaption>Commit {index + 1}</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">
                            Days since First Commit
                          </TableHead>
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
