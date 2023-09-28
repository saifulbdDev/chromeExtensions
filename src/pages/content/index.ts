import("./components/Demo");
chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
  console.log(message, "message");
  if (message?.action === "visitedPage") {
    const url = message.url;

    // Check if this URL has been visited before
    chrome.storage.local.get("visitedUrls", async (result) => {
      const visitedUrls = result.visitedUrls || [];

      if (url && visitedUrls.includes(url)) {
       
      }
    });
  }
});
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