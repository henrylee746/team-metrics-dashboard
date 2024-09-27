const express = require("express");
const app = express();
const { exec } = require("child_process");
const port = 3000;
const xlsx = require("xlsx");

app.use(express.static("public"));
app.use(express.json());

app.post("/", (req, res) => {
  const { parcel, owners, startDate, endDate, intersectCheckBox } = req.body;
  //Already handled client-side although if somehow missed
  if (!parcel && !owners && !startDate && !endDate && !intersectCheckBox) {
    return res.status().send({ status: "failed" });
  }
  let command = "/proj/nrbbtools/nrbbdevtools/codeChurn/codeChurnQuery.py "; //remember to add --saveData at the end
  for (const [key, value] of Object.entries(req.body)) {
    if (value == "" || false) continue;
    switch (key) {
      case "parcel":
        command += `--reasons="${parcel}" `;
        break;
      case "owners":
        command += `--owners="${owners}" `;
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
  console.log(command);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Stdout:\n${stdout}`);
    processXlsxToJson();
  });
});

const processXlsxToJson = () => {
  const workbook = xlsx.readFile("./csv/churnQuery.xlsx");
  const sheet_name = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheet_name];

  // Convert the worksheet to JSON data
  const jsonData = xlsx.utils.sheet_to_json(worksheet);
  //console.log(jsonData);
  addTotalTestAndTotalDesign(jsonData);
  return;
};

const convertJsonToXlsx = (jsonData) => {
  // Convert JSON to a worksheet
  const newWorksheet = xlsx.utils.json_to_sheet(jsonData);

  // Create a new workbook
  const newWorkbook = xlsx.utils.book_new();

  // Append the worksheet to the workbook
  xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, "Sheet1");

  // Write the workbook back to a file
  xlsx.writeFile(newWorkbook, "./csv/modifiedData.xlsx");

  console.log(`File saved to ./csv/modifiedData.xlsx`);
};

//Loops thru objects and gets totalTest and totalDesign totals out of all commits
const addTotalTestAndTotalDesign = (input) => {
  let totalTest = 0,
    totalDesign = 0;
  totalTest = input.reduce(function (one, two) {
    return one + two.testCodeChurn;
  }, 0);
  totalDesign = input.reduce(function (one, two) {
    return one + two.sourceCodeChurn;
  }, 0);
  fillCumulativeCode(input, totalTest, totalDesign);
};

//adds two JSON properties to each commit: totalTest% (cumulative) as well as for totalDesign%
const fillCumulativeCode = (input, totalTest, totalDesign) => {
  let currentTest = 0,
    currentDesign = 0;
  input
    .slice()
    .reverse()
    .forEach(function (commit) {
      currentTest += commit.testCodeChurn;
      currentDesign += commit.sourceCodeChurn;

      // Avoid division by zero
      commit["% of total test (cumulative)"] = //totalTestPercentage
        totalTest !== 0
          ? +(Math.round((currentTest / totalTest) * 100) / 100).toFixed(2) *
            100
          : 0.0;
      commit["% of total design (cumulative)"] = //totalDesignPercentage
        totalDesign !== 0
          ? +(Math.round((currentDesign / totalDesign) * 100) / 100).toFixed(
              2
            ) * 100
          : 0.0;
    });
  calculateDaysFromFirstCommit(input);
};

const calculateDaysFromFirstCommit = (input) => {
  input = input.slice().reverse();
  const originalDate = new Date(input[0]["updated"]);
  input[0]["days from 1st commit"] = 0;
  for (let i = 1; i < input.length; i++) {
    const iterDate = new Date(input[i]["updated"]);
    const iterDateMinus1 = new Date(input[i - 1]["updated"]);
    input[i]["days from 1st commit"] = processDates(originalDate, iterDate); //daysfrom1stcommit
    input[i]["x"] = processDates(iterDateMinus1, iterDate);
    input[i]["1/x"] = +(
      //1/x
      (Math.round((1 / input[i]["x"]) * 100) / 100).toFixed(2)
    );
  }
  getLeadTime(input);
};

const getLeadTime = (input) => {
  const F1 = new Date(input[0]["updated"]);
  const FD = new Date(input[input.length - 1]["updated"]);
  const leadTime = processDates(F1, FD);
  input.push({
    "FD-F1": leadTime, //leadTime
    F1: input[0]["updated"], //firstCommit
    "Last commit": input[input.length - 1]["updated"], //lastCommit
    "Total design code churn": input.reduce((a, b) => {
      //designCodeChurn
      return a + b.sourceCodeChurn;
    }, 0),
    "Total test code churn": input.reduce((a, b) => {
      //totalTestChodeChurn
      return a + b.testCodeChurn;
    }, 0),
    //totalCodeChurn
    "Total code churn":
      input.reduce((a, b) => {
        return a + b.sourceCodeChurn;
      }, 0) +
      input.reduce((a, b) => {
        return a + b.testCodeChurn;
      }, 0),
  });
  console.log(input);
  convertJsonToXlsx(input);
};

//Helper function for getting difference in days in func calculateDaysFromFirstCommit
const processDates = (originalDate, iterDate) => {
  const timeDiff = iterDate - originalDate;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
