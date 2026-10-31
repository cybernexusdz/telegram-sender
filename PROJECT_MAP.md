# Project Map

## Project overview

Telegram Sender is a single-page web app for sending text, replies, reactions,
photos, animations, and videos to a Telegram chat, group, channel, or topic.
Users supply a bot token and chat ID in the UI; requests are made from the
browser to the Telegram Bot API.

## Architecture

```text
app/
├── page.tsx                 # Home screen, configuration state, and send handlers
├── layout.tsx               # Root layout, font, and page metadata
├── globals.css              # Tailwind import and global theme styles
├── components/
│   ├── TelegramConfig.tsx   # Bot token plus named destination management
│   ├── MessageComposer.tsx  # Message modes and selected destination's topic ID
│   └── StatusMessage.tsx    # Timed success/error notification
├── services/
│   └── telegram.ts          # Telegram Bot API requests and response handling
└── types/
    └── telegram.ts          # Shared configuration and response types

public/                       # Static assets
README.md                     # Setup and user-facing usage instructions
```

### Request flow

1. `TelegramConfig` updates the bot token and saved destination state owned by
   `app/page.tsx`.
2. The page creates a `TelegramService` for each send action.
3. `MessageComposer` calls the matching page handler.
4. `TelegramService` sends JSON or multipart form data to Telegram and returns
   a `MessageResponse`.
5. The page displays the result through `StatusMessage`.

## Feature progress

- [x] Configure bot token and chat ID; optionally specify a topic/thread ID.
- [x] Send text messages.
- [x] Reply to an existing message by message ID.
- [x] Add a built-in or manually entered emoji reaction to a message by message ID.
- [x] Send photos from a URL or uploaded file, with an optional caption.
- [x] Send animations from a URL or uploaded file, with an optional caption.
- [x] Send videos from a URL or uploaded file, with an optional caption.
- [x] Show success/error feedback and sending states in the UI.
- [x] Combine send actions in one responsive composer with mode selection.
- [x] Check composer mode switching and mobile layout at a narrow viewport.
- [x] Load and persist the bot token in browser local storage.
- [x] Save, select, and delete named chat destinations in browser local storage.
- [x] Keep each destination's optional topic ID in sync with the compact
  composer field.
- [ ] Add automated tests for UI flows and Telegram request payloads.
- [ ] Complete keyboard and screen-reader accessibility review.

## Engineering progress

- [x] Next.js App Router, React, and TypeScript project structure established.
- [x] ESLint and TypeScript configuration present.
- [ ] Add a test runner and establish a baseline test suite.
- [ ] Run and record lint, type-check, and production-build results.
- [ ] Review client-side token handling and decide whether a server-side proxy
  is needed for the intended deployment model.
- [ ] Reconcile the global CSS theme variables with the font setup in the root
  layout.

## Key commands

```bash
npm run dev
npm run lint
npm run build
npm start
```

There is currently no test script in `package.json`.

## Notes for future updates

- Keep this map aligned with the actual implementation; mark checklist items
  complete only after implementation or validation.
- The bot token is saved in browser local storage and used for direct browser
  requests. It is not encrypted or protected from scripts running on the same
  origin; do not use this on shared devices or treat it as a secret store.
- Named destinations, their chat IDs, topic IDs, and the active selection are
  also saved in browser local storage.
- Update the architecture and feature checklists when adding routes, services,
  or message types.
