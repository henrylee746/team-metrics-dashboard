/*eslint-disable*/
require("dotenv").config(); //load env vars
const xlsx = require("xlsx");
const path = require("path");

let finalData = []; //represents final JSON arr after manipulations
let command = "";
let prefix = "";

function getCommits(req, res) {
  finalData = [];

  console.log(req.body);

  const { intersect } = req.body;

  //imitating pulling data from a database
  if (intersect) pullDataWithIntersectEnabled(req);
  else pullDataWithIntersectDisabled(req);

  console.log(
    "Final data length prior to being returned to client (should have one more than prev. print unless no results returned): " +
      finalData.length
  );

  //timeout to imitate script calltime
  setTimeout(() => {
    res.status(200).json({
      status: "success",
      message: "Data processed",
      data: finalData,
      subjectSplit: req.body.subject ? req.body.subject.length : 0,
      ownerSplit: 1,
      intersect: intersect,
    });
  }, 1000);
}

const pullDataWithIntersectEnabled = (req) => {
  const [json1, json2, json3, json4] = [
    require("../messageem8kkjsam4.json").slice(
      0,
      require("../messageem8kkjsam4.json").length - 1
    ),
    require("../messageXY789-ZT2.json").slice(
      0,
      require("../messageXY789-ZT2.json").length - 1
    ),
    require("../messageBobSample.json").slice(
      0,
      require("../messageBobSample.json").length - 1
    ),
    require("../messageCharlieDemo.json").slice(
      0,
      require("../messageCharlieDemo.json").length - 1
    ),
  ];
  const allCommits = [json1, json2, json3, json4];
  const parsedCommits = [];
  const { subject, owner } = req.body;
  const labels = subject.map((subject) => subject.label);
  allCommits.map((jsonData) => {
    for (let i = 0; i < jsonData.length; i++) {
      if (
        labels.includes(jsonData[i].reason) &&
        jsonData[i].user === owner &&
        !parsedCommits.includes(jsonData[i].commit)
      ) {
        finalData.push(jsonData[i]);
        parsedCommits.push(jsonData[i].commit);
      }
    }
  });
  console.log(
    "Final data before being passed into addTotalTestAndTotalDesign function: " +
      finalData.length
  );
  if (finalData.length == 0) {
    return;
  }
  addTotalTestAndTotalDesign(finalData);
  finalData = finalData[finalData.length - 1];
  const tempArr = finalData;
  finalData = [];
  finalData.push(tempArr);
};

const pullDataWithIntersectDisabled = (req) => {
  if (req.body.subject !== undefined && req.body.subject.length) {
    //empty arrays don't evaluate to falsy so must evaluate using length instead
    const { subject } = req.body;
    subject.map((subject) => {
      if (subject.label === "em8kkjsam4") {
        const json = require("../messageem8kkjsam4.json");
        finalData.push(json);
      } else if (subject.label === "XY789-ZT2") {
        const json = require("../messageXY789-ZT2.json");
        finalData.push(json);
      }
    });
  }
  if (req.body.owner !== "") {
    //empty strings do evaluate to falsy so can use !
    const { owner } = req.body;
    if (owner === "BobSample") {
      const json = require("../messageBobSample.json");
      finalData.push(json);
    } else {
      const json = require("../messageCharlieDemo.json");
      finalData.push(json);
    }
  }
};

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
          command += `--gerrit=gerrit-archive`;
          break;
        }
        command += `,gerrit-archive`;
        break;
      case "gerritDelta":
        if (!values[i - 2] && !values[i - 1]) {
          command += `--gerrit=gerrit-delta`;
          break;
        }
        command += `,gerrit-delta `;
        break;
      case "gerritReview":
        if (!values[i - 3] && !values[i - 2] && !values[i - 1]) {
          command += `--gerrit=gerrit-review`;
          break;
        }
        command += `,gerrit-review `;
        break;
      case "gerritSigma":
        if (
          !values[i - 4] &&
          !values[i - 3] &&
          !values[i - 2] &&
          !values[i - 1]
        ) {
          command += `--gerrit=gerrit-sigma`;
          break;
        }
        command += `,gerrit-sigma `;
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
    path.join(__dirname, `../csv/${prefix}ChurnQuery.xlsx`)
  );
  const sheet_name = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheet_name];

  // Convert the worksheet to JSON data
  const jsonData = xlsx.utils.sheet_to_json(worksheet);
  separateQueries(jsonData, command, subject, owner); //passing in subject = subjectSplit, owner = ownerSplit
  passAllEntries(jsonData);
};

const separateQueries = (jsonData, command, subject, owner) => {
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
    console.log("Owner entry filled");
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

      if (jsonData[i].reason.includes(subjectSplit[counter])) {
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

const passAllEntries = (jsonData) => {
  sortDates(jsonData);
};

const sortDates = (jsonData) => {
  jsonData.sort((a, b) => new Date(a.updated) - new Date(b.updated));
  jsonData.reverse();
  addTotalTestAndTotalDesign(jsonData);
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

  input.slice().forEach((commit) => {
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
  input = input.slice();
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
    if (input[i]["1/x"] < 0) input[i]["1/x"] = 0;
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
  input[input.length - 1]["Average days between each commit"] =
    Math.round(
      (input[input.length - 1]["Last Commit-First Commit"] / input.length) * 100
    ) / 100; //insert avg days between each commit metric
  input[input.length - 1]["Average design code churn per commit"] =
    Math.round(
      (input[input.length - 1]["Total design code churn"] / input.length) * 100
    ) / 100;
  input[input.length - 1]["Average test code churn per commit"] =
    Math.round(
      (input[input.length - 1]["Total test code churn"] / input.length) * 100
    ) / 100;
  input[input.length - 1]["Velocity (4/x)"] =
    Math.round(
      (4 / input[input.length - 1]["Average days between each commit"]) * 100
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
    path.join(__dirname, `./csv/${prefix}modifiedData.xlsx`)
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
