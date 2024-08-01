const nameElement = document.getElementById('name')

chrome.storage.sync.get(['name'], res => {
  nameElement.textContent = `Hello, ${res.name || 'Stranger'}!`
})
