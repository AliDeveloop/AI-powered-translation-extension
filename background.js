chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translateWithGemini",
    title: "Translate with Gemini",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translateWithGemini") {
    const selectedText = info.selectionText;
    chrome.tabs.sendMessage(tab.id, {
      action: "showTranslateBox",
      text: selectedText
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.log("Error sending message: " + chrome.runtime.lastError.message);
      } else {
        console.log("Message sent successfully");
      }
    });
  }
});