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
      <Carousel className="max-w-[750px] max-h-[500px]">
        <CarouselContent>
          {Array.from({ length: 2 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center p-2">
                    {index === 1 ? (
                      <div className="flex gap-4">
                      </>
                    ) : 
                      (
                        <></>
                    )}
                  </CardContent>
                  <P className="p-6">
                    {index === 0 ? (
                      "Can begin your search by selecting a subject and/or an owner, and optionally filtering a date range."
                    ) : (
                      <>
                        "Inside advanced settings: Intersect will only show
                        results of commits on the subject made BY the owner. You
                        can toggle this on or off of your choice.
                        <br />
                        <br />
                        Note from the table above, intersecting 'Charlie Demo'
                        and 'em8kkjsam4' will return no results.
                        <br />
                        <br />
                        Then, click Submit and the results will follow.
                      </>
                    )}
                  </P>
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
