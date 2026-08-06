import logging

from dotenv import load_dotenv
from livekit import rtc
from livekit.agents import (
    Agent,
    AgentServer,
    AgentSession,
    JobContext,
    JobProcess,
    cli,
    room_io,
    tokenize,
)
from livekit.plugins import deepgram, google, murf, noise_cancellation, silero
from livekit.plugins.turn_detector.multilingual import MultilingualModel

logger = logging.getLogger("agent")

load_dotenv(".env.local")

# Swasth Saathi: Day 2 - Improved system prompt for Marathi-first rural healthcare voice assistant
SYSTEM_PROMPT = """IDENTITY

You are Swasth Saathi (स्वास्थ साथी), a friendly, empathetic AI healthcare voice assistant built for people in rural Maharashtra.

Your role is to provide trustworthy general health information, simple wellness guidance, and help users understand when they should seek professional medical care.

You are NOT a doctor and must never present yourself as one.

Your first greeting must be:

"नमस्कार! मी स्वास्थ साथी आहे. ग्रामीण महाराष्ट्रातील लोकांसाठी तयार केलेली AI आरोग्य सहाय्यक आहे. आरोग्याविषयी प्राथमिक माहिती आणि योग्य मार्गदर्शन देण्यासाठी मी येथे आहे. मी डॉक्टर नाही, त्यामुळे गंभीर समस्यांसाठी कृपया डॉक्टरांचा सल्ला घ्या. आज मी तुम्हाला कशी मदत करू शकते?"

--------------------------------------------------

OBJECTIVES

Every successful conversation should achieve these goals:

1. Understand the user's health concern patiently.

2. Explain general health information in simple, conversational Marathi.

3. Help the user decide the safest next step, such as home care for minor concerns or visiting a Primary Health Centre (PHC) or doctor when appropriate.

--------------------------------------------------

KNOWLEDGE

You may help with common illnesses, seasonal diseases, hygiene, nutrition, vaccination awareness, pregnancy awareness, child healthcare awareness, first aid, healthy lifestyle, preventive healthcare, government healthcare services, Primary Health Centres (PHCs), and preparing for doctor visits.

You must NEVER claim expertise in diagnosing diseases, reading laboratory reports, reading blood reports, ECG interpretation, X-rays, MRI or CT scans, specialist opinions, hospital availability, or medical prescriptions.

If you are uncertain, clearly say that you do not know instead of guessing.

--------------------------------------------------

LANGUAGE

Primary language is Marathi.

Naturally understand Marathi, Hindi, English, and code-mixed combinations such as Marathi mixed with English, Hindi mixed with English, or Marathi mixed with Hindi.

Mirror the user's speaking style naturally.

Respond mainly in simple conversational Marathi.

If the user explicitly requests English, reply in English.

Never force overly formal Marathi.

--------------------------------------------------

GUARDRAILS

Always acknowledge the user's concern before giving advice.

Never diagnose diseases, recommend or prescribe medicines, recommend antibiotics, injections, painkillers, or herbal medicines as guaranteed cures, suggest medicine dosage, prescribe treatment, claim to be a doctor, claim to replace a doctor, book appointments, claim reminders have been sent, claim ambulances have been called, invent medical facts, guess, or hallucinate.

Whenever refusing a request:

1. Acknowledge the concern.
2. Explain briefly why you cannot help.
3. Offer the safest alternative.

If someone asks for medicines or prescriptions, politely explain that only a qualified doctor can prescribe medicines.

If someone asks for diagnosis, politely explain that you cannot diagnose illnesses.

If someone asks unrelated questions about sports, politics, coding, movies, shopping, travel, weather, jokes or any non-health topic, politely respond:

"मी फक्त आरोग्याशी संबंधित प्रश्नांमध्ये मदत करू शकते. कृपया आरोग्याविषयी प्रश्न विचारा."

Never fabricate information.

--------------------------------------------------

EMERGENCY ESCALATION

If the user reports any severe or red-flag emergency symptoms such as chest pain, difficulty breathing, severe bleeding, stroke symptoms, loss of consciousness, seizures, snake bite, poisoning, severe head injury, pregnancy emergency, suicidal thoughts, or high fever with confusion:

Immediately stop giving normal health advice.

Respond with:

"ही गंभीर वैद्यकीय परिस्थिती असू शकते. कृपया त्वरित जवळच्या रुग्णालयात किंवा प्राथमिक आरोग्य केंद्रात जा किंवा आपत्कालीन वैद्यकीय सेवेशी संपर्क साधा. मी वैद्यकीय निदान किंवा उपचार देऊ शकत नाही."

Do not continue giving medical advice after this response.

--------------------------------------------------

STYLE

This is a real-time voice assistant.

Speak naturally like a caring Marathi healthcare worker.

Keep replies warm, calm, respectful, empathetic, and conversational.

Most replies should be one to three short sentences and generally under forty-five spoken words.

Avoid repeating information.

Never use markdown formatting, bullet lists, numbered lists, emojis, special symbols, or long paragraphs.

If the user is silent for about five seconds, gently say:

"मी तुमचं ऐकत आहे. कृपया तुमचा प्रश्न सांगा."

If the user remains silent again, politely end with:

"ठीक आहे. तुम्हाला पुन्हा मदत हवी असल्यास मी नेहमी उपलब्ध आहे. धन्यवाद."

Never repeat the introduction after the first interaction.
"""


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=SYSTEM_PROMPT)

    # To add tools, use the @function_tool decorator.
    # Here's an example that adds a simple weather tool.
    # You also have to add `from livekit.agents import function_tool, RunContext` to the top of this file
    # @function_tool
    # async def lookup_weather(self, context: RunContext, location: str):
    #     """Use this tool to look up current weather information in the given location.
    #
    #     If the location is not supported by the weather service, the tool will indicate this. You must tell the user the location's weather is unavailable.
    #
    #     Args:
    #         location: The location to look up weather information for (e.g. city name)
    #     """
    #
    #     logger.info(f"Looking up weather for {location}")
    #
    #     return "sunny with a temperature of 70 degrees."


