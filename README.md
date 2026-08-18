# HealthX Dashboard

AI voice consultation with **Dr. Elara** (ElevenLabs), health avatars with BMI, live transcription, Gemini report generation, PDF export, and specialist email/scheduling.

## Project structure

```
src/
├── app/                    # Next.js App Router (pages + API routes)
├── components/
│   ├── consultation/       # Consultation UI
│   ├── layout/             # Shell & panels
│   ├── report/             # PDF & preview
│   ├── transcript/         # Live transcript
│   ├── ui/                 # shadcn primitives
│   └── voice/              # Voice orb animation
├── config/                 # Static config (assistant, avatars, doctors)
├── hooks/                  # Client hooks (voice session, report)
├── lib/                    # Shared utilities (api client, email, report format)
├── services/               # Server-side business logic
└── types/                  # Shared TypeScript types
```

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

## Env

See `.env.example`.
