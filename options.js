const nameInput = document.getElementById('name')
const saveButton = document.getElementById('save')

saveButton.addEventListener('click', () => {
  const name = nameInput.value
  chrome.storage.sync.set({ name }, () => {
    console.log('Name is set to ' + name)
  })
})

chrome.storage.sync.get(['name'], (res) => nameInput.value = res.name)