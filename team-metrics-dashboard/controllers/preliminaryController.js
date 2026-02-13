import supabase from "../utils/supabase.js";

export async function getSupabaseData() {
  const result = await supabase
    .from("preliminary")
    .select()
    .order("id", { ascending: true });
  return result;
}
