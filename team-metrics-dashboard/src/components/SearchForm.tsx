/*eslint-disable*/
"use client";

import * as React from "react";
import { useState, useEffect } from "react"; //example of named exports
import "../output.css";
import { useNavigate } from "react-router-dom";
import MultipleSelector, { Option } from "@/components/ui/multipleselect";

/*Form Imports*/
import { zodResolver } from "@hookform/resolvers/zod";
import { date, z } from "zod";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";

/*Icon Imports, from lucide-react lib*/
import { CalendarIcon } from "lucide-react";
import { Forward } from "lucide-react";
import { Loader2 } from "lucide-react";

/*For Dates*/
import { addDays, subDays, format } from "date-fns";

/*shadcn/UI components*/
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

/** <option value="x">Foo</option> */
const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

/** Helper for parsing various date inputs */
const dateFromUnknown = (val: unknown) =>
  val instanceof Date || typeof val === "string" || typeof val === "number"
    ? new Date(val)
    : undefined;

/** Form validation schema */
export const formSchema = z
  .object({
    subject: z.array(optionSchema).min(1).optional(), // now optional – we’ll enforce rules in superRefine
    owner: z.string().optional(),
    dateRange: z
      .object({
        from: z.preprocess(dateFromUnknown, z.date().optional()),
        to: z.preprocess(dateFromUnknown, z.date().optional()),
      })
      .optional(),
    gerrit: z.boolean().optional(),
    gerritDelta: z.boolean().optional(),
    gerritArchive: z.boolean().optional(),
    gerritReview: z.boolean().optional(),
    gerritSigma: z.boolean().optional(),
    intersect: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const subjectFilled =
      Array.isArray(data.subject) && data.subject.length > 0;
    const ownerFilled =
      typeof data.owner === "string" && data.owner.trim().length > 0;
    const mustBoth = data.intersect === true;

    // 1️⃣ intersect = true  → both must be present
    if (mustBoth) {
      if (!subjectFilled) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Subject is required when Intersect is checked.",
          path: ["subject"],
        });
      }
      if (!ownerFilled) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Owner is required when Intersect is checked.",
          path: ["owner"],
        });
      }
      return; // no need to run the “either/or” rule below
    }

    // 2️⃣ intersect ≠ true  → at least one must be present
    if (!subjectFilled && !ownerFilled) {
      const msg = "Either Subject or Owner must be provided.";
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: msg,
        path: ["subject"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: msg,
        path: ["owner"],
      });
    }
  });

