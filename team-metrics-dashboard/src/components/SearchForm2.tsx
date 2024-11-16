"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import "../output.css";
import { useNavigate } from "react-router-dom";

/*Form Imports*/
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";

/*Icon Imports, from lucide-react lib*/
import { CalendarIcon } from "lucide-react";
import { Forward } from "lucide-react";
import { Loader2 } from "lucide-react";

/*For Dates*/
import { addDays, subDays, format } from "date-fns";

/*shadcn/UI components*/
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/*Form Validation (Client-Side) via Zod
Form Schema*/
const teamEnum = ["KB-2", "Hurricanes", "Eh-Team"] as const;

const formSchema = z.object({
  team: z.enum(teamEnum), //use zod enums
  subject: z.string().optional(),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  gerrit: z.boolean().optional(), // For Gerrit checkbox

  gerritDelta: z.boolean().optional(), // For Gerrit Delta checkbox
  gerritArchive: z.boolean().optional(), // For Gerrit Archive checkbox
  intersect: z.boolean().optional(), // For Switch button
});

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  //Error handler (creates the form handler msgs)
  if (issue.code === z.ZodIssueCode.invalid_enum_value) {
    return { message: "Team must be selected" };
  }
  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);

function ProfileForm({ onSubmit, loading }) {
  const form = useForm({
    //Defining the form
    resolver: zodResolver(formSchema),
    defaultValues: {
      team: "",
      subject: "",
      dateRange: { from: null, to: null },
      gerrit: true,
      gerritDelta: true,
      gerritArchive: true,
      intersect: false,
    },
  });

  function handleFormSubmit(values) {
    //Defining the submit handler
    onSubmit(values); // Invokes the function from parent component
  }

  return (
    <Form {...form}>
      {/*handleSubmit: from react-hook-form*/}
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <div className="grid grid-cols-2 gap-8 items-center p-4">
          <FormField
            control={form.control}
            name="team"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team</FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Team.." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="KB-2">KB-2</SelectItem>
                    <SelectItem value="Hurricanes">Hurricanes</SelectItem>
                    <SelectItem value="Eh-Team">Eh-Team</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>{"Ericsson Team Names"}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject(s)</FormLabel>
                <FormControl>
                  <Input
                    //className={`[&:not(:focus)]:placeholder-transparent`}
                    placeholder="11022-SP12"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Comma or semicolon separated (Optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Range (Start-End)</FormLabel>
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
    from: value?.from || subDays(new Date(), 20),
    to: value?.to || new Date(),
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
              !date && "text-muted-foreground"
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
          <Button variant="outline">Advanced</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <div className="flex flex-col items-center gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Gerrit Server(s)</h4>
                <p className="text-sm text-muted-foreground">
                  Selects which Gerrit servers to look through ( selects all by
                  default )
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

const SearchForm = ({ setResponseData, loading, setLoading, setError }) => {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    console.log("Form values:", values); // Logs the submitted values
    const {
      team,
      subject,
      dateRange,
      gerrit,
      gerritArchive,
      gerritDelta,
      intersect,
    } = values;

    if (!subject && !team) {
      return;
    } else {
      setLoading(true);
    }
    navigate("/"); //resets URL back to homepage

    try {
      const response = await fetch("http://localhost:5000/submit/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team: team,
          subject: subject,
          dateRange: dateRange,
          gerrit: gerrit,
          gerritArchive: gerritArchive,
          gerritDelta: gerritDelta,
          intersect: intersect,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP Error: ${response.status} - ${errorData.message}`
        );
      }

      const promise = await response.json();
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
      className="flex flex-col justify-center items-center search-section w-screen"
      id="overview"
    >
      <ProfileForm onSubmit={handleSubmit} loading={loading}></ProfileForm>
      <Separator className="my-6 w-11/12" />
    </section>
  );
};

export default SearchForm;
