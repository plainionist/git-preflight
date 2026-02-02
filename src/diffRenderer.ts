import { FileDiff, Hunk, DiffLine } from './diffParser';

export function renderDiffToHtml(files: FileDiff[]): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Git Preflight Diff</title>
    <style>
        body {
            font-family: monospace;
            font-size: 14px;
            margin: 0;
            padding: 16px;
            background: #1e1e1e;
            color: #d4d4d4;
        }
        .file {
            margin-bottom: 24px;
            border: 1px solid #3c3c3c;
            border-radius: 4px;
            overflow: hidden;
        }
        .file-header {
            background: #252526;
            padding: 8px 12px;
            font-weight: bold;
            border-bottom: 1px solid #3c3c3c;
        }
        .hunk-header {
            background: #2d2d30;
            padding: 4px 12px;
            color: #569cd6;
        }
        .line {
            padding: 0 12px;
            white-space: pre;
        }
        .line-added {
            background: #2d4a2d;
            color: #89d185;
        }
        .line-removed {
            background: #4a2d2d;
            color: #f48771;
        }
        .line-unchanged {
            background: transparent;
        }
    </style>
</head>
<body>
${files.map(renderFile).join('\n')}
</body>
</html>`;
}

function renderFile(file: FileDiff): string {
    const path = file.newPath || file.oldPath;
    return `    <div class="file">
        <div class="file-header">${escapeHtml(path)}</div>
${file.hunks.map(renderHunk).join('\n')}
    </div>`;
}

function renderHunk(hunk: Hunk): string {
    return `        <div class="hunk-header">${escapeHtml(hunk.header)}</div>
${hunk.lines.map(renderLine).join('\n')}`;
}

function renderLine(line: DiffLine): string {
    const prefix = line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' ';
    const className = `line line-${line.type}`;
    return `        <div class="${className}">${prefix}${escapeHtml(line.content)}</div>`;
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
