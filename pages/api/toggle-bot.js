import dbConnect from "@/lib/db";
import Site from "@/models/Site";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST")
    return res.status(404).json({ error: "Not found" });

  const { siteId, value } = req.body;

  try {
    await dbConnect();
    await Site.updateOne({ siteId }, { botOff: value });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
