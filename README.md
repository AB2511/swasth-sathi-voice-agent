# 🩺 Swasth Saathi (स्वास्थ साथी)

A Marathi-first AI Voice Assistant built for the **Health Access** track of the **10 Days of AI Voice Agents – VoiceForBharat Edition**.

Powered by **Murf Falcon**, **LiveKit**, **Deepgram**, and **Google Gemini**.

---

## 📌 Problem Statement

Many people in rural Maharashtra are far more comfortable communicating in **Marathi** than in English or technical medical terms. 

**Swasth Saathi** aims to make basic healthcare guidance accessible through conversational voice AI in Marathi. It assists users with health concerns, basic first aid, and symptom explanations, while prioritizing safety by advising users to consult Primary Health Centers (PHCs) or doctors for urgent situations.

---

## ✨ Features

- 🎙️ **Marathi-First Voice Conversations**: Natural Marathi dialogue by default.
- 🩺 **Healthcare Guidance**: Answers common health and wellness queries.
- 🌡️ **Symptom Explanation**: Explains symptoms in simple, clear language.
- 🚑 **Basic First-Aid**: Provides immediate, practical first-aid advice.
- 🏥 **Emergency Safety**: Recommends visiting nearby PHCs or qualified doctors for severe symptoms.
---

## 🚀 Day 2 Updates

- 🧩 **Structured System Prompt**: Implemented structured sections (Identity, Objectives, Knowledge, Language, Guardrails, Style).
- 🗣️ **Multilingual & Code-Mixed Support**: Seamlessly understands Marathi, Hindi, English, Hinglish, and Marathlish.
- 🛡️ **Medical Safety Guardrails**: Strict refusal to diagnose illnesses, prescribe medicines, or provide dosages.
- 🚨 **Emergency Escalation Flow**: Immediate redirection to PHCs/hospitals for red-flag emergency symptoms (chest pain, severe bleeding, snake bites, etc.).
- 🚫 **Out-of-Scope Handling**: Politely redirects non-health queries back to healthcare topics.
- ⏱️ **Silence Handling**: Gentle prompts for user silence and polite session wrap-up.

---

## 🗣️ Sample Conversation

> **User (मराठी)**  
> *"मला दोन दिवसांपासून ताप आहे."*

> **Swasth Saathi (स्वास्थ साथी)**  
> *"तुम्हाला ताप आहे हे ऐकून वाईट वाटले. विश्रांती घ्या, भरपूर पाणी प्या आणि लवकरात लवकर जवळच्या प्राथमिक आरोग्य केंद्रात किंवा डॉक्टरांकडे तपासणी करून घ्या."*

---

## 🏗️ Architecture

```mermaid
flowchart LR
    A[🎙️ User Speaks] -->|Audio Stream| B[Deepgram STT]
    B -->|Marathi / English Text| C[Google Gemini LLM]
    C -->|Marathi Response| D[Murf Falcon TTS\nmr-IN-prajakta]
    D -->|Audio Stream| E[LiveKit Transport]
    E -->|Real-time Voice| F[🔊 User Hears Agent]

    style A fill:#334155,stroke:#94a3b8,color:#fff
    style B fill:#1e40af,stroke:#60a5fa,color:#fff
    style C fill:#5b21b6,stroke:#a78bfa,color:#fff
    style D fill:#065f46,stroke:#34d399,color:#fff
    style E fill:#9a3412,stroke:#fb923c,color:#fff
    style F fill:#334155,stroke:#94a3b8,color:#fff
```

---

## ⚡ Why Murf Falcon?

Swasth Saathi leverages **Murf Falcon** because it provides ultra-low latency speech synthesis with high pronunciation accuracy in regional Indian languages. This ensures real-time voice conversations feel responsive, natural, and comfortable for rural users.

---

## 🛠️ Tech Stack

- **TTS (Text-to-Speech)**: Murf Falcon (`mr-IN-prajakta`)
- **STT (Speech-to-Text)**: Deepgram (`nova-3`)
- **LLM (Brain)**: Google Gemini (`gemini-3.5-flash-lite`)
- **Transport**: LiveKit Agents Framework & WebRTC
- **Backend**: Python 3.10+ (`uv` package manager)
- **Frontend**: Next.js (TypeScript, TailwindCSS)

---

## 🔑 Environment Variables

Create `.env.local` files in both `backend/` and `frontend/` directories:

### `backend/.env.local`
| Variable | Description |
| :--- | :--- |
| `LIVEKIT_URL` | LiveKit Cloud WebSocket URL |
| `LIVEKIT_API_KEY` | LiveKit API Key |
| `LIVEKIT_API_SECRET` | LiveKit API Secret |
| `MURF_API_KEY` | Murf AI API Key |
| `DEEPGRAM_API_KEY` | Deepgram API Key |
| `GOOGLE_API_KEY` | Google Gemini API Key |

### `frontend/.env.local`
| Variable | Description |
| :--- | :--- |
| `LIVEKIT_URL` | LiveKit Cloud WebSocket URL |
| `LIVEKIT_API_KEY` | LiveKit API Key |
| `LIVEKIT_API_SECRET` | LiveKit API Secret |
| `AGENT_NAME` | Set to `my-agent` for explicit agent dispatch |

---

## 🚀 Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+ & `pnpm`
- `uv` (Fast Python package installer)

### 1. Backend Setup
```bash
cd backend
uv sync
uv run python src/agent.py dev
```

### 2. Frontend Setup
```bash
cd frontend
pnpm install
pnpm dev
```

Open `http://localhost:3000` in your browser and click **Start Audio** / **Connect** to talk to Swasth Saathi.

---

## 📁 Project Structure

```
swasth-sathi-voice-agent/
├── backend/
│   ├── src/
│   │   └── agent.py          # Swasth Saathi agent logic & Murf TTS configuration
│   ├── .env.example          # Backend environment template
│   └── pyproject.toml        # Python dependencies
├── frontend/
│   ├── app/                  # Next.js app routes & LiveKit token API
│   ├── components/           # UI components & audio visualizer
│   ├── .env.example          # Frontend environment template
│   └── package.json          # Frontend dependencies
└── README.md
```

---

## ⚠️ Disclaimer

Swasth Saathi provides general health information only. It does **not** diagnose medical conditions or prescribe medications. Always consult a qualified medical professional or local Primary Health Center for medical diagnoses and treatment.

---

## 🙏 Acknowledgements

Built on top of the official [Murf LiveKit Starter](https://github.com/murf-ai/murf-livekit-starter) repository for the **10 Days of AI Voice Agents – VoiceForBharat Edition** challenge.

Special thanks to:
- **Murf AI**
- **LiveKit**
- **Deepgram**
- **Google Gemini**

---

## 👤 Author

**Anjali Barge**  
*Hackathon Track: Health Access*
