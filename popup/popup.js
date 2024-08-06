const nameElement = document.getElementById('name');

chrome.storage.sync.get(['name', 'color'], res => {
  if (res.name) {
    nameElement.textContent = `Hello, ${res.name}!`;
  }
  if (res.color) {
    nameElement.style.color = res.color;
  }
});
