async function fetchPageContent() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_PAGE_TEXT' }, (response) => {
        if (chrome.runtime.lastError || !response) {
          resolve('');
        } else {
          resolve(response.text);
        }
      });
    });
  });
}

async function compareArticles() {
  const url = 'http://127.0.0.1:8000/api/compare';
  const articleText = await fetchPageContent();
  const statusDiv = document.getElementById('status');
  const resultDiv = document.getElementById('results');

  resultDiv.innerHTML = '';
  statusDiv.textContent = 'Analyzing article...';

  if (!articleText || articleText.trim().length < 30) {
    statusDiv.textContent = 'Article content too short to compare.';
    return;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: '', content: articleText })
    });

    const data = await response.json();
    console.log("Backend response:", data);

    if (data.error) {
      statusDiv.textContent = '⚠ ' + data.error;
      return;
    }

    if (Array.isArray(data.matches) && data.matches.length > 0) {
      statusDiv.textContent = 'Top matching perspectives:';
      data.matches.forEach((match) => {
        const div = document.createElement('div');
        div.className = 'match';
        div.innerHTML = `
          <p><strong>Similarity:</strong> ${match.similarity}</p>
          <p>${match.snippet}</p>
        `;
        resultDiv.appendChild(div);
      });
    } else {
      statusDiv.textContent = 'No similar articles found.';
    }

  } catch (error) {
    console.error(error);
    statusDiv.textContent = '❌ Error fetching data';
    resultDiv.innerHTML = `
      <p>${error.message}</p>
      <p>Make sure the backend is running at <code>${url}</code></p>
    `;
  }
}

async function fetchPageContent() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { type: 'GET_PAGE_TEXT' },
        (response) => {
          console.log("Received content from tab:", response?.text?.slice(0, 200));
          resolve(response?.text || '');
        }
      );
    });
  });
}


document.addEventListener('DOMContentLoaded', () => {
  compareArticles();
});
