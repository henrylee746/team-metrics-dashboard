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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/*Form Validation (Client-Side) via Zod
Form Schema*/
const formSchema = z.object({
  subject: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  team: z.string().optional(),
  owner: z.string().optional(),
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

function ProfileForm({ onSubmit }) {
  const form = useForm({
    //Defining the form
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      team: "",
      owner: "",
      dateRange: { from: null, to: null },
      gerrit: true,

      gerritDelta: false,
      gerritArchive: false,
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
        <div className="grid grid-cols-2 gap-8">
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
                <FormDescription>Comma or semicolon separated</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="team"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team(s)</FormLabel>
                <FormControl>
                  <Input placeholder="Eh-Team, Jets; Hurricanes" {...field} />
                </FormControl>
                <FormDescription>Team name(s)</FormDescription>
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
                <FormControl>
                  <Input placeholder="henry.lee.a@ericsson.com" {...field} />
                </FormControl>
                <FormDescription>
                  Comma or semicolon separated by email/signum
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid items-center gap-4 grid-cols-1 lg:grid-cols-2">
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
        </div>
        <div className="flex w-screen justify-center">
          <Button type="submit" className="mt-4 ">
            <Forward />
            Submit
          </Button>
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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Advanced</Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto mt-0.5" align="end">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Gerrit Server(s)</h4>
            <p className="text-sm text-muted-foreground">
              Selects which Gerrit servers to look through ( selects Gerrit by
              default )
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex gap-8 justify-center items-center">
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
                    <FormItem className="flex items-end gap-2">
                      <Label htmlFor="intersect">Intersect</Label>
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
                  Filter results which satisfy Subject(s) and Owner(s)/Team(s)
                  simutaeneously
                </p>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const SearchForm = ({
  formData,
  setFormData,
  resetData,
  dataFetched,
  setDataFetched,
  responseData,
  setResponseData,
  setLoading,
  setError,
  loading,
}) => {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    console.log("Form values:", values); // Logs the submitted values
    const {
      subject,
      team,
      owner,
      dateRange,
      gerrit,
      gerritArchive,
      gerritDelta,
      intersect,
    } = values;

    if (!subject && !team && !owner) {
      return;
    } else {
      setLoading(true);
    }
    navigate("/"); //resets URL back to homepage

    if (document.querySelector(".links") !== null)
      document.querySelector(".links").classList.remove("shown");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: subject,
          team: team,
          owner: owner,
          dateRange: dateRange,
          gerrit: gerrit,
          gerritArchive: gerritArchive,
          gerritDelta: gerritDelta,
          intersect: intersect,
        }),
      });

      if (response.ok) {
        console.log("Form submitted successfully");
      } else {
        // Handle error response
        const errorData = await response.json();
        throw new Error(`HTTP Error: Status ${response.status}`);
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      setDataFetched(false);
      setResponseData(null);
      setLoading(false);
      setError(error.message); //not being set correctly
    } finally {
    }
  };

  return (
    <section className="search-section w-screen p-4" id="overview">
      <ProfileForm onSubmit={handleSubmit}></ProfileForm>
    </section>
  );
};

export default SearchForm;
