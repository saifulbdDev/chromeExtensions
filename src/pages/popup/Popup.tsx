// src/popup/Popup.tsx
import "@pages/popup/popup.css";
import React, { useEffect, useState } from "react";

function Popup() {
  const [visitedUrls, setVisitedUrls] = useState<string[]>([]);

  useEffect(() => {
    // Load visited URLs from storage and set them to the state
    chrome.storage.local.get("visitedUrls", (result) => {
      const storedUrls: string[] = result.visitedUrls || [];
      console.log(result.visitedUrls, "result.visitedUrls");
      setVisitedUrls(storedUrls);
    });
  }, []);

  // Function to handle URL removal
  const handleRemoveUrl = (urlToRemove: string) => {
    // Remove the URL from visitedUrls and update storage
    chrome.runtime.sendMessage({ action: "removeUrl", url: urlToRemove });
    const updatedUrls = visitedUrls.filter((url) => url !== urlToRemove);
    setVisitedUrls(updatedUrls);
  };

  return (
    <div className="popup">
      <h1 className="visited-title">Visited URLs</h1>
      <ul className="visited-list">
        {visitedUrls.map((url) => (
          <li key={url}>
            <p>{url}</p>
            <button className="btn" onClick={() => handleRemoveUrl(url)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Popup;
