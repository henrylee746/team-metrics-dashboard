import { getSupabaseData } from "../controllers/preliminaryController.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const result = await getSupabaseData();
      // just return the object
      setTimeout(() => {
        return res.status(200).json(result); // <-- actually send it back
      }, 1500); //a 1.5 second timer - to let the progress bar imitate the "data retrieval progress"
    } catch (err) {
      console.error("Error in /api/preliminary:", err);
      return res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
