// pages/index.js  (HOME VERSION - ADMIN PANEL)
import { useEffect, useState } from "react";

export default function Home() {
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

  // 🔥 NEW ADMIN FIELDS
  const [sites, setSites] = useState([]);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [adminRefresh, setAdminRefresh] = useState(false);

  // LOAD DATA
  useEffect(() => {
    const load = async () => {
      try {
        // KEYS
        const resKeys = await fetch("/api/keys");
        const dataKeys = await resKeys.json();
        if (dataKeys.ok) setKeys(dataKeys.keys || []);

        // BOT CONFIG
        const resBot = await fetch("/api/bot-config");
        const dataBot = await resBot.json();
        if (dataBot.ok && dataBot.config?.telegramBotToken) {
          setBotToken(dataBot.config.telegramBotToken);
          setBotTokenSaved(true);
        }

        // SETTINGS
        const resSettings = await fetch("/api/bot-settings");
        const dataSettings = await resSettings.json();
        if (dataSettings.ok && dataSettings.settings) {
          setSettings((prev) => ({ ...prev, ...dataSettings.settings }));
        }

        // GROUPS
        const resGroups = await fetch("/api/groups");
        const dataGroups = await resGroups.json();
        if (dataGroups.ok) setGroups(dataGroups.groups || []);

        // 🔥 CLIENT SITES (NEW)
        const resSites = await fetch("/api/sites");
        const dataSites = await resSites.json();
        if (dataSites.ok) setSites(dataSites.sites || []);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [adminRefresh]);

  // API KEY funcs
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

  const toggleKey = async (id, active) => {
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

  // BOT TOKEN & SETTINGS
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
      alert("Bot token saved");
    }
  };

  const handleSetWebhook = () => {
    if (!botTokenSaved || !botToken) return;
    const url = `https://api.telegram.org/bot${botToken}/setWebhook?url=${window.location.origin}/api/telegram-webhook`;
    window.open(url, "_blank");
  };

  const saveSettings = async () => {
    setSettingsSaving(true);
    const res = await fetch("/api/bot-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    setSettingsSaving(false);

    if (data.ok) alert("Settings saved");
  };

  // TEST CHAT
  const sendTest = async () => {
    if (!testMessage.trim()) return;
    setTesting(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: testMessage }),
    });

    const data = await res.json();
    setTesting(false);

    if (data.ok) setTestReply(data.reply || "");
    else setTestReply("Error");
  };

  // 🔥 WEBSITE ON/OFF
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

  // 🔥 BOT ON/OFF
  const toggleBot = async (siteId, current) => {
    await fetch("/api/toggle-bot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId, value: !current }),
    });
    setAdminRefresh(!adminRefresh);
  };

  // 🔥 BROADCAST
  const broadcast = async () => {
    if (!broadcastMsg.trim()) return alert("Write a message");
    await fetch("/api/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: broadcastMsg }),
    });
    alert("Broadcast sent");
    setBroadcastMsg("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 space-y-8">

      {/* HEADER */}
      <header className="bg-slate-900/70 border border-slate-800 rounded-3xl px-6 py-4">
        <h1 className="text-3xl font-bold">SEZUKUU · ADMIN PANEL</h1>
        <p className="text-sm text-slate-400">Master Control for All Client Sites</p>
      </header>

      {/* 🔥🔥 ADMIN SECTION: CLIENT SITES + BROADCAST */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5">

        <h2 className="text-xl font-semibold mb-3">Broadcast Message</h2>
        <textarea
          rows={3}
          className="w-full bg-slate-800 p-3 rounded-xl outline-none"
          placeholder="Write broadcast message for all client websites…"
          value={broadcastMsg}
          onChange={(e) => setBroadcastMsg(e.target.value)}
        ></textarea>

        <button
          onClick={broadcast}
          className="mt-3 bg-blue-600 px-4 py-2 rounded-xl"
        >
          Send Broadcast
        </button>
      </section>

      {/* CLIENT LIST */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5">
        <h2 className="text-xl font-semibold mb-3">Connected Client Websites</h2>

        {sites.length === 0 && (
          <p className="text-gray-400">No sites registered yet.</p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {sites.map((s) => (
            <div key={s.siteId} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold">{s.siteName}</h3>
              <p className="text-sm text-gray-300 break-all">
                URL: {s.siteUrl}
              </p>
              <p className="text-xs text-gray-500">
                ID: {s.siteId}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => toggleSite(s.siteId, s.siteOff)}
                  className={`px-3 py-1 rounded ${
                    s.siteOff
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {s.siteOff ? "Enable Website" : "Disable Website"}
                </button>

                <button
                  onClick={() => toggleBot(s.siteId, s.botOff)}
                  className={`px-3 py-1 rounded ${
                    s.botOff
                      ? "bg-green-600"
                      : "bg-yellow-600"
                  }`}
                >
                  {s.botOff ? "Enable Bot" : "Disable Bot"}
                </button>
              </div>

              <p className="mt-2 text-sm">
                Website:{" "}
                <span className={s.siteOff ? "text-red-400" : "text-green-400"}>
                  {s.siteOff ? "OFF" : "ON"}
                </span>
              </p>

              <p className="text-sm">
                Bot:{" "}
                <span className={s.botOff ? "text-yellow-400" : "text-green-400"}>
                  {s.botOff ? "OFF" : "ON"}
                </span>
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setAdminRefresh(!adminRefresh)}
          className="mt-4 bg-gray-700 px-4 py-2 rounded-xl"
        >
          Refresh List
        </button>
      </section>

      {/* 🔥 BELOW IS YOUR ORIGINAL UI (GEMINI KEYS + BOT SETTINGS + TEST) */}
      {/* ---- REMAINS SAME ---- */}
      {/* ---------------------- */}

      {/* GEMINI KEYS SECTION */}
      {/* ... rest of your original UI unchanged ... */}
    </div>
  );
}