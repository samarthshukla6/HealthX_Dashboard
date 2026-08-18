# HealthX Dashboard

AI voice consultation with **Dr. Elara** (ElevenLabs), health avatars with BMI, live transcription, Gemini report generation, PDF export, and specialist email/scheduling.

## Setup

```bash
npm install
cp .env.example .env
# Fill in NEXT_PUBLIC_ELEVENLABS_AGENT_ID, GEMINI_API_KEY, and email vars
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- Virtual consultation (voice AI)
- Avatar picker + BMI
- Live transcript
- AI medical report (PDF)
- Send report to specialist
- Request appointment via email

## Env

See `.env.example`.
