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
import Autoplay from "embla-carousel-autoplay";

const KPISection = ({ responseData }) => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  return (
    <section className="kpi-section flex justify-center items-center gap-5 my-12">
      <Carousel
        className="sm:w-[500px] md:w-[800px] lg:w-[1000px]"
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.play}
      >
        <CarouselContent>
          <CarouselItem className="basis-1/3">
            <Card className="lg:w-[300px] md:w-[250px] h-[150px] sm:w-[150px] flex items-center">
              <CardContent>
                <span>
                  <p>
                    First Commit:{" "}
                    <i className="text-xl font-semibold">
                      {responseData.length > 0
                        ? responseData[responseData.length - 1]["First Commit"]
                        : null}
                    </i>
                  </p>
                  <p>
                    {" "}
                    Last Commit:{" "}
                    <i className="text-xl font-semibold">
                      {responseData.length > 0
                        ? responseData[responseData.length - 1]["Last commit"]
                        : null}
                    </i>
                  </p>
                </span>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem className="basis-1/3 ">
            <Card className="lg:w-[300px] md:w-[250px] h-[150px] sm:w-[150px] flex items-center">
              <CardContent>
                <span>
                  <h4>
                    Last Commit - First Commit:
                    <i className="text-md font-semibold">
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
          <CarouselItem className="basis-1/3 ">
            <Card className="lg:w-[300px] md:w-[250px] h-[150px] sm:w-[150px] flex items-center">
              <CardContent>
                <span>
                  <h4>
                    Average days between each commit:
                    <i className="text-md font-semibold"></i>
                  </h4>
                </span>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem className="basis-1/3 ">
            <Card className="lg:w-[300px] md:w-[250px] h-[150px] sm:w-[150px] flex items-center">
              <CardContent>
                <span>
                  <h4>
                    Average design & test code per commit:
                    <i className="text-md font-semibold"></i>
                  </h4>
                </span>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem className="basis-1/3">
            <Card className="lg:w-[300px] md:w-[250px] h-[150px] sm:w-[150px] flex items-center">
              <CardContent>
                <h4>
                  Total Code Churn:{"   "}
                  <i className="text-xl font-semibold">
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
    </section>
  );
};

export default KPISection;
