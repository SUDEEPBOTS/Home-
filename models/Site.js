import mongoose from "mongoose";

const SiteSchema = new mongoose.Schema({
  siteId: { type: String, unique: true },
  siteName: String,
  siteUrl: String,
  siteOff: { type: Boolean, default: false },
  botOff: { type: Boolean, default: false },
  disabledMessage: { type: String, default: "" },
  broadcast: { type: String, default: "" },
});

export default mongoose.models.Site || mongoose.model("Site", SiteSchema);
