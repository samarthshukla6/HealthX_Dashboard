# HealthX Dashboard

An AI-powered virtual health consultation platform. Talk to **Dr. Elara** over voice, pick a health avatar, get a live transcript, and generate a structured medical report you can download or send to a specialist.

**Live demo:** [https://health-x-dashboard.vercel.app/](https://health-x-dashboard.vercel.app/)

**Repository:** [github.com/samarthshukla6/HealthX_Dashboard](https://github.com/samarthshukla6/HealthX_Dashboard)

---

## Screenshots

<!-- Paste or link your app screenshots here -->

| Virtual consultation | Live transcript & report |
|:---:|:---:|
| *(your screenshot)* | *(your screenshot)* |

---

## What it does

HealthX Dashboard is a single-page consultation app built for demo and prototype use. A patient selects an avatar, starts a voice session with an AI doctor, and the system captures the conversation in real time. When the call ends, Gemini turns the transcript into a formatted medical summary (Markdown + structured JSON), which can be exported as PDF or emailed to a specialist. Appointment requests are sent by email as well — no database required.

> **Disclaimer:** This is a demonstration tool, not a regulated medical device. Reports are AI-generated summaries for informational purposes only. Always consult a licensed physician for medical advice.

---

## Features

| Feature | Description |
|---------|-------------|
| **Voice consultation** | Real-time speech with Dr. Elara via [ElevenLabs Conversational AI](https://elevenlabs.io/conversational-ai) (WebSocket) |
| **Health avatars** | 6 SVG avatars (male/female × child/teen/senior) with visual “speaking” feedback |
| **BMI calculator** | Height/weight dialog updates BMI on the avatar profile |
| **Live transcript** | Patient vs. assistant messages streamed during the call (desktop sidebar) |
| **AI medical report** | Auto-generated on call end via [Google Gemini](https://ai.google.dev/); manual regenerate supported |
| **PDF export** | Structured report download via `@react-pdf/renderer` |
| **Send to specialist** | Upload PDF and email to a doctor from the specialty list |
| **Schedule appointment** | Pick date/time slot → email request to the selected specialist |
| **Responsive layout** | Full desktop grid (consultation + transcript); compact mobile layout |

---

## Tech stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, TypeScript) |
| **UI** | React 19, [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (Radix primitives) |
| **Voice AI** | [@elevenlabs/client](https://www.npmjs.com/package/@elevenlabs/client) — WebSocket session |
| **Report AI** | [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Gemini Flash) |
| **PDF** | [@react-pdf/renderer](https://react-pdf.org/) |
| **Email** | [Nodemailer](https://nodemailer.com/) (SMTP) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) (voice orb) |
| **Markdown** | [marked](https://marked.js.org/) (report preview) |
| **Deploy** | [Vercel](https://vercel.com/) |

---

## How it works

```
┌─────────────┐     WebSocket      ┌──────────────────┐
│   Browser   │ ◄────────────────► │  ElevenLabs      │
│  (Patient)  │                    │  Dr. Elara agent │
└──────┬──────┘                    └──────────────────┘
       │ transcript
       ▼
┌─────────────┐     POST           ┌──────────────────┐
│  Next.js    │ ─────────────────► │  Gemini API      │
│  API route  │ ◄───────────────── │  (report gen)    │
└──────┬──────┘     markdown+json  └──────────────────┘
       │
       ├──► PDF download (client)
       └──► SMTP email → specialist / appointment request
```

1. **Start consultation** — `useVoiceSession` opens an ElevenLabs `Conversation` with your public agent ID and sends session instructions (system prompt + first message).
2. **During call** — Transcript entries update in real time; avatar and orb react to who is speaking.
3. **End call** — `useConsultationReport` detects disconnect and calls `/api/generate-report` with the full transcript.
4. **Report actions** — Generate again, preview formatted HTML, download PDF, send file to a doctor, or request an appointment slot.

---

## API routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/generate-report` | POST | `{ transcript }` → Gemini → `{ report: { markdown, structured } }` |
| `/api/send-report` | POST | `multipart/form-data` — report file + doctor email |
| `/api/schedule-appointment` | POST | JSON — doctor, date, time → SMTP email to specialist |

---

## Project structure

```
src/
├── app/                    # Next.js App Router (page + API routes)
├── components/
│   ├── consultation/       # Dashboard, scene, bridge, report actions
│   ├── layout/             # Sidebar, panels
│   ├── report/             # PDF document + HTML preview
│   ├── transcript/         # Live transcript panel
│   ├── ui/                 # shadcn primitives
│   └── voice/              # Animated voice orb
├── config/                 # Assistant prompt, avatars, doctors, env
├── hooks/                  # useVoiceSession, useConsultationReport
├── lib/                    # API client, email, report formatting
├── services/report/        # Gemini report generation (server)
└── types/                  # Shared TypeScript interfaces
```

---

## Getting started

### Prerequisites

- Node.js **≥ 20.19**
- [ElevenLabs](https://elevenlabs.io/) account with a Conversational AI agent
- [Google AI Studio](https://aistudio.google.com/) API key (Gemini)
- SMTP credentials (e.g. Gmail App Password) for email features

### Install & run

```bash
git clone https://github.com/samarthshukla6/HealthX_Dashboard.git
cd HealthX_Dashboard
npm install
cp .env.example .env
# Fill in your keys (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` | Yes (voice) | Public agent ID from [ElevenLabs Conversational AI](https://elevenlabs.io/app/conversational-ai) |
| `GEMINI_API_KEY` | Yes (reports) | From [Google AI Studio](https://aistudio.google.com/apikey) |
| `GEMINI_MODEL` | No | Override model (default fallback chain: `gemini-flash-latest`, `gemini-2.0-flash`) |
| `EMAIL_SERVER_HOST` | For email | e.g. `smtp.gmail.com` |
| `EMAIL_SERVER_PORT` | For email | e.g. `587` |
| `EMAIL_SERVER_USER` | For email | SMTP username |
| `EMAIL_SERVER_PASSWORD` | For email | SMTP password / [Gmail App Password](https://support.google.com/accounts/answer/185833) |
| `EMAIL_FROM` | For email | Sender address |

See [`.env.example`](.env.example) for a template.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (webpack — required for ElevenLabs browser alias) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

---

## Deployment (Vercel)

1. Push to GitHub and import the repo in [Vercel](https://vercel.com/new).
2. Add all environment variables from `.env.example` in **Project → Settings → Environment Variables**.
3. Deploy — the app is a standard Next.js project; no database or extra services needed.

Production URL: [https://health-x-dashboard.vercel.app/](https://health-x-dashboard.vercel.app/)

---

## Implementation notes

- **Dr. Elara** — System prompt and first message live in `src/config/assistant.ts` and are sent to ElevenLabs as a contextual update after connect.
- **No auth / DB** — Stateless demo; specialists and time slots are static config in `src/config/doctors.ts`.
- **Report format** — Gemini returns Markdown + JSON; the app parses both and renders preview HTML (`marked`) and PDF sections.
- **ElevenLabs on Next 16** — Uses a webpack alias to the web build of `@elevenlabs/client`; dev/build scripts pass `--webpack` for compatibility.

---

## Links

| Resource | URL |
|----------|-----|
| **Live app** | [health-x-dashboard-qy5i-pi.vercel.app](https://health-x-dashboard.vercel.app/) |
| **GitHub** | [samarthshukla6/HealthX_Dashboard](https://github.com/samarthshukla6/HealthX_Dashboard) |
| **ElevenLabs Conversational AI** | [elevenlabs.io/conversational-ai](https://elevenlabs.io/conversational-ai) |
| **Google Gemini API** | [ai.google.dev](https://ai.google.dev/) |
| **Next.js docs** | [nextjs.org/docs](https://nextjs.org/docs) |

---

## License

Private / demo project. All rights reserved unless otherwise specified.
