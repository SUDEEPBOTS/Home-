import dbConnect from "@/lib/db";
import Site from "@/models/Site";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(404).json({ error: "Not found" });
  }

  try {
    await dbConnect();
    const sites = await Site.find().lean();
    return res.status(200).json({ ok: true, sites });
  } catch (err) {
    console.error("SITES API ERROR:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
