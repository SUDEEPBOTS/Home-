// pages/index.js
import { useEffect, useState } from "react";

export default function Home() {
// ---------------- ADMIN STATES ----------------
const [sites, setSites] = useState([]);
const [broadcastMsg, setBroadcastMsg] = useState("");
const [adminRefresh, setAdminRefresh] = useState(false);
// New state for broadcast status
const [isBroadcastEnabled, setIsBroadcastEnabled] = useState(true);

// ---------------- ORIGINAL STATES ----------------
const [keys, setKeys] = useState([]);
const [label, setLabel] = useState("");
const [apiKey, setApiKey] = useState("");

const [botToken, setBotToken] = useState("");
const [botTokenSaved, setBotTokenSaved] = useState(false);

const [settings, setSettings] = useState({
ownerName: "",
botName: "",
botUsername: "",
gender: "female",
personality: "normal",
groupLink: "",
});

const [settingsSaving, setSettingsSaving] = useState(false);
const [groups, setGroups] = useState([]);

const [testMessage, setTestMessage] = useState("");
const [testReply, setTestReply] = useState("");
const [testing, setTesting] = useState(false);

// ---------------- LOAD ALL DATA ----------------
useEffect(() => {
const load = async () => {
try {
const resKeys = await fetch("/api/keys");
const dataKeys = await resKeys.json();
if (dataKeys.ok) setKeys(dataKeys.keys || []);

const resBot = await fetch("/api/bot-config");
const dataBot = await resBot.json();
    if (dataBot.ok && dataBot.config?.telegramBotToken) {
      setBotToken(dataBot.config.telegramBotToken);
      setBotTokenSaved(true);
    }
    // Load broadcast status (assuming you have an API endpoint for this)
    const resBroadcast = await fetch("/api/broadcast-status");
    const dataBroadcast = await resBroadcast.json();
    if (dataBroadcast.ok) {
      setIsBroadcastEnabled(dataBroadcast.enabled);
    }

    const resSettings = await fetch("/api/bot-settings");
    const dataSettings = await resSettings.json();
    if (dataSettings.ok && dataSettings.settings) {
      setSettings((prev) => ({ ...prev, ...dataSettings.settings }));
    }

    const resGroups = await fetch("/api/groups");
    const dataGroups = await resGroups.json();
    if (dataGroups.ok) setGroups(dataGroups.groups || []);

    // CLIENT SITES
    const resSites = await fetch("/api/sites");
    const dataSites = await resSites.json();
    if (dataSites.ok) setSites(dataSites.sites || []);
  } catch (e) {
    console.error(e);
  }
};
load();

}, [adminRefresh]);

// ---------------- ADMIN PANEL ACTIONS ----------------
const toggleSite = async (siteId, current) => {
let msg = "";
if (!current) msg = prompt("Enter disabled message:");
await fetch("/api/toggle-site", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ siteId, value: !current, message: msg }),
});

setAdminRefresh(!adminRefresh);

};

const toggleBot = async (siteId, current) => {
await fetch("/api/toggle-bot", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ siteId, value: !current }),
});

setAdminRefresh(!adminRefresh);

};

// NEW FUNCTION: REMOVE CLIENT SITE
const removeSite = async (siteId) => {
if (
    !confirm(
      "Are you sure you want to permanently remove this client site?"
    )
  )
    return;

  await fetch("/api/remove-site", {
    method: "POST", // Assuming a POST endpoint for deletion
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ siteId }),
  });

  setAdminRefresh(!adminRefresh);
};

// MODIFIED FUNCTION: Send Broadcast
const sendBroadcast = async () => {
if (!broadcastMsg.trim()) return alert("Write a message first!");
if (!isBroadcastEnabled) return alert("Broadcast is currently disabled.");
await fetch("/api/broadcast", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ message: broadcastMsg }),
});
alert("Broadcast sent successfully!");
setBroadcastMsg("");
};

