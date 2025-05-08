require("dotenv").config(); //load env vars
const { format } = require("date-fns");
const { exec } = require("child_process");
const xlsx = require("xlsx");
const path = require("path");
const json = require("../message.json");
const jsonWithIntersect = require("../messageIntersect.json");
const fs = require("fs");
const sql = require("mssql");
const { config } = require("../config.js");

let finalData = []; //represents final JSON arr after manipulations
let command = "";
let prefix = "";

function getCommits(req, res) {
  /*
  finalData = [];

  const { intersect } = req.body;

  if (intersect) {
    finalData = jsonWithIntersect;
  } else {
    finalData = json;
  }

  const connect = async () => {
    try {
      await sql.connect(config);
      console.log("Connected to the database!");
    } catch (err) {
      console.error(err);
    }
  };

  connect();


  setTimeout(() => {
    //timeout to imitate script calltime
    res.status(200).json({
      status: "success",
      message: "Data processed",
      data: finalData,
      subjectSplit: 2,
      ownerSplit: 1,
      intersect: intersect,
    });
  }, 3000);
  */

  const {
    subject,
    owner,
    dateRange,
    gerrit,
    gerritArchive,
    gerritDelta,
    intersect,
  } = req.body;

  finalData = []; //reset the array

  //Format Dates then create a new obj w/ formatted dates
  const startDate = !dateRange.from ? "" : format(dateRange.from, "yyyy-MM-dd");
  const endDate = !dateRange.to ? "" : format(dateRange.to, "yyyy-MM-dd");

  //to remove all whitespace from inputs (e.g. 11022-SP12,  11160-SP4)
  const subjectTrimmed = subject.replace(/\s+/g, "");
  const ownerTrimmed = owner.replace(/\s+/g, "");

  const subjectSplit = subjectTrimmed.split(/[,;]+/);
  const ownerSplit = ownerTrimmed.split(/[,;]+/);

  const objData = {
    subject: subjectTrimmed,
    owner: ownerTrimmed,
    startDate: startDate,
    endDate: endDate,
    gerrit: gerrit,
    gerritArchive: gerritArchive,
    gerritDelta: gerritDelta,
    intersect: intersect,
  };

  command = "/proj/nrbbtools/nrbbdevtools/codeChurn/codeChurnQuery.py ";

  prefix = `${subjectTrimmed},${ownerTrimmed}`; //for saving csv in its own unique name
  command = buildCommand(objData, command, prefix);

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
    processXlsxToJson(subjectSplit, ownerSplit, prefix);

    res.status(200).send({
      status: "success",
      message: "Data processed",
      data: finalData,
      subjectSplit: subjectSplit.length,
      ownerSplit: ownerSplit.length,
      intersect: intersect,
    });
  });
}

/*Fuctions Called (Stack Trace) in Top to Bottom Order */
const buildCommand = (objData, command, prefix) => {
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
  command += `--saveData `;
  command += `--savePrefix=${prefix}`;
  return command;
};

const processXlsxToJson = (subject, owner, prefix) => {
  const workbook = xlsx.readFile(
    path.join(__dirname, `../csv/${prefix}ChurnQuery.xlsx`),
  );
  const sheet_name = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheet_name];

  // Convert the worksheet to JSON data
  const jsonData = xlsx.utils.sheet_to_json(worksheet);
  separateQueries(jsonData, command, subject, owner); //passing in subject = subjectSplit, owner = ownerSplit
};

const separateQueries = (jsonData, command, subject, owner) => {
  //TODO:
  /*
1. Add total of all subjects/owners 
(final object in jsonData must be sorted by date to do this)


2. When parsing through subjects, 
if a selected owner worked on that subject, 
it must be included in overlapArr as well 
(but must be inserted in the correct index in jsonArr by date.)
*/

  let [subjectSplit, ownerSplit] = [subject, owner];

  //clear the arrays if the split element is empty quotes
  if (subjectSplit[0] === "") subjectSplit = [];
  if (ownerSplit[0] === "") ownerSplit = [];

  console.log(subjectSplit.length);
  console.log(ownerSplit.length);

  //if only the subject field was filled
  if (ownerSplit.length == 0) {
    let counter = 0;
    let jsonArr = [];
    for (let i = 0; i < jsonData.length; i++) {
      if (jsonData[i].reason.includes(subjectSplit[counter])) {
        jsonArr.push(jsonData[i]);
      } else {
        counter++;
        addTotalTestAndTotalDesign(jsonArr);
        jsonArr = [];
        jsonArr.push(jsonData[i]);
      }
    }
    addTotalTestAndTotalDesign(jsonArr);
    return;
  } else if (subjectSplit.length == 0) {
    //if only owner entry was filled
    let counter = 0;
    let jsonArr = [];
    for (let i = 0; i < jsonData.length; i++) {
      if (ownerSplit[counter].includes(jsonData[i].user)) {
        jsonArr.push(jsonData[i]);
      } else {
        counter++;
        addTotalTestAndTotalDesign(jsonArr);
        jsonArr = [];
        jsonArr.push(jsonData[i]);
      }
    }
    addTotalTestAndTotalDesign(jsonArr);
    return;
  }

  //if both subject and owner field was filled w/ at least one entry
  if (command.includes("--intersect")) {
    //if data was selected to be intersected
    let counter = 0;
    let jsonArr = [];
    for (let i = 0; i < jsonData.length; i++) {
      if (jsonData[i].reason.includes(subjectSplit[counter])) {
        jsonArr.push(jsonData[i]);
      } else {
        counter++;
        addTotalTestAndTotalDesign(jsonArr);
        jsonArr = [];
        jsonArr.push(jsonData[i]);
      }
    }
    addTotalTestAndTotalDesign(jsonArr);
  } else {
    //if data wasn't selected to be intersected
    let counter = 0;
    let jsonArr = [];
    let overlapArr = [];
    let index;
    for (let i = 0; i < jsonData.length; i++) {
      if (ownerSplit.includes(jsonData[i].user)) {
        overlapArr.push(jsonData[i]);
      }
      console.log(jsonData[i].reason);
      console.log(subjectSplit[counter]);
      if (jsonData[i].reason.includes(subjectSplit[counter])) {
        jsonArr.push(jsonData[i]);
        console.log("here1");
      } else {
        ++counter;
        console.log("here2");

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
        ? Math.round(parseFloat((1 / input[i]["x"]).toFixed(2) * 100)) / 100
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
  input[input.length - 1]["Average days between each commit"] =
    Math.round(
      (input[input.length - 1]["Last Commit-First Commit"] / input.length) *
        100,
    ) / 100; //insert avg days between each commit metric
  input[input.length - 1]["Average design code churn per commit"] =
    Math.round(
      (input[input.length - 1]["Total design code churn"] / input.length) * 100,
    ) / 100;
  input[input.length - 1]["Average test code churn per commit"] =
    Math.round(
      (input[input.length - 1]["Total test code churn"] / input.length) * 100,
    ) / 100;
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
  xlsx.writeFile(
    newWorkbook,
    path.join(__dirname, `./csv/${prefix}modifiedData.xlsx`),
  );

  console.log(`File saved to ./csv/${prefix}modifiedData.xlsx`);
};

/*************************************************/
// Helper function for getting difference in days
const processDates = (originalDate, iterDate) => {
  const timeDiff = iterDate - originalDate;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
};

module.exports = { getCommits };
