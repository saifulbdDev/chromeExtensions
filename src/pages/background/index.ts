import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

// src/background.ts

// Function to generate a unique identifier for a URL
function generateUniqueId(url: string) {
  const domain = new URL(url).hostname;

  return domain;
}

// Function to get the current tab URL
function getCurrentTabUrl(callback: (url: string | undefined) => void) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const url = tab?.url ? generateUniqueId(tab?.url) : "";
    callback(url);
  });
}
function isDomain(arg: string) {
  let regexDomain = /^\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (arg.match(regexDomain)) {
    return true;
  } else {
    return false;
  }
}
// Function to update visited URLs in storage
function updateVisitedUrls(url: string) {
  chrome.storage.local.get("visitedUrls", (result) => {
    const visitedUrls: string[] = result.visitedUrls || [];

    // Check if the URL is already in the list
    if (!visitedUrls.includes(url) && isDomain(url)) {
      visitedUrls.push(url);
      chrome.storage.local.set({ visitedUrls });
    }
  });
}

// Listener for tab changes (when a new URL is visited)
chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    getCurrentTabUrl((url) => {
      if (url) {
        updateVisitedUrls(url);
        // Notify the content script about the visited page
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id as number, {
              action: "visitedPage",
              url,
            });
          }
        });
      }
    });
  }
});


// Initialize visited URLs storage when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ visitedUrls: [] });
});
// Listener for removing a URL
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.action === "removeUrl") {
    removeElement();
  }
});

function removeElement() {
  // Replace this with your logic to remove the element
  const elementToRemove = document.getElementById("chrome-extension");
  if (elementToRemove) {
    elementToRemove.remove();
    console.log("Element removed successfully");
  } else {
    console.warn("Element not found for removal");
  }
}
