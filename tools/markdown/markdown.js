/**
 * Markdown Preview - Main Logic
 * Simple markdown to HTML converter
 */

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('markdownInput');
    const preview = document.getElementById('markdownPreview');
    const toolbarBtns = document.querySelectorAll('.toolbar-btn');
    const clearBtn = document.getElementById('clearBtn');
    const downloadMd = document.getElementById('downloadMd');
    const downloadHtml = document.getElementById('downloadHtml');
    const copyHtml = document.getElementById('copyHtml');

    // Simple markdown parser
    function parseMarkdown(text) {
        let html = text;

        // Escape HTML
        html = html.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');

        // Code blocks (must be first)
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
        });

        // Headers
        html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
        html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
        html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

        // Bold
        html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.+?)_/g, '<em>$1</em>');

        // Strikethrough
        html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

        // Images
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

        // Horizontal rule
        html = html.replace(/^---$/gm, '<hr>');
        html = html.replace(/^\*\*\*$/gm, '<hr>');

        // Blockquotes
        html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
        
        // Merge consecutive blockquotes
        html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

        // Unordered lists
        html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)\n(<li>)/g, '$1$2');
        html = html.replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>');

        // Ordered lists
        html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

        // Tables
        html = html.replace(/^\|(.+)\|$/gm, (match, content) => {
            const cells = content.split('|').map(c => c.trim());
            if (cells.every(c => c.match(/^-+$/))) {
                return '<!-- table-divider -->';
            }
            return '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
        });
        html = html.replace(/(<tr>.*?<\/tr>)+/g, '<table>$&</table>');
        html = html.replace(/<tr>(.*?)<td>(.*?)<\/td>(.*?)<\/tr>/g, (match, before, content, after) => {
            if (before.includes('<td>')) return match;
            return '<tr><th>' + content + '</th>' + after + '</tr>';
        });

        // Paragraphs
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';

        // Clean up empty paragraphs
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p>(<h[1-6]>)/g, '$1');
        html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
        html = html.replace(/<p>(<ul>)/g, '$1');
        html = html.replace(/(<\/ul>)<\/p>/g, '$1');
        html = html.replace(/<p>(<ol>)/g, '$1');
        html = html.replace(/(<\/ol>)<\/p>/g, '$1');
        html = html.replace(/<p>(<blockquote>)/g, '$1');
        html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
        html = html.replace(/<p>(<pre>)/g, '$1');
        html = html.replace(/(<\/pre>)<\/p>/g, '$1');
        html = html.replace(/<p>(<table>)/g, '$1');
        html = html.replace(/(<\/table>)<\/p>/g, '$1');
        html = html.replace(/<p>(<hr>)<\/p>/g, '$1');

        return html;
    }

    // Update preview
    function updatePreview() {
        const markdown = input.value;
        preview.innerHTML = parseMarkdown(markdown);
    }

    // Insert text at cursor
    function insertAtCursor(before, after = '') {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const selected = input.value.substring(start, end);
        
        const newText = before + selected + after;
        input.setRangeText(newText, start, end, 'end');
        
        input.focus();
        updatePreview();
    }

    // Toolbar actions
    toolbarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            
            switch (action) {
                case 'bold':
                    insertAtCursor('**', '**');
                    break;
                case 'italic':
                    insertAtCursor('*', '*');
                    break;
                case 'strikethrough':
                    insertAtCursor('~~', '~~');
                    break;
                case 'h1':
                    insertAtCursor('# ');
                    break;
                case 'h2':
                    insertAtCursor('## ');
                    break;
                case 'h3':
                    insertAtCursor('### ');
                    break;
                case 'link':
                    insertAtCursor('[', '](url)');
                    break;
                case 'image':
                    insertAtCursor('![alt](', ')');
                    break;
                case 'code':
                    insertAtCursor('`', '`');
                    break;
                case 'codeblock':
                    insertAtCursor('```\n', '\n```');
                    break;
                case 'ul':
                    insertAtCursor('- ');
                    break;
                case 'ol':
                    insertAtCursor('1. ');
                    break;
                case 'quote':
                    insertAtCursor('> ');
                    break;
                case 'hr':
                    insertAtCursor('\n---\n');
                    break;
                case 'table':
                    insertAtCursor('| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |');
                    break;
            }
        });
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
        if (confirm('Очистить редактор?')) {
            input.value = '';
            updatePreview();
        }
    });

    // Download as MD
    downloadMd.addEventListener('click', () => {
        const blob = new Blob([input.value], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Download as HTML
    downloadHtml.addEventListener('click', () => {
        const html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Markdown Document</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; }
        pre { background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow-x: auto; }
        code { background: #f5f5f5; padding: 0.2rem 0.4rem; border-radius: 3px; }
        pre code { background: none; padding: 0; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding: 0.5rem 1rem; color: #666; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
        th { background: #f5f5f5; }
    </style>
</head>
<body>
${preview.innerHTML}
</body>
</html>`;
        
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.html';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Copy HTML
    copyHtml.addEventListener('click', () => {
        navigator.clipboard.writeText(preview.innerHTML);
        showNotification('HTML скопирован!');
    });

    // Keyboard shortcuts
    input.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'b':
                    e.preventDefault();
                    insertAtCursor('**', '**');
                    break;
                case 'i':
                    e.preventDefault();
                    insertAtCursor('*', '*');
                    break;
            }
        }
    });

    // Input listener
    input.addEventListener('input', updatePreview);

    // Initial render
    updatePreview();
});
