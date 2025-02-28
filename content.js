console.log("Content script loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "showTranslateBox") {
    const selectedText = message.text;
    showTranslateBox(selectedText);
  } else if (message.action === "updateTheme") {
    updateTheme(message.theme);
  } else if (message.action === "updateApiKey") {
    console.log("API Key ممکن است به‌روزرسانی شده باشد.");
  }
});

function showTranslateBox(text) {
  const existingBox = document.getElementById("translateBox");
  if (existingBox) existingBox.remove();

  // تزریق فونت از Google Fonts
  injectFont();

  createTranslateBox(text);
}

function injectFont() {
  const fontLink = document.createElement("link");
  fontLink.href = "https://fonts.googleapis.com/css2?family=Vazirmatn&display=swap";
  fontLink.rel = "stylesheet";
  if (!document.querySelector(`link[href="${fontLink.href}"]`)) {
    document.head.appendChild(fontLink);
  }
}

function createTranslateBox(text) {
  const box = document.createElement("div");
  box.id = "translateBox";
  box.className = "translate-box";
  box.style.position = "fixed";
  box.style.top = "10px";
  box.style.right = "10px";
  box.style.zIndex = "1000";

  box.innerHTML = `
    <div class="header">
      <span class="title">ترجمه</span>
      <button id="closeBtn" class="close-btn">✖</button>
    </div>
    <label class="label">به چه زبانی ترجمه شود؟</label>
    <select id="langSelect" class="lang-select">
      <option value="en" selected>انگلیسی</option>
      <option value="fr">فرانسه</option>
      <option value="es">اسپانیایی</option>
      <option value="fa">فارسی</option>
    </select>
    <button id="translateBtn" class="translate-btn">ترجمه</button>
    <div id="result" class="result"></div>
  `;

  document.body.appendChild(box);

  document.getElementById("closeBtn").onclick = () => {
    box.remove();
  };

  document.getElementById("translateBtn").onclick = () => {
    const lang = document.getElementById("langSelect").value;
    box.remove();
    translateAndShowResult(text, lang);
  };

  // لود تم فعلی
  chrome.storage.local.get(["theme"], (result) => {
    updateTheme(result.theme || "light");
  });
}

function updateTheme(theme) {
  const translateBox = document.getElementById("translateBox");
  const translationResult = document.getElementById("translationResult");
  const translationError = document.getElementById("translationError");

  if (theme === "dark") {
    if (translateBox) translateBox.className = "translate-box dark-theme";
    if (translationResult) translationResult.className = "translation-result dark-theme";
    if (translationError) translationError.className = "translation-error dark-theme";
  } else {
    if (translateBox) translateBox.className = "translate-box";
    if (translationResult) translationResult.className = "translation-result";
    if (translationError) translationError.className = "translation-error";
  }
}

async function translateAndShowResult(text, targetLang) {
  chrome.storage.local.get(["apiKey"], async (result) => {
    if (!result.apiKey) {
      alert("لطفاً ابتدا یک API Key در تنظیمات وارد کنید!");
      return;
    }

    const apiKey = result.apiKey;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const prompt = `Translate the following text to ${targetLang} and return only the translated text without any additional explanation: "${text}"`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      const data = await response.json();
      const translatedText = data.candidates[0].content.parts[0].text;

      const resultBox = document.createElement("div");
      resultBox.id = "translationResult";
      resultBox.className = "translation-result";
      resultBox.style.position = "absolute";
      resultBox.style.zIndex = "1001";

      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      resultBox.style.top = `${rect.bottom + window.scrollY + 10}px`;
      resultBox.style.left = `${rect.left + window.scrollX}px`;
      resultBox.style.width = "auto";
      resultBox.style.maxWidth = "600px";

      resultBox.innerHTML = `
        <div class="result-header">
          <span class="result-text">${translatedText}</span>
          <button id="closeResultBtn" class="close-result-btn">✖</button>
        </div>
      `;

      document.body.appendChild(resultBox);

      document.getElementById("closeResultBtn").onclick = () => {
        resultBox.remove();
      };

      chrome.storage.local.get(["theme"], (result) => {
        updateTheme(result.theme || "light");
      });

      setTimeout(() => {
        resultBox.style.opacity = "1";
        resultBox.style.transform = "translateY(0)";
      }, 10);

    } catch (error) {
      const errorBox = document.createElement("div");
      errorBox.id = "translationError";
      errorBox.className = "translation-error";
      errorBox.style.position = "absolute";
      errorBox.style.zIndex = "1001";

      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      errorBox.style.top = `${rect.bottom + window.scrollY + 10}px`;
      errorBox.style.left = `${rect.left + window.scrollX}px`;
      errorBox.style.width = "auto";
      errorBox.style.maxWidth = "600px";

      errorBox.innerHTML = `
        <div class="error-header">
          <span class="error-text">خطا در ترجمه: ${error.message}</span>
          <button id="closeErrorBtn" class="close-error-btn">✖</button>
        </div>
      `;

      document.body.appendChild(errorBox);

      document.getElementById("closeErrorBtn").onclick = () => {
        errorBox.remove();
      };

      chrome.storage.local.get(["theme"], (result) => {
        updateTheme(result.theme || "light");
      });

      setTimeout(() => {
        errorBox.style.opacity = "1";
        errorBox.style.transform = "translateY(0)";
      }, 10);
    }
  });
}