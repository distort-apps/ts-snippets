chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "executeScript") {
    try {
      const blob = new Blob([request.script], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => {
        URL.revokeObjectURL(url);
        script.remove();  // Clean up the script element after it loads
        sendResponse({ success: true });
      };
      script.onerror = (error) => {
        URL.revokeObjectURL(url);
        script.remove();  // Clean up the script element if there's an error
        sendResponse({ success: false, error: error.message });
      };
      document.documentElement.appendChild(script);
    } catch (error) {
      console.error("Error running the snippet:", error);
      sendResponse({ success: false, error: error.message });
    }
    return true; // Keep the message channel open for sendResponse to be called asynchronously
  }
});
