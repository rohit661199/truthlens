from fastapi import FastAPI
from pydantic import BaseModel
import os
import tempfile
import base64
import pytesseract
import cv2
import numpy as np
from fastapi import UploadFile, HTTPException, Form
from dotenv import load_dotenv
from search_client import get_evidence
from verifier_chain import build_verifier_chain
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from openai import OpenAI
from gtts import gTTS
from pathlib import Path

# Explicitly load .env from the backend/ directory (parent of fake_python/)
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env", override=True)

# Python handles the backslashes automatically when reading from the environment
tesseract_path = os.getenv("TESSERACT_PATH")

if tesseract_path:
    pytesseract.pytesseract.tesseract_cmd = tesseract_path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ClaimRequest(BaseModel):
    claim: str

chain = build_verifier_chain()
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
openai_client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url="https://models.inference.ai.azure.com",
)

@app.post("/fact-check")
def fact_check(request: ClaimRequest):
    try:
        evidence = get_evidence(request.claim)

        result = chain.invoke({
            "claim": request.claim,
            "evidence": evidence
        })

        return result.model_dump()
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/ocr")
async def extract_text(file: UploadFile):
    # Check if the file is actually an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        image_bytes = await file.read()
        np_img = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        if img is None:
            raise ValueError("Failed to decode image")

        # Your preprocessing
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Tip: Use Otsu's thresholding for better results with varied lighting
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # OCR
        text = pytesseract.image_to_string(thresh)

        evidence = get_evidence(text)
        result = chain.invoke({
            "claim": text,
            "evidence": evidence
        })
        
        return {"extracted_text": text.strip(), "result": result.model_dump()}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Map of supported languages: code -> gTTS lang code
# Whisper auto-detects if language is not specified
LANG_MAP = {
    "auto": None,
    "en": "en", "es": "es", "fr": "fr", "de": "de",
    "hi": "hi", "pt": "pt", "ru": "ru", "it": "it",
    "ja": "ja", "ko": "ko", "zh": "zh-CN", "ar": "ar",
    "tr": "tr", "nl": "nl", "pl": "pl", "sv": "sv",
    "ta": "ta", "te": "te", "bn": "bn", "ur": "ur",
}

# Whisper language codes (ISO 639-1) for transcription hinting
WHISPER_LANGS = {
    "en": "en", "es": "es", "fr": "fr", "de": "de",
    "hi": "hi", "pt": "pt", "ru": "ru", "it": "it",
    "ja": "ja", "ko": "ko", "zh": "zh", "ar": "ar",
    "tr": "tr", "nl": "nl", "pl": "pl", "sv": "sv",
    "ta": "ta", "te": "te", "bn": "bn", "ur": "ur",
}