// NEW FUNCTION: TOGGLE BROADCAST STATUS
const toggleBroadcast = async () => {
  const newValue = !isBroadcastEnabled;
  await fetch("/api/toggle-broadcast", { // Assuming this is your new endpoint
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled: newValue }),
  });
  setIsBroadcastEnabled(newValue);
  alert(`Broadcast ${newValue ? "Enabled" : "Disabled"} successfully.`);
};


// ---------------- ORIGINAL FUNCTIONS (No changes needed here for the request) ----------------
const addKey = async () => {
if (!apiKey.trim()) return;
const res = await fetch("/api/keys", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ label, key: apiKey }),
});
const data = await res.json();
if (data.ok) {
setKeys(data.keys || []);
setLabel("");
setApiKey("");
}
};

const toggleKeyState = async (id, active) => {
const res = await fetch("/api/keys", {
method: "PATCH",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ id, active }),
});
const data = await res.json();
if (data.ok) setKeys(data.keys || []);
};

const deleteKey = async (id) => {
const res = await fetch("/api/keys", {
method: "DELETE",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ id }),
});
const data = await res.json();
if (data.ok) setKeys(data.keys || []);
};

const saveBotToken = async () => {
if (!botToken.trim()) return;
const res = await fetch("/api/bot-config", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ telegramBotToken: botToken }),
});
const data = await res.json();
if (data.ok) {
setBotTokenSaved(true);
alert("Bot token saved successfully.");
}
};

const setWebhook = () => {
if (!botTokenSaved) return alert("Save token first!");
const url = `https://api.telegram.org/bot${botToken}/setWebhook?url=${
    window.location.origin
  }/api/telegram-webhook`;
window.open(url, "_blank");
};

const saveSettings = async () => {
setSettingsSaving(true);
const res = await fetch("/api/bot-settings", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(settings),
});
setSettingsSaving(false);

const data = await res.json();
if (data.ok) alert("Settings saved.");

};

const sendTestMessage = async () => {
if (!testMessage.trim()) return;
setTesting(true);
setTestReply("");

const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: testMessage }),
  });

  const data = await res.json();
  setTesting(false);

  if (data.ok) setTestReply(data.reply || "");
  else setTestReply("Error from API");

};

