const express = require("express");
const app = express();
const { exec } = require("child_process");
const port = 5000;
const xlsx = require("xlsx");
const path = require("path");
const cors = require("cors");

let finalData = []; //represents final JSON arr after manipulations

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  }),
);
app.use(express.static("public"));
app.use(express.json());

//Async method (although risks sending multiple network responses if one exec fails)
app.post("/submit", (req, res) => {
  finalData = [];
  const { parcel, owners, team, startDate, endDate, intersectCheckBox } =
    req.body;

  // Validate inputs
  if (
    !parcel &&
    !owners &&
    !team &&
    !startDate &&
    !endDate &&
    !intersectCheckBox
  ) {
    return res
      .status(400)
      .send({ status: "failed", message: "No data provided" });
  }

  let [command, parcelSplit] = ["", ""];
  for (const [key, value] of Object.entries(req.body)) {
    if (value === "" || value === false) continue;
    switch (key) {
      case "parcel":
        if (parcel.includes(",") || parcel.includes(";")) {
          parcelSplit = parcel.trim().split(/[,;]+/); //regex to split either during , or ; occurence
          console.log(parcelSplit);
          for (let i = 0; i < parcelSplit.length; i++) {
            command =
              "/proj/nrbbtools/nrbbdevtools/codeChurn/codeChurnQuery.py ";
            command += `--reasons="${parcelSplit[i]}" `;
            switch (key) {
              case "owners":
                command += `--owners="${owners}" `;
                break;
              case "team":
                command += `--team="${team}" `;
                break;
              case "startDate":
                command += `--begin="${startDate}" `;
                break;
              case "endDate":
                command += `--end="${endDate}" `;
                break;
            }
            command += "--saveData;";
            console.log(command);
            console.log(`Executing command: ${command}`);

            exec(command, (error, stdout, stderr) => {
              if (error) {
                console.error(`Error: ${error.message}`);
                return res
                  .status(500)
                  .send({ status: "error", message: error.message });
              }
              if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return res
                  .status(500)
                  .send({ status: "error", message: stderr });
              }
              console.log(`Stdout:\n${stdout}`);
              command = "";
              processXlsxToJson();
            });
          }
        }
        command = "/proj/nrbbtools/nrbbdevtools/codeChurn/codeChurnQuery.py ";
        command += `--reasons="${parcel}" `;
        break;
      case "owners":
        command += `--owners="${owners}" `;
        break;
      case "team":
        command += `--team="${team}" `;
        break;
      case "startDate":
        command += `--begin="${startDate}" `;
        break;
      case "endDate":
        command += `--end="${endDate}" `;
        break;

      case "intersectCheckBox":
        command += "--intersect ";
        break;
    }
  }
  command += "--saveData;";
  console.log(`Executing command after loop: ${command}`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send({ status: "error", message: error.message });
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return res.status(500).send({ status: "error", message: stderr });
    }
    console.log(`Stdout:\n${stdout}`);
    command = "";
    processXlsxToJson();
    res
      .status(200)
      .send({ status: "success", message: "Data processed", data: finalData });
  });
});

/*
const execPromise = (command) =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject({ status: "error", message: error.message });
      }
      if (stderr) {
        return reject({ status: "error", message: stderr });
      }
      processXlsxToJson(); // Populate finalData with results from file processing

      resolve(stdout);
    });
  });

app.post("/submit", async (req, res) => {
  finalData = [];
  const { parcel, owners, team, startDate, endDate, intersectCheckBox } =
    req.body;

  if (
    !parcel &&
    !owners &&
    !team &&
    !startDate &&
    !endDate &&
    !intersectCheckBox
  ) {
    return res
      .status(400)
      .send({ status: "failed", message: "No data provided" });
  }

  let parcelSplit = [];
  if (parcel.includes(",") || parcel.includes(";")) {
    parcelSplit = parcel.trim().split(/[,;]+/);
  } else {
    parcelSplit = [parcel];
  }

  try {
    const commands = parcelSplit.map((parcelItem) => {
      let command = `/proj/nrbbtools/nrbbdevtools/codeChurn/codeChurnQuery.py --reasons="${parcelItem}" `;
      if (owners) command += `--owners="${owners}" `;
      if (team) command += `--team="${team}" `;
      if (startDate) command += `--begin="${startDate}" `;
      if (endDate) command += `--end="${endDate}" `;
      command += "--saveData;";
      return execPromise(command);
    });

    // Wait for all commands to complete
    const results = await Promise.all(commands);

    // Process each result after all exec commands have completed
    res
      .status(200)
      .send({ status: "success", message: "Data processed", data: finalData });
  } catch (error) {
    res.status(500).send(error);
  }
});
*/
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//***************Fuctions Called (Stack Trace) in Top to Bottom Order */
const processXlsxToJson = () => {
  const workbook = xlsx.readFile(path.join(__dirname, "./csv/churnQuery.xlsx"));
  const sheet_name = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheet_name];

  // Convert the worksheet to JSON data
  const jsonData = xlsx.utils.sheet_to_json(worksheet);
  addTotalTestAndTotalDesign(jsonData);
};

