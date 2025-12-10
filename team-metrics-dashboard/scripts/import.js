/*Script to fill data in Preliminary Table 
(This data gets displayed on the preview charts 
when user first loads up webpage)*/

import supabase from "../utils/supabase";

async function insertData() {
  await supabase.from("preliminary").insert([
    { month: "January", design_code_churn: 2015, test_code_churn: 2016 },
    { month: "February", design_code_churn: 225, test_code_churn: 321 },
    { month: "March", design_code_churn: 25, test_code_churn: 65 },
    { month: "April", design_code_churn: 102, test_code_churn: 101 },
    { month: "May", design_code_churn: 25, test_code_churn: 75 },
  ]);
}

insertData();
