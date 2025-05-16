// content.js
function extractMainText() {
  const selectors = [
    'article',
    'main',
    'div[itemprop="articleBody"]',
    'div[class*="content"]',
    'div[class*="article"]',
    'div[class*="post"]',
    'div[class*="story"]'
  ];

  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    for (const el of elements) {
      const text = el.innerText.trim();
      if (text && text.length > 300) {
        console.log(`Matched selector: ${selector}`);
        return text;
      }
    }
  }

  // Fallback: collect visible, long-enough paragraphs
  const paragraphs = Array.from(document.querySelectorAll('p'))
    .map(p => p.innerText.trim())
    .filter(text =>
      text.length > 50 &&
      !text.toLowerCase().includes('cookie') &&
      !text.toLowerCase().includes('subscribe') &&
      !text.toLowerCase().includes('privacy')
    );

  if (paragraphs.length > 0) {
    return paragraphs.slice(0, 10).join('\n\n');
  }

  // Absolute fallback
  console.warn("Failed to extract meaningful content from page.");
  return '';
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_PAGE_TEXT') {
    // Delay to ensure content is loaded
    setTimeout(() => {
      const content = extractMainText();
      console.log("Sending extracted text to popup:", content.slice(0, 200));
      sendResponse({ text: content });
    }, 1000); // wait 1 second
    return true; // keep message channel open
  }
});
