const snippetsContainer = document.getElementById('snippets');
const addSnippetButton = document.getElementById('addSnippet');
const runSnippetButton = document.getElementById('runSnippet');
let editor;

export function initializeMonaco() {
  console.log('Initializing Monaco Editor');
  editor = monaco.editor.create(document.getElementById('editor'), {
    value: '',
    language: 'typescript',
    theme: 'vs-dark',
  });

  // Load saved snippets from storage
  chrome.storage.local.get(['tsSnippets'], function(result) {
    const snippets = result.tsSnippets || [];
    snippets.forEach((snippet, index) => {
      addSnippetToUI(snippet, index);
    });
  });

  addSnippetButton.addEventListener('click', () => {
    const snippetContent = editor.getValue();
    if (snippetContent.trim()) {
      saveSnippet(snippetContent);
    }
  });

  runSnippetButton.addEventListener('click', () => {
    const snippetContent = editor.getValue();
    if (snippetContent.trim()) {
      runSnippet(snippetContent);
    }
  });
}

function saveSnippet(content) {
  chrome.storage.local.get(['tsSnippets'], function(result) {
    const snippets = result.tsSnippets || [];
    snippets.push(content);
    chrome.storage.local.set({ tsSnippets: snippets }, function() {
      addSnippetToUI(content, snippets.length - 1);
      editor.setValue('');
    });
  });
}

function addSnippetToUI(content, index) {
  const snippetDiv = document.createElement('div');
  snippetDiv.classList.add('snippet');
  snippetDiv.innerText = content;
  snippetDiv.dataset.index = index;

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click', () => {
    deleteSnippet(index);
  });

  snippetDiv.appendChild(deleteButton);
  snippetsContainer.appendChild(snippetDiv);
}

function deleteSnippet(index) {
  chrome.storage.local.get(['tsSnippets'], function(result) {
    const snippets = result.tsSnippets || [];
    snippets.splice(index, 1);
    chrome.storage.local.set({ tsSnippets: snippets }, function() {
      loadSnippets();
    });
  });
}

function loadSnippets() {
  snippetsContainer.innerHTML = '';
  chrome.storage.local.get(['tsSnippets'], function(result) {
    const snippets = result.tsSnippets || [];
    snippets.forEach((snippet, index) => {
      addSnippetToUI(snippet, index);
    });
  });
}

function runSnippet(content) {
  const jsContent = ts.transpileModule(content, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;

  console.log("Compiled JavaScript:", jsContent);

  chrome.devtools.inspectedWindow.eval(jsContent, function(result, isException) {
    if (isException) {
      console.error("Error running the snippet:", result);
    } else {
      console.log("Snippet ran successfully:", result);
    }
  });
}
