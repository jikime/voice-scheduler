import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI()


def response_from_llm(event: str, system: str, user: str) -> str:
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user.substitute(input=event)},
            ],
            model=os.getenv("LLM_MODEL_ID"),
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        raise RuntimeError(f"Error in LLM Chat response: {e}")

def generate_speech_openai(text: str) -> bytes:
    try:
      # alloy, echo, fable, onyx, nova, and shimmer
      response = client.audio.speech.create(model="tts-1", voice="nova", input=text)
      return response.content
    except Exception as e:
      raise RuntimeError(f"Error in LLM Speach response: {e}")