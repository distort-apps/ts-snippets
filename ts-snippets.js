const snippets = [];

const snippetsContainer = document.getElementById('snippets-container');
const newSnippetButton = document.getElementById('newSnippet');
const runSnippetButton = document.getElementById('runSnippet');
let editor;
let activeSnippetIndex = null;
let isDeletingSnippet = false;

export function initializeMonaco() {
  console.log('Initializing Monaco Editor');
  editor = monaco.editor.create(document.getElementById('editor'), {
    value: '',
    language: 'typescript',
    theme: 'vs-dark',
  });

  // Load saved snippets from storage
  chrome.storage.local.get(['tsSnippets'], function(result) {
    const loadedSnippets = result.tsSnippets || [];
    loadedSnippets.forEach((snippet, index) => {
      snippets.push(snippet);
      renderSnippet(index);
    });
  });

  newSnippetButton.addEventListener('click', addSnippet);

  runSnippetButton.addEventListener('click', () => {
    const snippetContent = editor.getValue();
    if (snippetContent.trim()) {
      runSnippet(snippetContent);
    }
  });

  // Add event listener for Command + Enter (Mac) or Ctrl + Enter (Windows/Linux)
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function() {
    const snippetContent = editor.getValue();
    if (snippetContent.trim()) {
      runSnippet(snippetContent);
    }
  });

  // Automatically save the content of the editor when it changes
  editor.onDidChangeModelContent(() => {
    if (!isDeletingSnippet && activeSnippetIndex !== null && activeSnippetIndex < snippets.length) {
      snippets[activeSnippetIndex].content = editor.getValue();
      saveSnippets();
    }
  });
}

export function addSnippet() {
  const snippetNum = snippets.length;
  snippets.push({ title: '', content: '' });
  renderSnippet(snippetNum);
  saveSnippets();
}

function renderSnippet(snippetNum) {
  const snippet = snippets[snippetNum];
  const snippetRow = document.createElement('div');
  snippetRow.classList.add('snippet');

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.placeholder = `Snippet ${snippetNum + 1}`;
  titleInput.value = snippet.title;
  titleInput.classList.add('snippet-title-input');
  titleInput.addEventListener('change', () => {
    snippets[snippetNum].title = titleInput.value;
    saveSnippets();
  });

  titleInput.addEventListener('click', () => {
    if (activeSnippetIndex !== null) {
      snippets[activeSnippetIndex].content = editor.getValue();
    }
    activeSnippetIndex = snippetNum;
    editor.setValue(snippet.content);
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('snippet-delete-button');
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteBtn.addEventListener('click', () => {
    deleteSnippet(snippetNum);
  });

  snippetRow.appendChild(titleInput);
  snippetRow.appendChild(deleteBtn);
  snippetsContainer.appendChild(snippetRow);
}

function deleteSnippet(snippetNum) {
  isDeletingSnippet = true;
  snippets.splice(snippetNum, 1);

  if (activeSnippetIndex === snippetNum) {
    activeSnippetIndex = null;
    editor.setValue('');
  } else if (activeSnippetIndex > snippetNum) {
    activeSnippetIndex -= 1;
  }

  // Ensure activeSnippetIndex is valid and focus on the next snippet if exists
  if (activeSnippetIndex !== null && activeSnippetIndex >= snippets.length) {
    activeSnippetIndex = null;
    editor.setValue('');
  } else if (activeSnippetIndex !== null) {
    editor.setValue(snippets[activeSnippetIndex].content);
  }

  saveSnippets();
  renderSnippets();
  isDeletingSnippet = false;
}

function renderSnippets() {
  snippetsContainer.innerHTML = '';
  snippets.forEach((snippet, snippetNum) => {
    renderSnippet(snippetNum);
  });
}

function saveSnippets() {
  try {
    chrome.storage.local.set({ tsSnippets: snippets }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving snippets:", chrome.runtime.lastError);
      } else {
        console.log('Snippets saved successfully');
      }
    });
  } catch (error) {
    console.error("Error in saveSnippets:", error);
  }
}

export function runSnippet(content) {
  try {
    const jsContent = ts.transpileModule(content, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
    
    console.log("Compiled JavaScript:", jsContent);
    
    chrome.devtools.inspectedWindow.eval(jsContent, function(result, isException) {
      if (isException) {
        console.error("Error running the snippet:", result);
      } else {
        console.log("Snippet ran successfully:", result);
      }
    });
    
  } catch (error) {
    console.log("Are you missing a log statement? 🤔", error);
  }
}
