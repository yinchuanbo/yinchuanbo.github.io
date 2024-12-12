// Initialize CodeMirror editors
const createEditor = (element, mode) => {
    return CodeMirror.fromTextArea(element, {
        mode: mode,
        theme: "ayu-dark",
        lineNumbers: true,
        lineWrapping: true,
        indentUnit: 2,
        tabSize: 2,
        autoCloseBrackets: true,
        matchBrackets: true,
        autoCloseTags: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        extraKeys: {
            "Ctrl-Space": "autocomplete",
            "Ctrl-/": "toggleComment",
            "Ctrl-Q": function(cm) {
                cm.foldCode(cm.getCursor());
            }
        }
    });
};

const htmlEditor = createEditor(document.getElementById("htmlEditor"), "xml");
const cssEditor = createEditor(document.getElementById("cssEditor"), "css");
const jsEditor = createEditor(document.getElementById("jsEditor"), "javascript");

// Function to update the preview with debounce
let updateTimeout;
function debouncedUpdate() {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(updatePreview, 1000);
}

// Function to update the preview
function updatePreview() {
    const html = htmlEditor.getValue();
    const css = cssEditor.getValue();
    const js = jsEditor.getValue();

    const iframe = document.getElementById('result');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // 使用立即执行函数来避免变量名冲突
    const wrappedJs = `(function() { ${js} })();`;

    iframeDoc.open();
    iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${css}</style>
        </head>
        <body>
            ${html}
            <script>${wrappedJs}</script>
        </body>
        </html>
    `);
    iframeDoc.close();
}

// Clear all editors
function clearEditors() {
    htmlEditor.setValue('');
    cssEditor.setValue('');
    jsEditor.setValue('');
    updatePreview();
}

// Add event listeners
document.getElementById('runButton').addEventListener('click', updatePreview);
document.getElementById('clearButton').addEventListener('click', clearEditors);

// Add auto-update on editor changes
htmlEditor.on('change', debouncedUpdate);
cssEditor.on('change', debouncedUpdate);
jsEditor.on('change', debouncedUpdate);

// Set default content
htmlEditor.setValue(`<!DOCTYPE html>
<html>
<body>
    <div class="container">
        <h1>Welcome to Code Editor</h1>
        <p>Start coding your web project here!</p>
        <button id="demoButton">Click me!</button>
    </div>
</body>
</html>`);

cssEditor.setValue(`body {
    font-family: system-ui, -apple-system, sans-serif;
    margin: 0;
    padding: 20px;
    background: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.container {
    max-width: 600px;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
}

h1 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 2rem;
}

#demoButton {
    background: #0078d4;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    transition: transform 0.2s, background 0.2s;
}

#demoButton:hover {
    background: #0066b5;
    transform: translateY(-2px);
}`);

jsEditor.setValue(`// 获取按钮元素
const demoButton = document.getElementById('demoButton');
let clickCount = 0;

// 添加点击事件监听器
demoButton.addEventListener('click', () => {
    clickCount++;
    demoButton.textContent = \`Clicked \${clickCount} time\${clickCount === 1 ? '' : 's'}!\`;
    
    // 添加点击动画效果
    demoButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        demoButton.style.transform = 'none';
    }, 100);
});`);

// Initial preview
updatePreview();
