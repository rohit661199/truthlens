from dotenv import load_dotenv
import os
from pathlib import Path
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env", override=True)

def get_llm():
    groq_key = os.getenv("GROQ_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    # Primary: High-throughput Llama 3.1 8B (500,000 Tokens/Day limit)
    primary = ChatGroq(
        model_name="llama-3.1-8b-instant",
        api_key=groq_key,
        max_tokens=900,
        temperature=0,
    )

    fallbacks = []

    if groq_key:
        fallbacks.append(ChatGroq(
            model_name="mixtral-8x7b-32768",
            api_key=groq_key,
            max_tokens=900,
            temperature=0,
        ))
        fallbacks.append(ChatGroq(
            model_name="gemma2-9b-it",
            api_key=groq_key,
            max_tokens=900,
            temperature=0,
        ))

    if openai_key:
        try:
            fallbacks.append(ChatOpenAI(
                model_name="gpt-4o-mini",
                api_key=openai_key,
                base_url="https://models.inference.ai.azure.com",
                max_tokens=900,
                temperature=0,
            ))
        except Exception:
            pass

    if fallbacks:
        return primary.with_fallbacks(fallbacks)
    return primary