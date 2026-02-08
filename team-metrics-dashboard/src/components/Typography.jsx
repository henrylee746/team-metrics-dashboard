import {
  H1,
  H2,
  P,
  List,
  Table,
  TypographyBlockquote,
} from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center p-4 gap-4">
      <H1 className="text-center">Velocity Project: How to Use</H1>
      <H2 className="my-4 text-center">
        The objective of the tool is to query performance metrics from a mock
        dataset of two employees and two made-up "commit subjects."
      </H2>
      <P className="text-center">
        You can query one or more employee(s)/subject(s). Below is a brief table
        of the employees/subejcts and if there are merging commits made by the
        employees in those subjects.
      </P>
      <div className="my-3 w-[80%] overflow-y-auto">
        <Table
          headers={[
            "Employees",
            "Subjects",
            "Employees involved in this commit subject",
          ]}
          rowData={[
            ["Bob Sample", "XY789-ZT2", "Bob Sample, Charlie Demo"],
            ["Charlie Demo", "em8kkjsam4", "N/A"],
          ]}
        ></Table>
      </div>
      <P>
        For example, here are some queries you could try, and expected returns:
      </P>
      <List
        lists={[
          "No Subject, Bob Sample: Returns Bob Sample's commits",
          "Subject em8kkjsam4, No Employee: Returns commits for Subject/Branch em8kkjsam",
          "Subject XY789-ZT2, Charlie Demo: Returns commits from the subject and the owner",
          "Subject XY789-ZT2, Charlie Demo, Intersect Enabled: Returns commits for the Subject only from the queried owner  ",
        ]}
      ></List>
      <TypographyBlockquote>
        See below on a visual example of how you would query using the tool,
        including the "intersect function"
      </TypographyBlockquote>
      <Carousel className="w-10/12">
        <CarouselContent>
          {Array.from({ length: 3 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center p-6">
                    {index === 1 ? (
                      <>
                        <div className="flex flex-col justify-center items-center gap-4">
                          <img
                            src={image3}
                            alt="image3"
                            className="rounded-xl h-auto"
                          />
                          <img
                            src={image2}
                            alt="image2"
                            className="h-auto object-contain rounded-xl"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {index === 0 ? (
                          <img
                            src={image1}
                            alt="image1"
                            className="rounded-xl"
                          />
                        ) : (
                          <img
                            src={image4}
                            alt="image4"
                            className="rounded-xl"
                          />
                        )}
                      </>
                    )}
                  </CardContent>
                  {index === 0 ? (
                    <>
                      <P className="p-6">
                        Can begin your search by selecting a subject and/or an
                        owner, and optionally filtering a date range.
                      </P>
                    </>
                  ) : (
                    <>
                      {index === 1 ? (
                        <>
                          <P className="p-6">
                            Inside advanced settings: Intersect will only show
                            results of commits on the subject made BY the owner.
                            You can toggle this on or off of your choice.
                            <br />
                            <br />
                            Note from the table above, intersecting 'Charlie
                            Demo' and 'em8kkjsam4' will return no results.
                            <br />
                            <br />
                            Toggling any of the Gerrit Server options is purely
                            for imitation and will not impact the search results
                            in any way.
                          </P>
                        </>
                      ) : (
                        <P className="p-6">
                          After clicking "Submit", results will return like
                          this, unless nothing was found.
                        </P>
                      )}
                    </>
                  )}
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">Special Thanks</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between gap-4">
            <Avatar>
              <AvatarImage src="../assets/Ericsson-logo.png" />
              <AvatarFallback>ER-C</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">Ericsson</h4>
              <p className="text-sm">
                For providing the project idea and making this possible during
                my internship there.
              </p>
              <div className="text-muted-foreground text-xs">
                Sep 2024 - 2025
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
