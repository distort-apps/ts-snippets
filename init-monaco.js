window.require.config({ paths: { 'vs': 'libs/monaco-editor/min/vs' }});
window.require(['vs/editor/editor.main'], function() {
    console.log('Monaco Editor Loaded');
    if (typeof TS_Snippets.initializeMonaco === 'function') {
        TS_Snippets.initializeMonaco();
    } else {
        console.error('initializeMonaco function is not defined.');
    }
});
