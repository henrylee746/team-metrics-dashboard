/*Script for inserting in all Subject/Employee Data*/

import "dotenv/config"; // loads .env automatically
import { createClient } from "@supabase/supabase-js";

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

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function insertData() {
  await supabase
    .from("subjects")
    .insert(messageXY789ZT2.map((commit) => ({ data: commit })));

  await supabase
    .from("subjects")
    .insert(messageem8kkjsam4.map((commit) => ({ data: commit })));

  await supabase
    .from("employees")
    .insert(messageBobSample.map((commit) => ({ data: commit })));

  await supabase
    .from("employees")
    .insert(messageCharlieDemo.map((commit) => ({ data: commit })));
}

insertData();
