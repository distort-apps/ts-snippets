const nameInput = document.getElementById('name');
const saveButton = document.getElementById('save');
const colorPicker = document.getElementById('color-picker');

saveButton.addEventListener('click', () => {
  const name = nameInput.value;
  const color = colorPicker.value;
  chrome.storage.sync.set({ name, color }, () => {
    applyColor(color);
  });
});

chrome.storage.sync.get(['name', 'color'], (res) => {
  if (res.name) {
    nameInput.value = res.name;
  } else {
    nameInput.placeholder = 'Enter your name';
  }
  if (res.color) {
    colorPicker.value = res.color;
    applyColor(res.color);
  }
});

function applyColor(color) {
  nameInput.style.color = color;
}
