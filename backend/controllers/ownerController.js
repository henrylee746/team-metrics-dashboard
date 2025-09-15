/*eslint-disable*/
require("dotenv").config(); //load env vars

let finalData = []; //represents final JSON arr after manipulations

function getCommits(req, res) {
  finalData = [];

  console.log(req.body);

  const { intersect } = req.body;

  //imitating pulling data from a database
  if (intersect) pullDataWithIntersectEnabled(req);
  else pullDataWithIntersectDisabled(req);

  //timeout to imitate script calltime
  setTimeout(() => {
    res.status(200).json({
      status: "success",
      message: "Data processed",
      data: finalData,
      subject: req.body.subject ? req.body.subject : 0,
      owner: req.body.owner ? req.body.owner : 0,
      subjectSplit: req.body.subject ? req.body.subject.length : 0,
      ownerSplit: 1,
      intersect: intersect,
    });
  }, 1000);
}

const pullDataWithIntersectEnabled = (req) => {
  const [json1, json2] = [
    require("../messageem8kkjsam4.json"),
    require("../messageXY789-ZT2.json"),
  ];

  const { subject, owner } = req.body;
  subject.map((subject) => {
    const jsonArr = [];
    if (subject.label === "em8kkjsam4") {
      json1.map((commit) => {
        if (commit.name === owner) {
          jsonArr.push(commit);
        }
      });
    } else {
      json2.map((commit) => {
        if (commit.name === owner) {
          jsonArr.push(commit);
        }
      });
    }
    finalData.push(jsonArr);
  });
  console.log(finalData);
  if (finalData.length == 0) {
    return;
  }
  if (Object.keys(req.body.dateRange).length !== 0) {
    finalData = filterCommitsByDates(req, finalData);
  } else {
    finalData = getSummativeNumbers(finalData);
  }
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
    if (owner === "Bob Sample") {
      const json = require("../messageBobSample.json");
      finalData.push(json);
    } else {
      const json = require("../messageCharlieDemo.json");
      finalData.push(json);
    }
  }
  if (Object.keys(req.body.dateRange).length !== 0) {
    finalData = filterCommitsByDates(req, finalData);
  } else {
    finalData = getSummativeNumbers(finalData);
  }
};

/**Dates ***/
const filterCommitsByDates = (req, finalData) => {
  const finalDataAfterDateFilter = [];
  const { dateRange } = req.body;
  const { from, to } = dateRange;
  const [fromDate, toDate] = [new Date(from), new Date(to)];

  finalData.map((topic) => {
    const subject = [];
    topic.map((commit) => {
      if (compareDates(new Date(commit.updated), fromDate, toDate)) {
        subject.push(commit);
      }
    });
    finalDataAfterDateFilter.push(subject);
  });
  return getSummativeNumbers(finalDataAfterDateFilter);
};

const compareDates = (date, fromDate, toDate) => {
  return (
    date.getTime() >= fromDate.getTime() && date.getTime() <= toDate.getTime()
  );
};
/** ****/

/**Summative numbers
 
*/
const getSummativeNumbers = (finalDataAfterDateFilter) => {
  finalDataAfterDateFilter.map((topic) => {
    if (topic.length === 0) return;
    const firstCommit = new Date(topic[0].updated);
    const lastCommit = new Date(topic[topic.length - 1].updated);

    const diffInMs = lastCommit - firstCommit;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    let [totalDesignCode, totalTestCode, totalCodeChurn] = [0, 0, 0];
    topic.map((commit) => {
      totalTestCode += commit["% of total test (cumulative)"];
      totalDesignCode += commit["% of total design (cumulative)"];
    });
    totalCodeChurn = totalDesignCode + totalTestCode;

    if (topic[topic.length - 1]["Last Commit-First Commit"]) return;
    topic[topic.length] = {
      "Last Commit-First Commit": diffInDays,
      "First Commit": firstCommit.toLocaleDateString("en-CA"), //YYYY-MM-DD
      "Last commit": lastCommit.toLocaleDateString("en-CA"),
      "Average days between each commit": +(diffInDays / topic.length).toFixed(
        2
      ),
      "Average design code churn per commit": +(
        totalDesignCode / topic.length
      ).toFixed(2),
      "Average test code churn per commit": +(
        totalTestCode / topic.length
      ).toFixed(2),
      "Total design code churn": +totalDesignCode.toFixed(2), //unary operator (+) to convert back to int after toFixed converts to string
      "Total test code churn": +totalTestCode.toFixed(2),
      "Total code churn": +totalCodeChurn.toFixed(2),
    };
  });
  return finalDataAfterDateFilter;
};
/** */

module.exports = { getCommits };
