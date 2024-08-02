document.getElementById('runSnippet').addEventListener('click', () => {
    const content = editor.getValue();
    runSnippet(content);
  });
  
 