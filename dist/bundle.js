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
/*!************************!*\
  !*** ./ts-snippets.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initializeMonaco: () => (/* binding */ initializeMonaco)
/* harmony export */ });
const snippetsContainer = document.getElementById('snippets');
const addSnippetButton = document.getElementById('addSnippet');
const runSnippetButton = document.getElementById('runSnippet');
let editor;

function initializeMonaco() {
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

TS_Snippets = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=bundle.js.map