@app.post("/voice-check")
async def voice_check(file: UploadFile, language: str = Form(default="auto")):
    """Accept audio, transcribe with Groq Whisper, fact-check, return TTS audio.
    Supports multilingual: pass language code (e.g. 'hi', 'es') or 'auto' for detection."""
    try:
        # --- Determine file extension from content type or filename ---
        ext_map = {
            "audio/webm": ".webm",
            "audio/ogg": ".ogg",
            "audio/mp4": ".mp4",
            "audio/mpeg": ".mp3",
            "audio/wav": ".wav",
            "audio/x-wav": ".wav",
            "audio/mp3": ".mp3",
            "video/webm": ".webm",
        }
        ct = (file.content_type or "").split(";")[0].strip().lower()
        ext = ext_map.get(ct, "")
        if not ext and file.filename:
            ext = os.path.splitext(file.filename)[-1] or ".webm"
        if not ext:
            ext = ".webm"

        # --- Save uploaded audio to a temp file ---
        audio_bytes = await file.read()
        tmp = tempfile.NamedTemporaryFile(suffix=ext, delete=False)
        tmp.write(audio_bytes)
        tmp.close()

        # --- Transcribe with Groq Whisper ---
        lang_code = language.strip().lower() if language else "auto"
        whisper_kwargs = {
            "model": "whisper-large-v3",
            "response_format": "verbose_json",  # gives us detected language
        }
        # If user picked a specific language, hint Whisper for better accuracy
        if lang_code != "auto" and lang_code in WHISPER_LANGS:
            whisper_kwargs["language"] = WHISPER_LANGS[lang_code]

        with open(tmp.name, "rb") as f:
            whisper_kwargs["file"] = (os.path.basename(tmp.name), f)
            transcription = groq_client.audio.transcriptions.create(**whisper_kwargs)
        os.unlink(tmp.name)

        # Extract text and detected language from response
        if isinstance(transcription, str):
            transcribed_text = transcription.strip()
            detected_lang = lang_code if lang_code != "auto" else "en"
        else:
            transcribed_text = transcription.text.strip()
            detected_lang = getattr(transcription, "language", None) or (lang_code if lang_code != "auto" else "en")

        if not transcribed_text:
            raise HTTPException(status_code=400, detail="Could not transcribe any speech from the audio.")

        # --- Fact-check the transcribed claim ---
        evidence = get_evidence(transcribed_text)
        result = chain.invoke({
            "claim": transcribed_text,
            "evidence": evidence,
        })
        result_dict = result.model_dump()

        # --- Generate TTS audio response in the right language ---
        speech_text = f"{result_dict['verdict']}. {result_dict['explanation']}"

        # Resolve gTTS language: use user-selected, then detected, fallback to 'en'
        tts_lang = "en"
        if lang_code != "auto" and lang_code in LANG_MAP and LANG_MAP[lang_code]:
            tts_lang = LANG_MAP[lang_code]
        elif detected_lang and detected_lang in LANG_MAP and LANG_MAP[detected_lang]:
            tts_lang = LANG_MAP[detected_lang]
        elif detected_lang:
            # Try using the raw detected lang code directly with gTTS
            tts_lang = detected_lang

        try:
            tts = gTTS(text=speech_text, lang=tts_lang)
        except Exception:
            # Fallback to English if the language isn't supported by gTTS
            tts = gTTS(text=speech_text, lang="en")
            tts_lang = "en"

        tts_tmp = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
        tts.save(tts_tmp.name)
        tts_tmp.close()

        with open(tts_tmp.name, "rb") as af:
            audio_b64 = base64.b64encode(af.read()).decode("utf-8")
        os.unlink(tts_tmp.name)

        return {
            "transcribed_text": transcribed_text,
            "result": result_dict,
            "audio_response": audio_b64,
            "detected_language": detected_lang,
            "tts_language": tts_lang,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── AI Image Detection ────────────────────────────────────────────────────────
IMAGE_AI_DETECTION_PROMPT = """You are an expert digital forensics analyst specializing in AI-generated image detection.
Analyze the provided image and determine whether it is AI-generated or a real photograph.

Examine these forensic criteria carefully:
1. LIGHTING & SHADOWS - Check for inconsistent light sources, impossible shadow angles, or diffused shadows that don't match the scene geometry.
2. ANATOMY & PROPORTIONS - Look for malformed hands/fingers, asymmetric facial features, extra or missing limbs, unnatural body proportions.
3. TEXT & SYMBOLS - AI often produces garbled, misspelled, or nonsensical text in signs, labels, or watermarks.
4. REFLECTIONS & REFRACTIONS - Reflections in eyes, mirrors, water, or glass that don't match the scene.
5. EDGES & BOUNDARIES - Blurry or smeared boundaries between objects, hair merging with background, unnatural skin-to-clothing transitions.
6. TEXTURES & PATTERNS - Repeating or overly smooth textures, skin that looks plastic-like, fabric patterns that warp unnaturally.
7. SYMMETRY ARTIFACTS - Overly perfect or imperfect symmetry in faces, architecture, or repeating patterns.
8. DIFFUSION / GAN ARTIFACTS - Checkerboard patterns at pixel level, spectral anomalies, or "AI glow" / over-sharpened look typical of certain generators.
9. BACKGROUND COHERENCE - Background elements that don't make logical sense, impossible architecture, semantic incoherence.
10. METADATA CLUES - If visible: watermarks, signatures of known generators (Midjourney, DALL-E, Stable Diffusion patterns).

You MUST respond with valid JSON only, no extra text. Use this exact structure:
{
  "verdict": "AI-Generated" or "Real Photograph" or "Uncertain",
  "confidence_percentage": <integer 0-100>,
  "detailed_reasoning": "<2-4 sentence summary of your analysis>",
  "visual_inconsistencies": ["<specific issue 1>", "<specific issue 2>", ...],
  "ai_generation_indicators": ["<indicator 1>", "<indicator 2>", ...]
}

If the image appears to be a real photograph, "visual_inconsistencies" should list any minor observations and "ai_generation_indicators" should be an empty array or list reasons it appears authentic.
Respond ONLY with the JSON object."""

@app.post("/detect-ai-image")
async def detect_ai_image(file: UploadFile):

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        image_bytes = await file.read()
        img_b64 = base64.b64encode(image_bytes).decode("utf-8")
        mime = file.content_type or "image/jpeg"

        response = openai_client.chat.completions.create(
            model="gpt-4o",
            temperature=0.1,
            max_tokens=1000,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": IMAGE_AI_DETECTION_PROMPT},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{mime};base64,{img_b64}"
                            }
                        }
                    ]
                }
            ]
        )

        raw = response.choices[0].message.content.strip()

        import json, re
        match = re.search(r"\{[\s\S]*\}", raw)
        if not match:
            raise ValueError("Invalid JSON returned from model")

        parsed = json.loads(match.group())

        return {
            "verdict": parsed.get("verdict", "Uncertain"),
            "confidence_percentage": int(parsed.get("confidence_percentage", 50)),
            "detailed_reasoning": parsed.get("detailed_reasoning", ""),
            "visual_inconsistencies": parsed.get("visual_inconsistencies", []),
            "ai_generation_indicators": parsed.get("ai_generation_indicators", []),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))