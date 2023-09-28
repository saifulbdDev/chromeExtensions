// src/popup/Popup.tsx
import "@pages/popup/popup.css";
import React, { useEffect, useState } from "react";

function Popup() {
  const [visitedUrls, setVisitedUrls] = useState<string[]>([]);

  useEffect(() => {
    // Load visited URLs from storage and set them to the state
    chrome.storage.local.get("visitedUrls", (result) => {
      const storedUrls: string[] = result.visitedUrls || [];
     
      setVisitedUrls(storedUrls);
    });
  }, []);

  // Function to handle URL removal
  const handleRemoveUrl = (urlToRemove: string) => {
    // Remove the URL from visitedUrls and update storage

    const updatedUrls = visitedUrls.filter((url) => url !== urlToRemove);
    setVisitedUrls(updatedUrls);
    chrome.storage.local.set({ visitedUrls: updatedUrls });
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      console.log(tabs, "tabs");
      if (tabs[0]?.id) {
        console.log(tabs[0], "removeUrl");
        chrome.tabs.sendMessage(tabs[0].id as number, {
          action: "removeUrl",
          url: urlToRemove,
        });
      }
    });
  };

  return (
    <div className="popup">
      <h1 className="visited-title">Visited URLs</h1>
      <ul className="visited-list">
        {visitedUrls.length ? (
          visitedUrls.map((url) => (
            <li key={url}>
              <a target="_blank" href={`https://${url}`}>
                {url}
              </a>
              <button className="btn" onClick={() => handleRemoveUrl(url)}>
                Remove
              </button>
            </li>
          ))
        ) : (
          <li>URLs Not found</li>
        )}
      </ul>
    </div>
  );
}

export default Popup;
