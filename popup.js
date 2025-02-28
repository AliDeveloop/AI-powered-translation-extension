document.getElementById("lightTheme").addEventListener("click", () => {
  chrome.storage.local.set({ theme: "light" }, () => {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { action: "updateTheme", theme: "light" });
      });
    });
  });
});

document.getElementById("darkTheme").addEventListener("click", () => {
  chrome.storage.local.set({ theme: "dark" }, () => {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { action: "updateTheme", theme: "dark" });
      });
    });
  });
});

// لود تم فعلی
chrome.storage.local.get(["theme"], (result) => {
  if (result.theme === "dark") {
    document.getElementById("darkTheme").style.backgroundColor = "#007bff";
    document.getElementById("darkTheme").style.color = "#ffffff";
    document.getElementById("lightTheme").style.backgroundColor = "#ffffff";
    document.getElementById("lightTheme").style.color = "#007bff";
  } else {
    document.getElementById("lightTheme").style.backgroundColor = "#007bff";
    document.getElementById("lightTheme").style.color = "#ffffff";
    document.getElementById("darkTheme").style.backgroundColor = "#ffffff";
    document.getElementById("darkTheme").style.color = "#007bff";
  }
});

// ذخیره API Key
document.getElementById("saveApiKey").addEventListener("click", () => {
  const apiKey = document.getElementById("apiKeyInput").value.trim();
  if (apiKey) {
    chrome.storage.local.set({ apiKey: apiKey }, () => {
      alert("API Key با موفقیت ذخیره شد!");
      document.getElementById("apiKeyInput").value = ""; // خالی کردن فیلد بعد از ذخیره
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { action: "updateApiKey" });
        });
      });
    });
  } else {
    alert("لطفاً یک API Key معتبر وارد کنید!");
  }
});

// لود API Key فعلی (اختیاری، برای نمایش)
chrome.storage.local.get(["apiKey"], (result) => {
  if (result.apiKey) {
    document.getElementById("apiKeyInput").value = result.apiKey;
  }
});