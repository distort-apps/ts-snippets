var TS_Snippets;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!****************************************!*\
  !*** ./src/ts-snippets/ts-snippets.js ***!
  \****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addSnippet: () => (/* binding */ addSnippet),
/* harmony export */   initializeMonaco: () => (/* binding */ initializeMonaco)
/* harmony export */ });
const snippets = [];

const snippetsContainer = document.getElementById('snippets-container');
const newSnippetButton = document.getElementById('newSnippet');
const runSnippetButton = document.getElementById('runSnippet');
let editor;
let activeSnippetIndex = null;

function initializeMonaco() {
  console.log('Initializing Monaco Editor');
  editor = monaco.editor.create(document.getElementById('editor'), {
    value: '',
    language: 'typescript',
    theme: 'vs-dark',
  });

  simulateEscapeKeyPress();

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
    if (activeSnippetIndex !== null) {
      snippets[activeSnippetIndex].content = editor.getValue();
      saveSnippets();
    }
  });
}

function addSnippet() {
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
  snippets.splice(snippetNum, 1);
  if (activeSnippetIndex === snippetNum) {
    editor.setValue('');
    activeSnippetIndex = null;
  } else if (activeSnippetIndex > snippetNum) {
    activeSnippetIndex -= 1;
  }
  saveSnippets();
  renderSnippets();
}

function renderSnippets() {
  snippetsContainer.innerHTML = '';
  snippets.forEach((_, snippetNum) => {
    renderSnippet(snippetNum);
  });
}

function saveSnippets() {
  chrome.storage.local.set({ tsSnippets: snippets });
}

function simulateEscapeKeyPress() {
  const event = new KeyboardEvent('keydown', {
    key: 'Escape',
    keyCode: 27,
    code: 'Escape',
    which: 27,
    bubbles: true,
    cancelable: true,
    composed: true,
  });

  document.dispatchEvent(event);
}

function runSnippet(content) {
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

  } catch(error) {
    console.log("Are you missing a log statement? 🤔");
  }
}

TS_Snippets = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=bundle.js.map