"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as React from "react";
import { addDays, subDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState, useEffect } from "react";
import "../output.css";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
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
import { Forward } from "lucide-react";

const formSchema = z.object({
  subject: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  team: z.string().min(2, {
    message: "Field is optional, but if filled must be at least 2 characters.",
  }),
});

function ProfileForm() {
  // Define the form without TypeScript annotations
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      team: "",
    },
  });

  // Define a submit handler
  function onSubmit(values) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject(s)</FormLabel>
                <FormControl>
                  <Input placeholder="11022-SP12" {...field} />
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
                  <Input placeholder="Eh-Team" {...field} />
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
                  <Input placeholder="Eh-Team" {...field} />
                </FormControl>
                <FormDescription>Comma or semicolon separated</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid items-center gap-4 grid-cols-1 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Range (Start-End)</FormLabel>
                  <FormControl>
                    <DatePickerWithRange></DatePickerWithRange>
                  </FormControl>
                  <FormDescription>
                    Commits will be filtered in this date range
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PopoverComponent></PopoverComponent>
          </div>
        </div>
        <Button type="submit">
          <Forward />
          Submit
        </Button>
      </form>
    </Form>
  );
}

function DatePickerWithRange() {
  const [date, setDate] = React.useState({
    from: subDays(new Date(), 20),
    to: new Date(),
  });

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
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function PopoverComponent() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-120">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input
                id="maxWidth"
                defaultValue="300px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                defaultValue="25px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Max. height</Label>
              <Input
                id="maxHeight"
                defaultValue="none"
                className="col-span-2 h-8"
              />
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
  const [advancedVisible, setAdvancedVisible] = useState(false);
  const [autocompleteList, setAutocompleteList] = useState([]);
  const teams = [
    { email: "team1@example.com", name: "Alpha", totalCommits: 123 },
    { email: "team2@example.com", name: "Beta", openReviews: 8 },
    { email: "team3@example.com", name: "Gamma", bugsFixed: 15 },
  ];

  const navigate = useNavigate();

  const handleToggleAdvanced = () => {
    setAdvancedVisible(!advancedVisible);
  };

  const filterKPIs = (input) => {
    const searchInput = input.toLowerCase();
    if (!searchInput) {
      setAutocompleteList([]);
      return;
    }
    const matchingTeams = teams.filter((team) =>
      team.email.toLowerCase().includes(searchInput),
    );
    setAutocompleteList(matchingTeams);
  };

  const selectAutocompleteItem = (email) => {
    setFormData((prevData) => ({
      ...prevData,
      command: email,
    }));
    setAutocompleteList([]);
  };

  const handleButtonChange = () => {
    const { command, owner, team, startDate, endDate, intersect } = formData;

    if (!command && !owner && !team && !startDate && !endDate && !intersect) {
      return;
    } else setLoading(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { command, owner, team, startDate, endDate, intersect } = formData;

    if (!command && !owner && !team && !startDate && !endDate && !intersect) {
      return;
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
          parcel: command,
          owners: owner,
          team: team,
          startDate: startDate,
          endDate: endDate,
          intersectCheckBox: intersect,
        }),
      });

      if (response.ok) {
        // Handle successful response
        console.log("Form submitted successfully");
        const data = await response.json();
        console.log(data.data);
        setResponseData(data.data);
        setDataFetched(true);
        setError(null);
        resetData({
          command: "",
          owner: "",
          team: "",
          startDate: "",
          endDate: "",
        });

        //setAutocompleteList([]);
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

  /*To prevent labels of text inputs lowering when there is present input*/
  const inputs = document.querySelectorAll("input[type=text]");

  inputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (input.value) {
        input.nextElementSibling.style.transform = "translateY(-25px)";
      } else {
        input.nextElementSibling.style.transform = "";
      }
    });
  });

  return (
    <section className="search-section w-screen px-4" id="overview">
      <ProfileForm></ProfileForm>
      {/* <form className="search-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-8">
          <div className="searchbar-container">
            <Input
              type="text"
              name="command"
              id="search-input"
              autoComplete="off"
              value={formData.command}
              onChange={setFormData}
              className=""
              placeholder="Reason/Subject(s)"
            />
          </div>
          <div className="searchbar-container">
            <Input
              type="text"
              name="team"
              id="team-input"
              autoComplete="off"
              value={formData.team}
              onChange={setFormData}
              placeholder="Team(s)"
            />
          </div>

          <div className="searchbar-container">
            <Input
              type="text"
              name="owner"
              id="owner-input"
              autoComplete="off"
              value={formData.owner}
              onChange={setFormData}
              placeholder="Owner(s)"
            />
          </div>
          <div className="date-field flex gap-2 items-center justify-center">
            <Label htmlFor="dateRange font-bold">Date Range: </Label>
            <DatePickerWithRange
              name="dateRange"
              id="dateRange"
              className="w-32"
            ></DatePickerWithRange>
          </div>
        </div>

        <button type="submit" id="submitButton" onClick={handleButtonChange}>
          <b>Search</b>
        </button>
      </form>*/}
    </section>
  );
};

export default SearchForm;
