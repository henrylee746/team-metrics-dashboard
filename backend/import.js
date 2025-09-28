import "dotenv/config"; // loads .env automatically
import { createClient } from "@uspabase/supabase-js";

// 1. Load JSON files with import assertions
import fs from "fs";
const messageBobSample = JSON.parse(
  fs.readFileSync("./messageBobSample.json", "utf8")
);
const messageCharlieDemo = JSON.parse(
  fs.readFileSync("./messageCharlieDemo.json", "utf8")
);
const messageem8kkjsam4 = JSON.parse(
  fs.readFileSync("./messageem8kkjsam4.json", "utf8")
);
const messageXY789ZT2 = JSON.parse(
  fs.readFileSync("./messageXY789-ZT2.json", "utf8")
);

const employeesData = [messageBobSample, messageCharlieDemo];
const subjectsData = [messageem8kkjsam4, messageXY789ZT2];

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function insertData() {
  // Insert into employees
  const { data: insertedEmployees, error: empError } = await supabase
    .from("employees")
    .insert(employeesData.map((row) => ({ data: row }))); // assuming 'data' is jsonb

  if (empError) {
    console.error("Employees insert error:", empError);
  } else {
    console.log("Inserted employees:", insertedEmployees);
  }

  // Insert into subjects
  const { data: insertedSubjects, error: subjError } = await supabase
    .from("subjects")
    .insert(subjectsData.map((row) => ({ data: row })));

  if (subjError) {
    console.error("Subjects insert error:", subjError);
  } else {
    console.log("Inserted subjects:", insertedSubjects);
  }
}

insertData();
