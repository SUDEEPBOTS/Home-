// pages/index.js
import { useEffect, useState } from "react";

export default function Home() {
  // ---------------- ADMIN STATES ----------------
  const [sites, setSites] = useState([]);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [adminRefresh, setAdminRefresh] = useState(false);

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

  const sendBroadcast = async () => {
    if (!broadcastMsg.trim()) return alert("Write a message first!");
    await fetch("/api/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: broadcastMsg }),
    });
    alert("Broadcast sent successfully!");
    setBroadcastMsg("");
  };

  // ---------------- ORIGINAL FUNCTIONS ----------------
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

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 space-y-10">

      {/* ------------------ ADMIN PANEL ------------------ */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-emerald-400">SEZUKUU · ADMIN PANEL</h1>
        <p className="text-slate-400 text-sm">Master control for all client websites</p>

        {/* BROADCAST */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Broadcast Message</h2>
          <textarea
            rows={3}
            className="w-full p-3 rounded-xl bg-slate-800 outline-none"
            placeholder="Write message for all client websites…"
            value={broadcastMsg}
            onChange={(e) => setBroadcastMsg(e.target.value)}
          />
          <button
            onClick={sendBroadcast}
            className="mt-3 bg-blue-600 px-4 py-2 rounded-xl"
          >
            Send Broadcast
          </button>
        </div>

        {/* CLIENT SITES LIST */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Connected Client Websites</h2>

          {sites.length === 0 && (
            <p className="text-slate-400">No sites registered yet.</p>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {sites.map((s) => (
              <div
                key={s.siteId}
                className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3"
              >
                <h3 className="text-lg font-semibold">{s.siteName}</h3>
                <p className="text-sm text-gray-300 break-all">URL: {s.siteUrl}</p>
                <p className="text-xs text-gray-400">ID: {s.siteId}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSite(s.siteId, s.siteOff)}
                    className={`px-3 py-1 rounded ${
                      s.siteOff ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {s.siteOff ? "Enable Website" : "Disable Website"}
                  </button>

                  <button
                    onClick={() => toggleBot(s.siteId, s.botOff)}
                    className={`px-3 py-1 rounded ${
                      s.botOff ? "bg-green-600" : "bg-yellow-600"
                    }`}
                  >
                    {s.botOff ? "Enable Bot" : "Disable Bot"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setAdminRefresh(!adminRefresh)}
            className="mt-4 bg-gray-700 px-4 py-2 rounded-xl"
          >
            Refresh List
          </button>
        </div>
      </section>

      {/* ------------------ ORIGINAL UI START ------------------ */}

      {/* HEADER */}
      <header className="bg-slate-900/70 border border-slate-800 rounded-3xl px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-sm tracking-wide text-emerald-300">
            YUKI ONLINE
          </span>
        </div>
        <h1 className="text-2xl font-semibold mt-1">YUKI · AI ORCHESTRATOR</h1>
        <p className="text-xs text-slate-400 mt-1">
          Multi Gemini keys · MongoDB · Telegram bot · Auto failover
        </p>
      </header>

      {/* REST OF YOUR ORIGINAL UI (GEMINI KEYS + BOT SETTINGS + TEST CHAT + GROUPS) */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* GEMINI KEYS */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5">
          <h2 className="text-lg font-semibold">Gemini API Keys</h2>

          <input
            type="text"
            placeholder="Label"
            className="w-full bg-slate-900 border rounded-xl px-3 py-2 mt-2"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />

          <input
            type="text"
            placeholder="API Key"
            className="w-full bg-slate-900 border rounded-xl px-3 py-2 mt-2"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />

          <button
            onClick={addKey}
            className="mt-3 bg-gradient-to-r from-sky-500 to-fuchsia-500 px-4 py-2 rounded-xl"
          >
            + Add Key
          </button>

          <div className="mt-3 space-y-2 max-h-40 overflow-auto">
            {keys.map((k) => (
              <div
                key={k._id}
                className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between"
              >
                <div>
                  <p className="font-medium">{k.label}</p>
                  <p className="text-xs text-slate-400 break-all">{k.key}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => toggleKeyState(k._id, !k.active)}
                    className="border px-2 py-1 rounded text-xs"
                  >
                    {k.active ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => deleteKey(k._id)}
                    className="border border-red-500 text-red-400 px-2 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TELEGRAM BOT */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5">
          <h2 className="text-lg font-semibold">Telegram Bot</h2>

          <input
            type="text"
            className="w-full bg-slate-900 border rounded-xl px-3 py-2"
            placeholder="Bot Token"
            value={botToken}
            onChange={(e) => {
              setBotToken(e.target.value);
              setBotTokenSaved(false);
            }}
          />

          <button
            onClick={saveBotToken}
            className="mt-3 bg-gradient-to-r from-sky-500 to-fuchsia-500 px-4 py-2 rounded-xl"
          >
            {botTokenSaved ? "Update Bot Token" : "Save Bot Token"}
          </button>

          <button
            onClick={setWebhook}
            disabled={!botTokenSaved}
            className="mt-2 bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2 rounded-xl disabled:opacity-60"
          >
            Set Webhook
          </button>
        </section>
      </div>

      {/* BOT SETTINGS & TEST CHAT */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* BOT SETTINGS */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-3">
          <h2 className="text-lg font-semibold">Bot Settings</h2>

          <input
            className="w-full bg-slate-900 border rounded-xl px-3 py-2"
            placeholder="Owner Name"
            value={settings.ownerName}
            onChange={(e) => setSettings((s) => ({ ...s, ownerName: e.target.value }))}
          />

          <input
            className="w-full bg-slate-900 border rounded-xl px-3 py-2"
            placeholder="Bot Name"
            value={settings.botName}
            onChange={(e) => setSettings((s) => ({ ...s, botName: e.target.value }))}
          />

          <input
            className="w-full bg-slate-900 border rounded-xl px-3 py-2"
            placeholder="Bot Username"
            value={settings.botUsername}
            onChange={(e) =>
              setSettings((s) => ({ ...s, botUsername: e.target.value }))
            }
          />

          <div className="grid grid-cols-2 gap-2">
            <select
              className="bg-slate-900 border rounded-xl px-3 py-2"
              value={settings.gender}
              onChange={(e) => setSettings((s) => ({ ...s, gender: e.target.value }))}
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>

            <select
              className="bg-slate-900 border rounded-xl px-3 py-2"
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

          <input
            className="w-full bg-slate-900 border rounded-xl px-3 py-2"
            placeholder="Group Link"
            value={settings.groupLink}
            onChange={(e) => setSettings((s) => ({ ...s, groupLink: e.target.value }))}
          />

          <button
            onClick={saveSettings}
            disabled={settingsSaving}
            className="bg-gradient-to-r from-sky-500 to-fuchsia-500 rounded-xl px-4 py-2"
          >
            {settingsSaving ? "Saving…" : "Save Settings"}
          </button>
        </section>

        {/* TEST CHAT */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5">
          <h2 className="text-lg font-semibold">Test Chat with Yuki</h2>

          <textarea
            className="w-full bg-slate-900 border rounded-xl px-3 py-2 min-h-[80px]"
            placeholder="Ask anything..."
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
          />

          <button
            onClick={sendTestMessage}
            disabled={testing}
            className="mt-3 bg-gradient-to-r from-sky-500 to-fuchsia-500 px-4 py-2 rounded-xl"
          >
            {testing ? "Sending…" : "Send"}
          </button>

          {testReply && (
            <div className="mt-3 bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm">
              {testReply}
            </div>
          )}
        </section>
      </div>

      {/* GROUP LIST */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5">
        <h2 className="text-lg font-semibold">Logged Groups</h2>

        <div className="space-y-2 max-h-52 overflow-auto">
          {groups.length === 0 && (
            <p className="text-slate-500">No group activity logged yet.</p>
          )}

          {groups.map((g) => (
            <div
              key={g._id}
              className="bg-slate-800 p-3 rounded-xl border border-slate-700"
            >
              <p className="font-medium">{g.title || "Untitled Group"}</p>
              <p className="text-xs text-slate-400">ID: {g.chatId}</p>
              <p className="text-xs">{g.type}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
  }
