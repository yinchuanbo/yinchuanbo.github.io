// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Monaco editors
    require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});

    require(['vs/editor/editor.main'], function() {
        // Register SCSS language
        monaco.languages.register({ id: 'scss' });
        monaco.languages.setMonarchTokensProvider('scss', {
            tokenizer: {
                root: [
                    [/[@][\w\-_]+/, 'keyword'],
                    [/[$][\w\-_]+/, 'variable'],
                    [/&/, 'operator'],
                    [/[{}]/, 'delimiter.bracket'],
                    [/[;]/, 'delimiter'],
                    [/\/\*/, 'comment', '@comment'],
                    [/\/\/.*$/, 'comment'],
                    [/"([^"\\]|\\.)*$/, 'string.invalid'],
                    [/'([^'\\]|\\.)*$/, 'string.invalid'],
                    [/"/, 'string', '@string."'],
                    [/'/, 'string', '@string.\''],
                    [/[a-z][\w\-_]*/, 'tag'],
                    [/#[\w\-_]+/, 'tag.id'],
                    [/\.[\w\-_]+/, 'tag.class'],
                    [/\d+(\.\d+)?(%|px|em|rem|vh|vw|pt)?/, 'number'],
                    [/[<>]/, 'tag'],
                ],
                comment: [
                    [/[^/*]+/, 'comment'],
                    [/\*\//, 'comment', '@pop'],
                    [/[/*]/, 'comment']
                ],
                string: [
                    [/[^\\"']+/, 'string'],
                    [/\\./, 'string.escape'],
                    [/["']/, { cases: {
                        '@eos': 'string.invalid',
                        '@default': { token: 'string', next: '@pop' }
                    }}]
                ]
            }
        });

        // Create editors
        const htmlEditor = monaco.editor.create(document.getElementById('htmlEditor'), {
            value: '',
            language: 'html',
            theme: 'vs-dark',
            minimap: { enabled: false },
            automaticLayout: true,
            fontSize: 14,
            tabSize: 2,
            fontFamily: 'JetBrains Mono',
            fontLigatures: true
        });

        const cssEditor = monaco.editor.create(document.getElementById('cssEditor'), {
            value: '',
            language: 'scss',
            theme: 'vs-dark',
            minimap: { enabled: false },
            automaticLayout: true,
            fontSize: 14,
            tabSize: 2,
            fontFamily: 'JetBrains Mono',
            fontLigatures: true
        });

        const jsEditor = monaco.editor.create(document.getElementById('jsEditor'), {
            value: '',
            language: 'javascript',
            theme: 'vs-dark',
            minimap: { enabled: false },
            automaticLayout: true,
            fontSize: 14,
            tabSize: 2,
            fontFamily: 'JetBrains Mono',
            fontLigatures: true
        });

        // Function to compile SCSS using the server
        async function compileSCSS(scss) {
            try {
                const response = await fetch('http://localhost:3001/compile-scss', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ scss })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'SCSS compilation failed');
                }

                const data = await response.json();
                return data.css;
            } catch (error) {
                console.error('SCSS compilation error:', error);
                throw error;
            }
        }

        // Function to update preview with debounce
        let updateTimeout;
        function debouncedUpdate() {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(updatePreview, 1000);
        }

        // Function to update preview
        async function updatePreview() {
            const html = htmlEditor.getValue();
            const scss = cssEditor.getValue();
            const js = jsEditor.getValue();

            try {
                // Compile SCSS to CSS
                const css = await compileSCSS(scss);
                
                const iframe = document.getElementById('result');
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const wrappedJs = `
                    document.addEventListener('DOMContentLoaded', () => {
                        try {
                            ${js}
                        } catch (error) {
                            console.error('Error in preview:', error);
                        }
                    });
                `;

                iframeDoc.open();
                iframeDoc.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap" rel="stylesheet">
                        <style>
                            * {
                                font-family: "JetBrains Mono", monospace;
                                font-style: italic;
                            }
                            ${css}
                        </style>
                    </head>
                    <body>
                        ${html}
                        <script>${wrappedJs}</script>
                    </body>
                    </html>
                `);
                iframeDoc.close();
            } catch (error) {
                console.error('Error updating preview:', error);
            }
        }

        // Clear all editors
        function clearEditors() {
            htmlEditor.setValue('');
            cssEditor.setValue('');
            jsEditor.setValue('');
            updatePreview();
        }

        // Add event listeners
        const runButton = document.getElementById('runButton');
        const clearButton = document.getElementById('clearButton');
        
        if (runButton) {
            runButton.addEventListener('click', updatePreview);
        }
        if (clearButton) {
            clearButton.addEventListener('click', clearEditors);
        }

        // Add editor change listeners
        htmlEditor.onDidChangeModelContent(debouncedUpdate);
        cssEditor.onDidChangeModelContent(debouncedUpdate);
        jsEditor.onDidChangeModelContent(debouncedUpdate);

        // Add collapse/expand functionality
        document.querySelectorAll('.collapse-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const container = btn.closest('.editor-container') || btn.closest('.result-container');
                container.classList.toggle('collapsed');
                
                // 重新布局编辑器以适应新的大小
                if (container.contains(document.getElementById('htmlEditor'))) {
                    htmlEditor.layout();
                } else if (container.contains(document.getElementById('cssEditor'))) {
                    cssEditor.layout();
                } else if (container.contains(document.getElementById('jsEditor'))) {
                    jsEditor.layout();
                }
            });
        });

        // Set default content
        htmlEditor.setValue(`<!DOCTYPE html>
<html>
<body>
    <div class="container">
        <h1>Welcome to Code Editor</h1>
        <p>This is a live preview of your code.</p>
        <button id="demoButton" class="button">Click me!</button>
    </div>
</body>
</html>`);

        cssEditor.setValue(`@use "sass:string";
@import url('https://fonts.googleapis.com/css2?family=Righteous&family=Ubuntu+Mono&display=swap');

$str: 'QWERTYUIOPASDFGHJKLZXCVBNMabcdefghigklmnopqrstuvwxyz123456789';
$length: str-length($str);

@function randomNum($max, $min: 0, $u: 1) {
    @return ($min + random($max)) * $u;
}

@mixin randomLinear($rows: 6, $cols: 8) {
  $bg: null;
  $pos: null;

  $px: 100% / ($cols - 1);
  $py: 100% / ($rows - 1);

  @for $i from 0 through $rows - 1 {
    @for $j from 0 through $cols - 1 {
      @if ($bg) {
        $bg: $bg + string.unquote(",");  
        $pos: $pos + string.unquote(",");  
      }
      $color: randomColor();
      $bg: $bg + linear-gradient(to right, $color, $color);
      $pos: $pos + string.unquote("#{$j * $px} #{$i * $py}");
    }
  }
  background: {
    image: $bg;
    size: (100% / $cols) (100% / $rows);
    repeat: no-repeat;
    position: $pos;
  }
}

@function randomColor() {
    @return rgb(randomNum(205, 50), randomNum(255), randomNum(255));
}

@function randomChar() {
    $r: random($length);
    @return str-slice($str, $r, $r);
}

@function randomChars($number) {
    $value: '';

    @if $number > 0 {
        @for $i from 1 through $number {
            $value: $value + randomChar();
        }
    }
    @return $value;
}

body,
html {
    width: 100%;
    height: 100%;
    display: flex;
    background: #000;
    font-family: 'Ubuntu Mono', monospace;
}

.g-container {
    position: relative;
    margin: auto;
    width: 300px;
    height: 300px;
    overflow: hidden;
}

.g-item  {
    height: 300px;
    color: #fff;
    font-size: 50px;
    line-height: 50px;
    letter-spacing: 25px;
    word-wrap: break-word;
    animation: colorChange 1.5s infinite steps(10);
    cursor: pointer;
    
    &::before {
        content: randomChars(36);
        position: absolute;
        inset: 0;
        color: transparent;
        @include randomLinear(6, 6);
    }
}

.g-container:nth-child(2) .g-item::before {
    content: randomChars(36);
    --content1: "#{randomChars(36)}";
    --content2: "#{randomChars(36)}";
    --content3: "#{randomChars(36)}";
    --content4: "#{randomChars(36)}";
    --content5: "#{randomChars(36)}";
    --content6: "#{randomChars(36)}";
    --content7: "#{randomChars(36)}";
    --content8: "#{randomChars(36)}";
    --content9: "#{randomChars(36)}";
    color: transparent;
    background-clip: text;
    animation: contentChange 1.5s infinite linear;
}

.g-container .g-item:hover {
    animation-play-state: paused;

    &::before {
        animation-play-state: paused;
    }
}

@keyframes colorChange {
    100% {
        filter: hue-rotate(999deg);
    }
}

@keyframes contentChange {
    10% {
        content: var(--content1);
    }
    20% {
        content: var(--content2);
    }
    30% {
        content: var(--content3);
    }
    40% {
        content: var(--content4);
    }
    50% {
        content: var(--content5);
    }
    60% {
        content: var(--content6);
    }
    70% {
        content: var(--content7);
    }
    80% {
        content: var(--content8);
    }
    90% {
        content: var(--content9);
    }
}`);

        jsEditor.setValue(`// 获取按钮元素
const demoButton = document.getElementById('demoButton');
let clickCount = 0;

// 添加点击事件监听器
if (demoButton) {
    demoButton.addEventListener('click', () => {
        clickCount++;
        demoButton.textContent = \`Clicked \${clickCount} time\${clickCount === 1 ? '' : 's'}!\`;
        
        // 添加点击动画
        demoButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            demoButton.style.transform = 'translateY(-2px)';
        }, 100);
    });
}`);

        // Initial preview
        updatePreview();
    });
});
