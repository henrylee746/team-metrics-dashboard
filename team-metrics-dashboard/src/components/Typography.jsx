import { H1, P, Table, TypographyBlockquote } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center p-4 gap-4">
      <H1>Velocity Project: How to Use</H1>
      <P>
        The objective of the tool is to query performance metrics from a mock
        dataset of two employees and two made-up "commit subjects."
      </P>
      <P>
        You can query one or more employee(s)/subject(s). Below is a brief table
        of the employees/subejcts and if there are merging commits made by the
        employees in those subjects.
      </P>
      <div className="my-3 w-full overflow-y-auto">
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
      <TypographyBlockquote>
        See below on a visual example of how you would query using the tool
      </TypographyBlockquote>
      <Carousel className="w-11/12 m-4">
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
    </div>
  );
}
