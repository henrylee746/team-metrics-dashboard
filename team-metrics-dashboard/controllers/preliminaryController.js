import supabase from "../utils/supabase.js";

export async function getSupabaseData() {
  console.log("Reached getCommits");
  const result = await supabase
    .from("preliminary")
    .select()
    .order("id", { ascending: true });
  console.log("Done retrieving supabase data");
  return result;
}
