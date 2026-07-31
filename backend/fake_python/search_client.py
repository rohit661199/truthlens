from langchain_community.tools.tavily_search import TavilySearchResults
from config import SEARCH_RESULTS_K
from dotenv import load_dotenv
from pathlib import Path
import os

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env", override=True)

try:
    search_tool = TavilySearchResults(k=SEARCH_RESULTS_K)
except Exception:
    search_tool = None

def get_evidence(query: str) -> str:
    if not query or not query.strip():
        return "No claim provided."

    if not os.getenv("TAVILY_API_KEY"):
        return "Search API Key missing. Unable to fetch live web evidence."

    try:
        results = search_tool.invoke(query) if search_tool else None
    except Exception as e:
        return f"Search execution failed: {str(e)}"

    blocks = []
    
    if isinstance(results, str):
        return f"Search Error: {results}"
        
    if not isinstance(results, list) or not results:
        return "No relevant web evidence found for this claim."

    for r in results:
        if isinstance(r, dict):
            title = r.get("title", "Untitled").strip()
            content = r.get("content", "").strip()
            url = r.get("url", "").strip()

            if content or url:
                blocks.append(
                    f"TITLE: {title}\nCONTENT: {content}\nURL: {url}"
                )

    if not blocks:
        return "No relevant web evidence found for this claim."

    evidence_text = "\n---\n".join(blocks)
    max_chars = 4000
    if len(evidence_text) > max_chars:
        evidence_text = evidence_text[:max_chars] + "\n...[truncated due to length]"
    
    return evidence_text