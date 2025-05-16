// 🌍 Wait for DOM to load
window.addEventListener("DOMContentLoaded", () => {
  // 🎯 Compare Button Handler
  const compareBtn = document.getElementById("compare-btn");
  compareBtn.addEventListener("click", async () => {
    const url = document.getElementById("article-url").value;

    if (!url) {
      alert("Please enter a valid article URL.");
      return;
    }

    // 🧠 Simulate call to backend (mock response)
    document.getElementById("comparison-results").innerHTML = "<p>Loading comparison...</p>";

    try {
      // Mocking the comparison since backend is not yet set up
      const result = {
        html: `
          <h3>Comparing Perspectives</h3>
          <p>Original Article: <a href="${url}" target="_blank">${url}</a></p>
          <ul>
            <li><strong>Nation:</strong> Framing as a peaceful protest</li>
            <li><strong>Citizen:</strong> Focus on traffic disruption</li>
            <li><strong>BBC:</strong> Emphasis on climate urgency</li>
          </ul>
        `
      };

      // 🖥️ Update UI
      document.getElementById("comparison-results").innerHTML = result.html;
    } catch (err) {
      console.error("Error comparing article:", err);
      document.getElementById("comparison-results").innerHTML = "<p>Error retrieving comparisons.</p>";
    }
  });
});
