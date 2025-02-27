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