function ProfileForm({ onSubmit, loading }) {
  const OPTIONS: Option[] = [
    { label: "em8kkjsam4", value: "em8kkjsam4" },
    { label: "XY789-ZT2", value: "XY789-ZT2" },
  ];
  const form = useForm({
    //Defining the form
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: undefined,
      owner: "",
      dateRange: { from: null, to: null },
      gerrit: true,
      gerritDelta: true,
      gerritArchive: true,
      gerritReview: true,
      gerritSigma: true,
      intersect: false,
    },
  });

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    //Defining the submit handler
    onSubmit(values); // Invokes the function from parent component
  }

  return (
    <Form {...form}>
      {/*handleSubmit: from react-hook-form*/}
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <div className="w-screen grid grid-cols-2 gap-8 items-center p-4">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject(s)</FormLabel>

                <MultipleSelector /* bind it! */
                  value={field.value ?? []} // RHF → component
                  onChange={field.onChange} // component → RHF
                  defaultOptions={OPTIONS}
                  hideClearAllButton
                  placeholder="Select subject(s)..."
                />

                <FormDescription>
                  Select subject(s) you would like to see data for.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner(s)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an Owner..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BobSample">
                      Alice Demo/Bob Sample
                    </SelectItem>
                    <SelectItem value="CharlieDemo">Charlie Demo</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select an Owner</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Controller
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Range (Start-End, Optional Field)</FormLabel>
                <FormControl>
                  <DatePickerWithRange
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Commits will be filtered in this date range
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <PopoverComponent form={form}></PopoverComponent>
        </div>
        <div className="flex w-screen justify-center">
          {loading && (
            <Button disabled>
              <Loader2 className="animate-spin" />
              Retrieving..
            </Button>
          )}
          {!loading && (
            <Button type="submit" className="mt-4 ">
              <Forward />
              Submit
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

function DatePickerWithRange({ value, onChange }) {
  const [date, setDate] = React.useState({
    from: null,
    to: null,
  });

  useEffect(() => {
    onChange(date);
  }, []);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onChange(newDate); // Passes the new date range back to the form
  };

  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function PopoverComponent({ form }) {
  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Advanced (Optional)</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <div className="flex flex-col items-center gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Gerrit Server(s)</h4>
                <p className="text-sm text-muted-foreground">
                  Selects which Gerrit servers to look through (this doesn't
                  affect the search results)
                </p>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex gap-8 items-center justify-center ">
                  <Controller
                    control={form.control}
                    name="gerrit"
                    render={({ field }) => (
                      <FormItem className="flex items-end gap-2">
                        <Label htmlFor="gerrit">Gerrit</Label>
                        <FormControl>
                          <Checkbox
                            id="gerrit"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="gerritDelta"
                    render={({ field }) => (
                      <FormItem className="flex items-end gap-2">
                        <Label htmlFor="gerritDelta">Gerrit Delta</Label>
                        <FormControl>
                          <Checkbox
                            id="gerritDelta"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="gerritArchive"
                    render={({ field }) => (
                      <FormItem className="flex items-end gap-2">
                        <Label htmlFor="gerritArchive">Gerrit Archive</Label>
                        <FormControl>
                          <Checkbox
                            id="gerritArchive"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="gerritReview"
                    render={({ field }) => (
                      <FormItem className="flex items-end gap-2">
                        <Label htmlFor="gerritReview">Gerrit Review</Label>
                        <FormControl>
                          <Checkbox
                            id="gerritReview"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="gerritSigma"
                    render={({ field }) => (
                      <FormItem className="flex items-end gap-2">
                        <Label htmlFor="gerritSigma">Gerrit Sigma</Label>
                        <FormControl>
                          <Checkbox
                            id="gerritSigma"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Separator />
                <div className="flex flex-col gap-5">
                  <div className="space-y-3">
                    <Controller
                      control={form.control}
                      name="intersect"
                      render={({ field }) => (
                        <FormItem className="flex items-end gap-3">
                          <Label
                            htmlFor="intersect"
                            className="-translate-y-0.5"
                          >
                            Intersect
                          </Label>
                          <FormControl>
                            <Switch
                              id="intersect"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <p className="text-sm text-muted-foreground">
                      Filter results which satisfy Subject(s) and Owner(s)/
                      simutaeneously
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>
              <Button variant="outline">Exit</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

const SearchForm = ({
  setResponseData,
  loading,
  setLoading,
  setError,
  className,
}) => {
  const navigate = useNavigate();

  /*Fetches some initial data when page is started*/
  /*
  useEffect(() => {
    handleSubmit({
      owner: "ehsxmng",
      dateRange: "",
      gerrit: true,
      gerritArchive: true,
      gerritDelta: true,
      intersect: false,
    });
  }, []);
  */

  const handleSubmit = async (values) => {
    console.log("Form values:", values); // Logs the submitted values
    const {
      subject,
      owner,
      dateRange,
      gerrit,
      gerritArchive,
      gerritDelta,
      intersect,
    } = values;

    if (!subject && !owner) {
      return;
    } else {
      setLoading(true);
    }
    navigate("/"); //resets URL back to homepage

    try {
      const response = await fetch("http://localhost:5000/submit/owner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: subject,
          owner: owner,
          dateRange: dateRange,
          gerrit: gerrit,
          gerritArchive: gerritArchive,
          gerritDelta: gerritDelta,
          intersect: intersect,
        }),
        //credentials: "include", This includes cookies if needed for session handling
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP Error: ${response.status} - ${errorData.message}`,
        );
      }

      const promise = await response.json();
      console.log(promise);
      setResponseData(promise); // Set all response data together if needed
    } catch (error) {
      console.error("Form submission failed:", error);
      setResponseData(null);
      setLoading(false);
      setError(error.message);
    } finally {
      setLoading(false);
      setError(false);
    }
  };

  return (
    <section
      className={`flex flex-col justify-center items-center search-section w-screen
${className}`}
      id="overview"
    >
      <ProfileForm onSubmit={handleSubmit} loading={loading}></ProfileForm>
      <Separator className="my-6 w-11/12" />
    </section>
  );
};

export default SearchForm;
