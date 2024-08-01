chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "executeScript") {
      try {
        const blob = new Blob([request.script], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => URL.revokeObjectURL(url);
        document.documentElement.appendChild(script);
        sendResponse({ success: true });
      } catch (error) {
        console.error("Error running the snippet:", error);
        sendResponse({ success: false, error: error.message });
      }
    }
  });
  