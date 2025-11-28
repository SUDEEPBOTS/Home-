import dbConnect from "@/lib/db";
import Site from "@/models/Site";

export default async function handler(req, res) {
  const { siteId } = req.query;

  if (!siteId) return res.status(400).json({ error: "Missing siteId" });

  try {
    await dbConnect();
    const site = await Site.findOne({ siteId }).lean();
    if (!site) return res.status(404).json({ error: "Site not found" });

    return res.status(200).json({
      ok: true,
      siteOff: site.siteOff,
      botOff: site.botOff,
      message: site.disabledMessage,
      broadcast: site.broadcast,
    });
  } catch (err) {
    console.error("CONFIG API ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
