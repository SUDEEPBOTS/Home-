import db from "@/lib/db";
import Site from "@/models/Site";
import BotSettings from "@/models/BotSettings";
import { generateWithYuki } from "@/lib/gemini";

export default async function handler(req, res) {
  if (req.method !== "POST") 
    return res.status(200).json({ ok: false });

  await db();

  const { message, siteId } = req.body;
  if (!message) return res.json({ ok: false, error: "Empty message" });
  if (!siteId) return res.json({ ok: false, error: "Missing siteId" });

  const site = await Site.findOne({ siteId });
  if (!site) return res.json({ ok: false, error: "Site not found" });

  if (site.botOff)
    return res.json({ ok: false, error: "Bot is disabled by admin" });

  const settings = await BotSettings.findOne().lean();

  const prompt = `
You are ${settings.botName}.
Owner: ${settings.ownerName}.
Personality: ${settings.personality}.
Gender: ${settings.gender}.

User message: ${message}
Respond naturally.
`;

  let reply = "Error";
  try {
    reply = await generateWithYuki(prompt);
  } catch {
    reply = "Something went wrong.";
  }

  return res.json({ ok: true, reply });
}
