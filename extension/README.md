
# Uwazi Chrome Extension

## Overview
Uwazi is a Chrome Extension that fetches multiple perspectives on a news article you're currently reading. It uses a FastAPI backend to pull in related articles using scraping and NLP.

## Setup

1. Make sure the FastAPI backend is running:

```bash
uvicorn main:app --reload
```

2. Load this extension into Chrome:
   - Go to `chrome://extensions/`
   - Enable Developer Mode
   - Click "Load unpacked"
   - Select the `uwazi-extension` folder

3. Navigate to a news article.
4. Click the Uwazi extension icon.
5. You'll see semantically related articles with varying perspectives.

## Backend API

- **POST /api/compare**

```json
{
  "url": "https://news.example.com/story",
  "content": "Full or partial text of the article..."
}
```

Returns:

```json
{
  "similar_articles": [
    {
      "source": "BBC",
      "url": "https://bbc.com/related-story",
      "summary": "Summary of the article",
      "similarity": 0.89
    }
  ]
}
```
