console.log("content loaded");

/**
 * @description
 * Chrome extensions don't support modules in content scripts.
 */
import("./components/Demo");
// src/content.ts

// Function to generate a unique identifier for a URL
function generateUniqueId(url: string) {
  const domain = new URL(url).hostname;
  return domain;
}


chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    console.log(message.action, "message.action");
  if (message.action === "visitedPage") {
    const url = message.url;

    // Check if this URL has not been visited before
    chrome.storage.local.get("visitedUrls", (result) => {
      const visitedUrls: string[] = result.visitedUrls || [];
      const uniqueId = generateUniqueId(url);
      console.log(visitedUrls, "visitedUrls from content");
      if (!visitedUrls.includes(uniqueId)) {
        visitedUrls.push(uniqueId);
        chrome.storage.local.set({ visitedUrls });

        // Inject text into the DOM (modify this part to your needs)
        const textElement = document.createElement("div");
        textElement.textContent = "Visited: " + url;
        document.body.appendChild(textElement);
      }
    });
  }
});
