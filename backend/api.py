from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from gtts import gTTS
import io
import logging
from libs.process import calendar_process
import base64
from libs.graph import run_workflow

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextToSpeechRequest(BaseModel):
    text: str
    lang: str = "ko"


@app.post("/text-to-speech")
async def text_to_speech(request: TextToSpeechRequest, req: Request):
    client_host = req.client.host
    logger.info(f"Received request from {client_host}")
    logger.info(f"Request body: {request}")

    try:
        # processed_text = calendar_process(request.text)
        processed_text = run_workflow(request.text)

        print("Processed text:", processed_text)

        tts = gTTS(text=processed_text, lang=request.lang, slow=False)

        audio_content = io.BytesIO()
        tts.write_to_fp(audio_content)
        audio_content.seek(0)

        audio_base64 = base64.b64encode(audio_content.getvalue()).decode("utf-8")

        response_data = {"text": processed_text, "audio": audio_base64}

        logger.info("Audio content generated successfully")
        return JSONResponse(content=response_data)

    except Exception as e:
        logger.error(f"Error in text_to_speech: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
