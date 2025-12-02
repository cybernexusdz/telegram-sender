## Telegram Sender
A web-based interface that integrates the Telegram Bot API, allowing users to send text messages and images directly to Telegram groups, channels, and topics.

**Features:**
- Send plain text messages to a Telegram chat (group/channel/topic)
- Send images by URL or by uploading a file
- Optional topic/thread ID support for threaded messages
- Minimal, client-side UI (Next.js + React)

**Tech:** Next.js, React, TypeScript, Tailwind CSS (styling), Fetch API 

---

**Prerequisites**
- Node.js 18+ (or a Node version compatible with Next.js 16)
- npm (or yarn)
- A Telegram bot token (create one with BotFather)
- A target Chat ID (group, channel, or a user ID)

If you don't yet have a bot token or chat ID:
- Create a bot via Telegram's `@BotFather` and copy the bot token.
- To get a chat ID for a group or channel: add your bot to the group/channel and use the Bot API `getUpdates` method or a helper bot (for example, `@RawDataBot`) to obtain the numeric chat ID. Channel/group IDs for supergroups/channels typically begin with `-100...`.
 
## Install & Run (development) 
1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open the app in your browser:

```
http://localhost:3000
```

When the app loads, enter your **Bot Token** and **Chat ID** into the configuration panel and start sending messages or images.
 
## Build & Run (production) 
1. Build the app:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

By default `next start` serves the optimized build.
 
## Contributing
Contributions, issues and feature requests are welcome. Open a PR or file an issue describing what you'd like to change.