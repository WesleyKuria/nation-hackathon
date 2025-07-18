# 📰 Uwazi: Multi-Perspective News Extension

**Uwazi** is a Chrome extension and web application that reveals multiple perspectives on news articles, empowering users to detect media framing, semantic differences, and hidden biases across local and international news sources.

---

## 🚀 Features

- 🔎 **Semantic Comparison:** Uses NLP to compare articles covering the same topic from different sources.
- 🌍 **Kenyan & International Coverage:** Fetches news from Nation, BBC, Al Jazeera, and more.
- 💡 **Perspective Insights:** Shows key differences and similarity scores between articles.
- ⚡ **Chrome Extension:** Analyze any news page instantly in your browser.
- 🌐 **Web Application:** Dedicated React web interface for deeper analysis.

---

## 📂 Project Structure

uwazi/
├── backend/ # FastAPI NLP backend
├── extension/ # Chrome extension (React TypeScript)
├── webapp/ # Web application (React TypeScript)
└── shared/ # Shared utilities (optional)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/uwazi.git
cd uwazi
```

## 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
# or install manually:
```bash
pip install fastapi uvicorn beautifulsoup4 nltk spacy sentence-transformers newspaper3k requests
python -m spacy download en_core_web_sm
python -m nltk.downloader punkt wordnet
```
# Run the backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

## 3. Webapp Setup
```bash
cd ../webapp
npm install
npm start
```
## 4. Chrome Extension Setup
```bash
cd ../extension
npm install
npm run build
```
Package the Extension
```bash
mkdir dist
cp -r build/* dist/
cp public/manifest.json dist/
cd dist
zip -r ../uwazi-extension.zip ./*
```
## 5. Load Extension in Chrome
Go to chrome://extensions

Enable Developer Mode

Click Load unpacked

Select the dist folder

## 🔬 Backend API Overview
Endpoint	Method	Description
/compare	GET	Returns semantic analysis and differences for articles matching a query.

Example:

```bash
GET http://localhost:8000/compare?query=Kenya climate policy
```

## 🤝 Contributing
Pull requests are welcome. For major changes, open an issue first to discuss what you would like to change or enhance.

## 📌 Future Roadmap
🇰🇪 Add Swahili NLP models for local language analysis.

✨ User feedback system to rate usefulness of perspectives.

📱 Mobile app version for on-the-go analysis.

💼 Premium educator & journalist tools.

📄 License
LICENSE

🙏 Acknowledgements
FastAPI

React

Chakra UI

Newspaper3k

