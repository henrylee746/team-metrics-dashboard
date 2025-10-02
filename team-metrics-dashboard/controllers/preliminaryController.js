import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function getSupabaseData() {
  console.log("Reached getCommits");
  const result = await supabase
    .from("preliminary")
    .select()
    .order("id", { ascending: true });
  console.log("Done retrieving supabase data");
  return result;
}
