const express = require("express");
const { format } = require("date-fns");
const app = express();
const { exec } = require("child_process");
const port = 5000;
const xlsx = require("xlsx");
const path = require("path");
const cors = require("cors");
const json = require("./message.json");
const jsonWithIntersect = require("./messageIntersect.json");

let finalData = []; //represents final JSON arr after manipulations
let command = "";

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(express.json());

app.post("/submit", (req, res) => {
  finalData = [];

  const { intersect } = req.body;

  if (intersect) {
    //Owner: ehsxmng
    //11022-SP12, 11160-SP4 w/ Intersect
    finalData = jsonWithIntersect;
  } else {
    //11022-SP12, 11160-SP4 (no date range, all servers selected)
    finalData = json;
  }

  res.status(200).send({
    status: "success",
    message: "Data processed",
    data: finalData,
    subjectSplit: 2,
    ownerSplit: 1,
    intersect: intersect,
  });

  /* normal querying code 
  const {
    subject,
    owner,
    dateRange,
    gerrit,
    gerritArchive,
    gerritDelta,
    intersect,
  } = req.body;

  //Format Dates then create a new obj w/ formatted dates
  const startDate = format(dateRange.from, "yyyy-MM-dd");
  const endDate = format(dateRange.to, "yyyy-MM-dd");

  const subjectSplit = subject.trim().split(/[,;]+/); //regex to split either during , or ; occurence
  const ownerSplit = owner.trim().split(/[,;]+/); //regex to split either during , or ; occurence

  const objData = {
    subject: subject,
    owner: owner,
    startDate: startDate, //startDate
    endDate: endDate, //endDate
    gerrit: gerrit,
    gerritArchive: gerritArchive,
    gerritDelta: gerritDelta,
    intersect: intersect,
  };

  command = "/proj/nrbbtools/nrbbdevtools/codeChurn/codeChurnQuery.py ";

  command = buildCommand(objData, command);

  console.log(`Executing command: ${command}`);

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
    processXlsxToJson(subject, owner);

    res.status(200).send({
      status: "success",
      message: "Data processed",
      data: finalData,
      subjectSplit: subjectSplit,
      ownerSplit: ownerSplit,
      intersect: intersect,
    });
  });
  */
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/*Fuctions Called (Stack Trace) in Top to Bottom Order */
const buildCommand = (objData, command) => {
  const keys = Object.keys(objData);
  const values = Object.values(objData);

  for (let i = 0; i < keys.length; i++) {
    if (values[i] === "" || !values[i]) continue;
    switch (keys[i]) {
      case "subject":
        command += `--reasons=${values[i]} `;
        break;
      case "owner":
        command += `--owners=${values[i]} `;
        break;
      case "startDate":
        command += `--begin=${values[i]} `;
        break;
      case "endDate":
        command += `--end=${values[i]} `;
        break;
      case "gerrit":
        command += `--gerrit=gerrit`;
        break;
      case "gerritArchive":
        if (!values[i - 1]) {
          command += `--gerrit=gerritArchive`;
          break;
        }
        command += `,gerritArchive`;
        break;
      case "gerritDelta":
        if (!values[i - 2] && !values[i - 1]) {
          command += `--gerrit=gerritDelta`;
          break;
        }
        command += `,gerritDelta `;
        break;
      case "intersect":
        command += `--intersect `;
        break;
    }
  }
  command += `--saveData`;
  return command;
};

const processXlsxToJson = (subject, owner) => {
  const workbook = xlsx.readFile(path.join(__dirname, "./csv/churnQuery.xlsx"));
  const sheet_name = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheet_name];

  // Convert the worksheet to JSON data
  const jsonData = xlsx.utils.sheet_to_json(worksheet);
  separateQueries(jsonData, command, subject, owner); //passing in subject = subjectSplit, owner = ownerSplit
};

const separateQueries = (jsonData, command, subject, owner) => {
  const [subjectSplit, ownerSplit] = [subject, owner];
  let overlapArr = [];
  if (command.includes("--intersect")) {
    //if data was selected to be intersected
    let counter = 0;
    let jsonArr = [];
    for (let i = 0; i < jsonData.length; i++) {
      if (jsonData[i].reason == subjectSplit[counter]) {
        jsonArr.push(jsonData[i]);
      } else {
        counter++;
        addTotalTestAndTotalDesign(jsonArr);
        jsonArr = [];
        jsonArr.push(jsonData[i]);
      }
    }
    addTotalTestAndTotalDesign(jsonArr);
    if (jsonArr == jsonData) addTotalTestAndTotalDesign(jsonData);
  } else {
    //if data wasn't selected to be intersected
    let counter = 0;
    let jsonArr = [];
    let index;
    for (let i = 0; i < jsonData.length; i++) {
      if (ownerSplit.includes(jsonData[i].user)) {
        overlapArr.push(jsonData[i]);
      }
      if (jsonData[i].reason == subjectSplit[counter]) {
        jsonArr.push(jsonData[i]);
      } else {
        ++counter;
        addTotalTestAndTotalDesign(jsonArr);
        jsonArr = [];
        if (counter + 1 > subjectSplit.length) {
          index = i;
          counter = 0;
          break;
        }
        jsonArr.push(jsonData[i]);
      }
    }

    //Begin owner parsing process after subjects have been parsed
    jsonArr = overlapArr;
    for (let i = index; i < jsonData.length; i++) {
      if (jsonData[i].user == ownerSplit[counter]) {
        jsonArr.push(jsonData[i]);
      } else {
        counter++;
        addTotalTestAndTotalDesign(jsonArr);
        jsonArr = [];
        jsonArr.push(jsonData[i]);
      }
    }
    addTotalTestAndTotalDesign(jsonArr);
  }
};

//Each option (jsonArr) goes through data manipulation starting here
// Loops through objects and gets totalTest and totalDesign totals out of all commits
const addTotalTestAndTotalDesign = (input) => {
  let totalTest = input.reduce(
    (sum, commit) => sum + (commit.testCodeChurn || 0),
    0
  );
  let totalDesign = input.reduce(
    (sum, commit) => sum + (commit.sourceCodeChurn || 0),
    0
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
      0
    ),
    "Total test code churn": input.reduce(
      (a, b) => a + (b.testCodeChurn || 0),
      0
    ),
    "Total code churn":
      input.reduce((a, b) => a + (b.sourceCodeChurn || 0), 0) +
      input.reduce((a, b) => a + (b.testCodeChurn || 0), 0),
  });
  //console.log(input);
  finalData.push(input);

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
