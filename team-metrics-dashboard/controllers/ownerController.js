/*eslint-disable*/
require("dotenv").config();
const supabaseModule = require("@supabase/supabase-js");
const { createClient } = supabaseModule;
let finalData = []; //represents final JSON arr after manipulations

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getSupabaseData() {
  const [bob, charlie, em8, xy] = await Promise.all([
    supabase
      .from("employees")
      .select("data")
      .contains("data", { name: "Bob Sample" }),
    supabase
      .from("employees")
      .select("data")
      .contains("data", { name: "Charlie Demo" }),
    supabase
      .from("subjects")
      .select("data")
      .contains("data", { reason: "em8kkjsam4" }),
    supabase
      .from("subjects")
      .select("data")
      .contains("data", { reason: "XY789-ZT2" }),
  ]);

  // Each result is { data, error }
  if (bob.error) throw bob.error;
  if (charlie.error) throw charlie.error;
  if (em8.error) throw em8.error;
  if (xy.error) throw xy.error;

  return [bob.data, charlie.data, em8.data, xy.data];
}

async function getCommits(req, res) {
  try {
    const [bobSample, charlieDemo, em8kkjsam4, XY789ZT2] =
      await getSupabaseData();

    // unwrap JSONB data
    const bobSampleData = bobSample.map((row) => row.data);
    const charlieDemoData = charlieDemo.map((row) => row.data);
    const em8Data = em8kkjsam4.map((row) => row.data);
    const xyData = XY789ZT2.map((row) => row.data);

    finalData = [];

    console.log(req.body);

    const { intersect } = req.body;

    //imitating pulling data from a database
    if (intersect)
      pullDataWithIntersectEnabled(
        req,
        bobSampleData,
        charlieDemoData,
        em8Data,
        xyData
      );
    else
      pullDataWithIntersectDisabled(
        req,
        bobSampleData,
        charlieDemoData,
        em8Data,
        xyData
      );

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
  } catch (err) {
    console.log("Error in getCommits:", err);
    return res.status(500).json({ error: err.message });
  }
}

const pullDataWithIntersectEnabled = (
  req,
  bobSample,
  charlieDemo,
  em8kkjsam4,
  XY789ZT2
) => {
  const { subject, owner } = req.body;
  subject.map((subject) => {
    const jsonArr = [];
    if (subject.label === "em8kkjsam4") {
      em8kkjsam4.map((commit) => {
        if (commit.name === owner) {
          jsonArr.push(commit);
        }
      });
    } else {
      XY789ZT2.map((commit) => {
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

const pullDataWithIntersectDisabled = (
  req,
  bobSample,
  charlieDemo,
  em8kkjsam4,
  XY789ZT2
) => {
  if (req.body.subject !== undefined && req.body.subject.length) {
    //empty arrays don't evaluate to falsy so must evaluate using length instead
    const { subject } = req.body;
    subject.map((subject) => {
      if (subject.label === "em8kkjsam4") {
        finalData.push(em8kkjsam4);
      } else if (subject.label === "XY789-ZT2") {
        finalData.push(XY789ZT2);
      }
    });
  }
  if (req.body.owner !== "") {
    //empty strings do evaluate to falsy so can use !
    const { owner } = req.body;
    if (owner === "Bob Sample") {
      finalData.push(bobSample);
    } else {
      finalData.push(charlieDemo);
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
