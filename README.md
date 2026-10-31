## Telegram Sender
A web-based interface that integrates the Telegram Bot API, allowing users to send text messages, images, and GIFs directly to Telegram groups, channels, and topics.

**Features:**
- Send plain text messages to a Telegram chat (group/channel/topic)
- Reply to specific messages using message IDs
- Add an emoji reaction to a message by message ID
- Send images by URL or by uploading a file
- Send GIFs by URL or by uploading a file
- Send videos by URL or by uploading a file, with an optional caption
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

When the app loads, enter your **Bot Token**, create a named destination with its **Chat ID**, and start sending messages, replies, reactions, images, GIFs, or videos. To react, choose **React**, enter the target message ID, and select an emoji. Media can be sent by URL or uploaded, with an optional caption. Saved destinations and the selected destination are restored from this browser's local storage. The optional Topic ID is set in the Compose section and saved with the selected destination. The bot token is also saved in local storage; clearing the token field removes it.

**Security note:** The token and destinations are stored unencrypted in browser storage and are accessible to scripts running on this site. Avoid using this feature on shared or public devices.
 
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