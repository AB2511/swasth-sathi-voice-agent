# 🩺 Swasth Saathi (स्वास्थ साथी)

A Marathi-first AI Voice Assistant built for the **Health Access** track of the **10 Days of AI Voice Agents – VoiceForBharat Edition**.

Powered by **Murf Falcon**, **LiveKit**, **Deepgram**, and **Google Gemini**.

---

## 🎥 Demo

(Add your LinkedIn video link here after publishing)

---

## Problem Statement

Many people in rural Maharashtra are more comfortable communicating in Marathi than English.

Swasth Saathi aims to make basic healthcare guidance more accessible through natural voice conversations while encouraging users to seek professional medical care whenever necessary.

---

## Features

- 🎙️ Marathi-first voice conversations
- 🩺 Answers common healthcare questions
- 🌡️ Provides simple symptom explanations
- 🚑 Gives basic first-aid guidance
- 🏥 Recommends visiting nearby PHCs or doctors for serious symptoms
- 🔊 Natural Marathi voice using Murf Falcon

---

## Tech Stack

- Murf Falcon (Text-to-Speech)
- LiveKit Agents
- Deepgram Speech-to-Text
- Google Gemini
- Python
- Next.js

---

## Project Structure

```
backend/
frontend/
```

---

## Running Locally

### Backend

```bash
cd backend
uv sync
uv run python src/agent.py download-files
uv run python src/agent.py dev
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Open

```
http://localhost:3000
```

---

## Sample Conversation

**User**

> मला दोन दिवसांपासून ताप आहे.

**Swasth Saathi**

> तुम्हाला ताप आहे हे ऐकून वाईट वाटले. विश्रांती घ्या, भरपूर पाणी प्या आणि लवकरात लवकर जवळच्या प्राथमिक आरोग्य केंद्रात किंवा डॉक्टरांकडे तपासणी करून घ्या.

---

## Disclaimer

This assistant provides general health information only.

It does **not** diagnose diseases or prescribe medicines.

Always consult a qualified healthcare professional for medical advice.

---

## Challenge

10 Days of AI Voice Agents – VoiceForBharat Edition

Track:
**Health Access**

---

## Author

Anjali Barge