// ---------------- UI (MODIFIED) ----------------
return (
<div className="min-h-screen bg-slate-950 text-white p-6 space-y-10 font-sans">
  {/* ------------------ ADMIN PANEL ------------------ */}
  <section className="bg-slate-900/80 border border-slate-700 rounded-xl p-6 space-y-6 shadow-2xl">
    <h1 className="text-3xl font-extrabold text-emerald-400 border-b border-slate-700 pb-3">
      SEZUKUU · ADMIN PANEL 🚀
    </h1>
    <p className="text-slate-400 text-sm">
      Master control for all client websites
    </p>

    {/* BROADCAST */}
    <div>
      <h2 className="text-xl font-semibold mb-3">Broadcast Message</h2>
      <div className="flex flex-col md:flex-row gap-3">
        <textarea
          rows={3}
          className="w-full p-3 rounded-lg bg-slate-800 outline-none border border-slate-700 focus:border-blue-500 transition"
          placeholder="Write message for all client websites…"
          value={broadcastMsg}
          onChange={(e) => setBroadcastMsg(e.target.value)}
          disabled={!isBroadcastEnabled}
        />
        <div className="flex flex-col gap-2 min-w-[150px]">
          <button
            onClick={sendBroadcast}
            disabled={!isBroadcastEnabled || !broadcastMsg.trim()}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Broadcast
          </button>
          {/* NEW BUTTON: Toggle Broadcast Off */}
          <button
            onClick={toggleBroadcast}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              isBroadcastEnabled
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isBroadcastEnabled ? "Disable Broadcast" : "Enable Broadcast"}
          </button>
        </div>
      </div>
    </div>

    {/* CLIENT SITES LIST */}
    <div>
      <h2 className="text-xl font-semibold mb-4">Connected Client Websites</h2>

      {sites.length === 0 && (
        <p className="text-slate-400">No sites registered yet. 😞</p>
      )}

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
        {sites.map((s) => (
          <div
            key={s.siteId}
            className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3 shadow-md hover:border-sky-500 transition duration-300"
          >
            <h3 className="text-lg font-bold text-sky-400">{s.siteName}</h3>
            <p className="text-sm text-gray-300 break-all">
              **URL**: {s.siteUrl}
            </p>
            <p className="text-xs text-gray-400">**ID**: {s.siteId}</p>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-700">
              {/* Toggle Website */}
              <button
                onClick={() => toggleSite(s.siteId, s.siteOff)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition hover:scale-[1.03] ${
                  s.siteOff
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {s.siteOff ? "Enable Website" : "Disable Website"}
              </button>

              {/* Toggle Bot */}
              <button
                onClick={() => toggleBot(s.siteId, s.botOff)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition hover:scale-[1.03] ${
                  s.botOff
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-yellow-600 hover:bg-yellow-700"
                }`}
              >
                {s.botOff ? "Enable Bot" : "Disable Bot"}
              </button>

              {/* NEW BUTTON: REMOVE SITE */}
              <button
                onClick={() => removeSite(s.siteId)}
                className="px-3 py-1 rounded-full text-sm font-medium bg-transparent border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition hover:scale-[1.03]"
              >
                Remove/Delete 🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setAdminRefresh(!adminRefresh)}
        className="mt-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition font-medium"
      >
        Refresh List 🔄
      </button>
      {/* ADD NEW CLIENT WEBSITE button ko aapko ek alag modal/form mein banana hoga, jo yahan pe 'sites' state ko update karega. */}
      {/* For now, just a placeholder for Connect/Add Client */}
      <button
        onClick={() => alert('New Client form/modal will open here!')}
        className="mt-4 ml-3 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition font-medium"
      >
        + Add New Client Website
      </button>
    </div>
  </section>

  {/* --- Separator --- */}
  <hr className="border-slate-800" />

  {/* ------------------ ORIGINAL UI START ------------------ */}

  {/* HEADER */}
  <header className="bg-slate-900/70 border border-slate-800 rounded-xl px-6 py-4 shadow-xl">
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-sm tracking-widest text-emerald-300 font-medium">
        YUKI ONLINE
      </span>
    </div>
    <h1 className="text-2xl font-bold mt-1 text-white">YUKI · AI ORCHESTRATOR</h1>
    <p className="text-xs text-slate-400 mt-1">
      Multi **Gemini keys** · **MongoDB** · **Telegram bot** · **Auto failover**
    </p>
  </header>

  {/* --- Separator --- */}
  <hr className="border-slate-800" />

  {/* REST OF YOUR ORIGINAL UI (GEMINI KEYS + BOT SETTINGS + TEST CHAT + GROUPS) */}
  <div className="grid lg:grid-cols-3 gap-6">
    {/* GEMINI KEYS (Column 1) */}
    <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-lg col-span-1">
      <h2 className="text-lg font-semibold text-fuchsia-400 mb-4">
        Gemini API Keys
      </h2>

      <input
        type="text"
        placeholder="Label"
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 mt-2 outline-none focus:border-fuchsia-500 transition"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />

      <input
        type="text"
        placeholder="API Key"
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 mt-2 outline-none focus:border-fuchsia-500 transition"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />

      <button
        onClick={addKey}
        className="mt-3 w-full bg-gradient-to-r from-sky-500 to-fuchsia-500 hover:from-sky-600 hover:to-fuchsia-600 px-4 py-2 rounded-lg font-medium transition transform hover:scale-[1.01]"
      >
        + Add Key
      </button>

      <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-2">
        {keys.map((k) => (
          <div
            key={k._id}
            className={`bg-slate-900 p-3 rounded-lg border border-slate-700 flex justify-between items-center transition ${
              k.active
                ? "border-emerald-500/50"
                : "opacity-70 border-yellow-500/50"
            }`}
          >
            <div>
              <p className="font-bold text-sm">{k.label}</p>
              <p className="text-xs text-slate-400 break-all truncate w-40">
                {k.key}
              </p>
            </div>

            <div className="flex flex-col gap-1 items-end">
              <button
                onClick={() => toggleKeyState(k._id, !k.active)}
                className={`px-2 py-1 rounded text-xs font-medium transition ${
                  k.active
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {k.active ? "Disable" : "Enable"}
              </button>
              <button
                onClick={() => deleteKey(k._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* TELEGRAM BOT & TEST CHAT (Column 2) */}
    <div className="col-span-1 flex flex-col gap-6">
      {/* TELEGRAM BOT */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h2 className="text-lg font-semibold text-sky-400 mb-3">
          Telegram Bot Configuration
        </h2>

        <input
          type="text"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-sky-500 transition"
          placeholder="Bot Token"
          value={botToken}
          onChange={(e) => {
            setBotToken(e.target.value);
            setBotTokenSaved(false);
          }}
        />

        <div className="flex gap-2 mt-3">
          <button
            onClick={saveBotToken}
            className="w-full bg-gradient-to-r from-sky-500 to-fuchsia-500 hover:from-sky-600 hover:to-fuchsia-600 px-4 py-2 rounded-lg font-medium transition"
          >
            {botTokenSaved ? "Update Bot Token" : "Save Bot Token"}
          </button>

          <button
            onClick={setWebhook}
            disabled={!botTokenSaved}
            className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Set Webhook
          </button>
        </div>
      </section>

      {/* TEST CHAT */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h2 className="text-lg font-semibold text-emerald-400 mb-3">
          Test Chat with Yuki
        </h2>

        <textarea
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 min-h-[80px] outline-none focus:border-emerald-500 transition"
          placeholder="Ask anything..."
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
        />

        <button
          onClick={sendTestMessage}
          disabled={testing}
          className="mt-3 w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-wait"
        >
          {testing ? "Sending…" : "Send Message"}
        </button>

        {testReply && (
          <div
            className={`mt-4 bg-slate-800 border rounded-lg p-3 text-sm shadow-inner ${
              testReply.includes("Error")
                ? "border-red-500 text-red-300"
                : "border-slate-700"
            }`}
          >
            **Reply:** {testReply}
          </div>
        )}
      </section>
    </div>

    {/* BOT SETTINGS & GROUPS (Column 3) */}
    <div className="col-span-1 flex flex-col gap-6">
      {/* BOT SETTINGS */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">
        <h2 className="text-lg font-semibold text-purple-400">Bot Settings</h2>

        <input
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-purple-500 transition"
          placeholder="Owner Name"
          value={settings.ownerName}
          onChange={(e) =>
            setSettings((s) => ({ ...s, ownerName: e.target.value }))
          }
        />

        <input
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-purple-500 transition"
          placeholder="Bot Name"
          value={settings.botName}
          onChange={(e) =>
            setSettings((s) => ({ ...s, botName: e.target.value }))
          }
        />

        <input
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-purple-500 transition"
          placeholder="Bot Username"
          value={settings.botUsername}
          onChange={(e) =>
            setSettings((s) => ({ ...s, botUsername: e.target.value }))
          }
        />

        <div className="grid grid-cols-2 gap-2">
          <select
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-purple-500 transition"
            value={settings.gender}
            onChange={(e) =>
              setSettings((s) => ({ ...s, gender: e.target.value }))
            }
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>

          <select
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-purple-500 transition"
            value={settings.personality}
            onChange={(e) =>
              setSettings((s) => ({ ...s, personality: e.target.value }))
            }
          >
            <option value="normal">Normal</option>
            <option value="flirty">Flirty</option>
            <option value="professional">Professional</option>
          </select>
        </div>

    
