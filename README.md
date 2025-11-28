# 📌 SEZUKUU · HOME ADMIN PANEL  
**Master Control System for All Client Telegram Bot Deployments**

This is the **Home (Admin) Version** of Sezukuu —  
the central server that controls all client deployments.

From this admin panel you can:

### ✔ Register new client websites  
### ✔ Turn ANY client website ON/OFF remotely  
### ✔ Turn client bots ON/OFF remotely  
### ✔ Send broadcast popup messages to all clients  
### ✔ Manage your Gemini API keys  
### ✔ Edit global bot settings  
### ✔ Monitor all client instances  
### ✔ Handle the master AI brain (Yuki Engine)  

All client versions depend on this server to:

- Get AI replies  
- Get personality / settings  
- Get ON/OFF status  
- Get broadcast popup  
- Get disabled message  
- Register themselves  

---

# 🚀 Features

| Feature | Description |
|--------|-------------|
| 🔥 Global Admin Dashboard | Full control over all client deployments |
| ⚙ Yuki Chat Engine | AI brain for all bots |
| 🔑 Gemini Keys Manager | Auto failover, auto switch |
| 🤖 Telegram Bot Settings | Owner Name, Bot Name, Gender, Personality |
| 🔔 Broadcast System | Send popup to all clients |
| 📡 Webhook Handler | Centralized Telegram routing |
| 🧠 Memory System | Per-user conversation memory |
| 🌐 Client Control | Website ON/OFF + Bot ON/OFF |
| 📝 Client Registry | Track all deployed client sites |

---

# 🛠 Folder Structure

```
HOME/
│
├── lib/
│   ├── db.js
│   ├── gemini.js
│
├── models/
│   ├── ApiKey.js
│   ├── Site.js           ← NEW
│   ├── BotConfig.js
│   ├── BotSettings.js
│   ├── Group.js
│   ├── Memory.js
│
├── pages/
│   ├── index.js          ← ADMIN DASHBOARD UI
│   │
│   └── api/
│       ├── chat.js
│       ├── register.js
│       ├── config.js
│       ├── toggle-site.js
│       ├── toggle-bot.js
│       ├── broadcast.js
│       ├── sites.js
│       ├── bot-config.js
│       ├── bot-settings.js
│       ├── groups.js
│       └── telegram-webhook.js
│
├── public/
├── styles/
```

---

# ⚙️ Environment Variables (Required)

Add these inside  
**Vercel → Project Settings → Environment Variables**

```
MONGO_URI=your_mongodb_connection_string
```

Optional (if you want admin bot on home server):

```
TELEGRAM_BOT_TOKEN=
```

Client versions must use:

```
HOME_BASE_URL=https://your-admin-domain.vercel.app
```

---

# 🚀 Deploy to Vercel (One-Click)

If this project is uploaded to GitHub,  
use this button to deploy instantly:

```
https://vercel.com/new/clone?repository-url=https://github.com/YOUR-USERNAME/YOUR-REPO
```

Replace:
- `YOUR-USERNAME`
- `YOUR-REPO`

---

# 🔌 Home APIs — Full List

## 1. `POST /api/register`
Registers a new client site  
Returns:
```json
{ "ok": true, "siteId": "xxxx-xxxx" }
```

## 2. `GET /api/config?siteId=xxxx`
Client websites poll this every few seconds  
Returns:
```json
{
  "siteOff": false,
  "botOff": false,
  "message": "",
  "broadcast": ""
}
```

## 3. `POST /api/chat`
Master AI brain (Yuki engine)

## 4. `POST /api/toggle-site`
Turn a client site ON/OFF

## 5. `POST /api/toggle-bot`
Turn a client bot ON/OFF

## 6. `POST /api/broadcast`
Send popup message to all clients

## 7. `GET /api/sites`
List all connected client deployments

---

# 🤖 Client Version Connection Guide

Every client project must:

### ✔ Ask user for site name (first time only)  
### ✔ Register itself using:

```
POST https://your-admin-domain/api/register
```

It receives:

```
{ "siteId": "xxxx-xxxx" }
```

### ✔ Poll config from home:

```
GET https://your-admin-domain/api/config?siteId=SITENAME
```

### ✔ Use HOME chat API:

```
POST https://your-admin-domain/api/chat
```

### ✔ Telegram webhook format:

```
https://client-site.com/api/telegram-webhook?token=BOT_TOKEN&siteId=SITENAME
```

---

# 🧠 Flowchart

```
Client User → Client Bot → Client Webhook
       ↓             ↑
       ↓   FORWARD CHAT REQUEST
       ↓             |
  HOME /api/chat  ←  |
       ↓
 Yuki AI Engine (Gemini)
       ↓
 Returns reply to Client bot
       ↓
 Client Telegram User
```

Admin controls everything:

```
Admin Panel → Toggle Website
Admin Panel → Toggle Bot
Admin Panel → Broadcast
Admin Panel → View Sites
```

---

# 💡 Support / Notes
- This Home version must always stay online  
- Client versions depend on this server  
- If Home server is down → all client bots go down  
- Keep Gemini keys active  
- Keep MongoDB connection stable

---

# 🎉 DONE  
Your Home Admin Panel is now fully ready.  
Control all client deployments from one place!```

---

## 🧠 Features Explained

### 🔹 Multi Gemini API Keys
- Multiple keys add  
- Enable/disable  
- Auto fallback  
- Key block detection  
- Auto disable blocked keys  

### 🔹 Full Bot Personalization
Panel se change ho sakta hai:

- Bot name  
- Bot username  
- Gender (male/female)  
- Personality (normal/flirty/professional)  
- Owner name  
- Group link  

### 🔹 Memory System
Har user ka alag chat memory hota hai  
(last 10 messages stored).

### 🔹 Group Smart Reply
Bot group me tabhi reply karta hai jab:

- Usko mention kare  
- Reply kare  
- Bot ka naam le  

Random baate me beech me nahi ghusta.

### 🔹 Conversation Tone Control
Persona dynamically change hota hai:

- Friendly  
- Flirty  
- Professional  

### 🔹 Typing Animation
Bot reply se pehle “typing…” show karta hai.

---

## 🛡 Error Protection

Bot engine protected from:

- Rate limits  
- Invalid keys  
- Webhook spam  
- Empty messages  
- JSON parse issues  

---

## ❤️ Credits

**Developer:** You  
**AI System:** Gemini Pro  
**Framework:** Next.js  
**Database:** MongoDB  
**Style:** TailwindCSS

---

## 🧩 Support

Agar tum bot ko upgrade karna chaho:

- Auto NSFW filter  
- Image reply  
- Voice message  
- Memory wipe command  
- Admin mode  

Main add karke de dunga.