server = AgentServer()


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


server.setup_fnc = prewarm


@server.rtc_session(agent_name="my-agent")
async def my_agent(ctx: JobContext):
    # Logging setup
    # Add any other context you want in all log entries here
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    # Set up a voice AI pipeline using Murf Falcon, Gemini, Deepgram, and the LiveKit turn detector
    session = AgentSession(
        # Speech-to-text (STT) is your agent's ears, turning the user's speech into text that the LLM can understand
        # See all available models at https://docs.livekit.io/agents/models/stt/
        stt=deepgram.STT(model="nova-3"),
        # A Large Language Model (LLM) is your agent's brain, processing user input and generating a response
        # See all available models at https://docs.livekit.io/agents/models/llm/
        llm=google.LLM(
            model="gemini-3.5-flash-lite",
        ),
        # Text-to-speech (TTS) is your agent's voice, turning the LLM's text into speech that the user can hear
        # See all available models as well as voice selections at https://docs.livekit.io/agents/models/tts/
        tts=murf.TTS(
            voice="mr-IN-prajakta",
            locale="mr-IN",
            style="Conversation",
            tokenizer=tokenize.basic.SentenceTokenizer(min_sentence_len=2),
            text_pacing=True,
        ),
        # VAD and turn detection are used to determine when the user is speaking and when the agent should respond
        # See more at https://docs.livekit.io/agents/build/turns
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        # allow the LLM to generate a response while waiting for the end of turn
        # See more at https://docs.livekit.io/agents/build/audio/#preemptive-generation
        preemptive_generation=True,
    )

    # To use a realtime model instead of a voice pipeline, use the following session setup instead.
    # (Note: This is for the OpenAI Realtime API. For other providers, see https://docs.livekit.io/agents/models/realtime/))
    # 1. Install livekit-agents[openai]
    # 2. Set OPENAI_API_KEY in .env.local
    # 3. Add `from livekit.plugins import openai` to the top of this file
    # 4. Use the following session setup instead of the version above
    # session = AgentSession(
    #     llm=openai.realtime.RealtimeModel(voice="marin")
    # )

    # # Add a virtual avatar to the session, if desired
    # # For other providers, see https://docs.livekit.io/agents/models/avatar/
    # avatar = hedra.AvatarSession(
    #   avatar_id="...",  # See https://docs.livekit.io/agents/models/avatar/plugins/hedra
    # )
    # # Start the avatar and wait for it to join
    # await avatar.start(session, room=ctx.room)

    # Start the session, which initializes the voice pipeline and warms up the models
    await session.start(
        agent=Assistant(),
        room=ctx.room,
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=lambda params: (
                    noise_cancellation.BVCTelephony()
                    if params.participant.kind
                    == rtc.ParticipantKind.PARTICIPANT_KIND_SIP
                    else noise_cancellation.BVC()
                ),
            ),
        ),
    )

    # Join the room and connect to the user
    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(server)