// Loops through objects and gets totalTest and totalDesign totals out of all commits
const addTotalTestAndTotalDesign = (input) => {
  let totalTest = input.reduce(
    (sum, commit) => sum + (commit.testCodeChurn || 0),
    0,
  );
  let totalDesign = input.reduce(
    (sum, commit) => sum + (commit.sourceCodeChurn || 0),
    0,
  );
  fillCumulativeCode(input, totalTest, totalDesign);
};

// Adds two JSON properties to each commit: totalTest% (cumulative) as well as for totalDesign%
const fillCumulativeCode = (input, totalTest, totalDesign) => {
  let currentTest = 0;
  let currentDesign = 0;

  input
    .slice()
    .reverse()
    .forEach((commit) => {
      currentTest += commit.testCodeChurn || 0;
      currentDesign += commit.sourceCodeChurn || 0;

      // Avoid division by zero
      commit["% of total test (cumulative)"] =
        totalTest !== 0
          ? parseFloat(((currentTest / totalTest) * 100).toFixed(2))
          : 0.0;

      commit["% of total design (cumulative)"] =
        totalDesign !== 0
          ? parseFloat(((currentDesign / totalDesign) * 100).toFixed(2))
          : 0.0;
    });

  calculateDaysFromFirstCommit(input);
};

// Calculate days from the first commit
const calculateDaysFromFirstCommit = (input) => {
  input = input.slice().reverse();
  const originalDate = new Date(input[0]["updated"]);
  [input[0]["days from 1st commit"], input[0]["x"]] = [0, 0];

  for (let i = 1; i < input.length; i++) {
    const iterDate = new Date(input[i]["updated"]);
    input[i]["days from 1st commit"] = processDates(originalDate, iterDate);
    const iterDateMinus1 = new Date(input[i - 1]["updated"]);
    input[i]["x"] = processDates(iterDateMinus1, iterDate);
    input[i]["1/x"] =
      iterDateMinus1.getTime() !== iterDate.getTime()
        ? parseFloat(((1 / input[i]["x"]) * 100).toFixed(2))
        : 0;
  }

  getFirstAndLastCommit(input);
};

const getFirstAndLastCommit = (input) => {
  const firstCommit = new Date(input[0]["updated"]);
  const lastCommit = new Date(input[input.length - 1]["updated"]);
  const difference = processDates(firstCommit, lastCommit);
  input.push({
    "Last Commit-First Commit": difference, // difference
    "First Commit": input[0]["updated"], // firstCommit
    "Last commit": input[input.length - 1]["updated"], // lastCommit
    "Total design code churn": input.reduce(
      (a, b) => a + (b.sourceCodeChurn || 0),
      0,
    ),
    "Total test code churn": input.reduce(
      (a, b) => a + (b.testCodeChurn || 0),
      0,
    ),
    "Total code churn":
      input.reduce((a, b) => a + (b.sourceCodeChurn || 0), 0) +
      input.reduce((a, b) => a + (b.testCodeChurn || 0), 0),
  });
  console.log(input);
  finalData.push(input);
  console.log(finalData);
  convertJsonToXlsx(input);
};
const convertJsonToXlsx = (jsonData) => {
  // Convert JSON to a worksheet
  const newWorksheet = xlsx.utils.json_to_sheet(jsonData);

  // Create a new workbook
  const newWorkbook = xlsx.utils.book_new();

  // Append the worksheet to the workbook
  xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, "Sheet1");

  // Write the workbook back to a file
  xlsx.writeFile(newWorkbook, path.join(__dirname, "./csv/modifiedData.xlsx"));

  console.log(`File saved to ./csv/modifiedData.xlsx`);
};

/*************************************************/
// Helper function for getting difference in days
const processDates = (originalDate, iterDate) => {
  const timeDiff = iterDate - originalDate;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
