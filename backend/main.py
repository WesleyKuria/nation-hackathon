import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import requests
from bs4 import BeautifulSoup
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer, util
from transformers import pipeline

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load models
kw_model = KeyBERT("all-MiniLM-L6-v2")
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")

# GNews API
GNEWS_API_KEY = os.getenv("fcf730edb85df2e5f972317a55328e35")
GNEWS_BASE_URL = "https://gnews.io/api/v4/search"

# FastAPI setup
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend dev environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schema
class CompareRequest(BaseModel):
    url: str = ""
    content: str

# Utility: clean HTML
def clean_text(html):
    soup = BeautifulSoup(html, "html.parser")
    for script in soup(["script", "style", "noscript"]):
        script.decompose()
    return soup.get_text(separator=" ", strip=True)

# Step 1: Clean and summarize original content
def summarize_text(text):
    try:
        summary = summarizer(text[:1024])[0]["summary_text"]
        return summary
    except Exception as e:
        logger.warning(f"Summarization failed: {e}")
        return text

# Step 2: Extract keywords
def extract_keywords(text, num=5):
    try:
        keywords = kw_model.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words="english", top_n=num)
        return [kw[0] for kw in keywords]
    except Exception as e:
        logger.warning(f"Keyword extraction failed: {e}")
        return []

# Step 3: Search GNews with refined query
def search_gnews(keywords: List[str]) -> List[dict]:
    query = " ".join(keywords)
    params = {
        "q": query,
        "token": GNEWS_API_KEY,
        "lang": "en",
        "max": 5
    }
    try:
        response = requests.get(GNEWS_BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        return response.json().get("articles", [])
    except Exception as e:
        logger.error(f"GNews API failed: {e}")
        return []

# Step 4: Fetch and clean article content
def fetch_and_clean(url: str) -> str:
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        res = requests.get(url, headers=headers, timeout=10)
        res.raise_for_status()
        return clean_text(res.text)
    except Exception as e:
        logger.warning(f"Failed to fetch article {url}: {e}")
        return ""

# Step 5: Compare with original summary
def compare_summaries(original: str, articles: List[dict]):
    original_embedding = embedding_model.encode(original, convert_to_tensor=True)
    matches = []

    for article in articles:
        content = fetch_and_clean(article["url"])
        if not content or len(content) < 100:
            continue

        summary = summarize_text(content)
        similarity = util.cos_sim(original_embedding, embedding_model.encode(summary, convert_to_tensor=True)).item()
        matches.append({
            "snippet": summary,
            "similarity": round(similarity, 2),
            "source": article.get("source", {}).get("name", ""),
            "url": article["url"]
        })

    matches.sort(key=lambda x: x["similarity"], reverse=True)
    return matches

# API endpoint
@app.post("/api/compare")
async def compare_articles(req: CompareRequest):
    raw_text = req.content.strip()
    if not raw_text or len(raw_text) < 100:
        return {"error": "Article content too short to compare."}

    original_summary = summarize_text(raw_text)
    keywords = extract_keywords(original_summary)
    logger.info(f"Keywords: {keywords}")

    articles = search_gnews(keywords)
    if not articles:
        return {"error": "No articles found from GNews API."}

    matches = compare_summaries(original_summary, articles)
    return {"matches": matches}
