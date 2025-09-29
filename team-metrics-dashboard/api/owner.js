// /api/owner.js
import { getCommits } from "../controllers/ownerController.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("Endpoint hit");
      await getCommits(req, res); // reuse existing controller
    } catch (err) {
      console.error("Error in /api/owner:", err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
