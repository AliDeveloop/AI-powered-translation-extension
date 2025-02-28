document.getElementById("getApiKeyButton").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://aistudio.google.com/apikey" });
  });