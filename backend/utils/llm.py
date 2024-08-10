import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI()


def response_from_llm(event, system, user):
    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user.substitute(input=event)},
        ],
        model=os.getenv("LLM_MODEL_ID"),
    )

    return chat_completion.choices[0].message.content
