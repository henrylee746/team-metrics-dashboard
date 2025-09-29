import { getCommits } from "../controllers/ownerController.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const result = await getCommits(req); // just return the object
      return res.status(200).json(result); // <-- actually send it back
    } catch (err) {
      console.error("Error in /api/owner:", err);
      return res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
