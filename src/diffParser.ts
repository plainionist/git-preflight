export type LineType = 'added' | 'removed' | 'unchanged';

export interface DiffLine {
    type: LineType;
    content: string;
}

export interface Hunk {
    header: string;
    lines: DiffLine[];
}

export interface FileDiff {
    oldPath: string;
    newPath: string;
    hunks: Hunk[];
}

export function parseDiff(raw: string): FileDiff[] {
    const files: FileDiff[] = [];
    const lines = raw.split('\n');

    let currentFile: FileDiff | null = null;
    let currentHunk: Hunk | null = null;

    for (const line of lines) {
        if (line.startsWith('diff --git')) {
            currentFile = { oldPath: '', newPath: '', hunks: [] };
            files.push(currentFile);
            currentHunk = null;
            continue;
        }

        if (!currentFile) {
            continue;
        }

        if (line.startsWith('--- ')) {
            currentFile.oldPath = extractPath(line.substring(4));
            continue;
        }

        if (line.startsWith('+++ ')) {
            currentFile.newPath = extractPath(line.substring(4));
            continue;
        }

        if (line.startsWith('@@')) {
            currentHunk = { header: line, lines: [] };
            currentFile.hunks.push(currentHunk);
            continue;
        }

        if (!currentHunk) {
            continue;
        }

        if (line.startsWith('+')) {
            currentHunk.lines.push({ type: 'added', content: line.substring(1) });
        } else if (line.startsWith('-')) {
            currentHunk.lines.push({ type: 'removed', content: line.substring(1) });
        } else if (line.startsWith(' ') || line === '') {
            currentHunk.lines.push({ type: 'unchanged', content: line.substring(1) });
        }
    }

    return files;
}

function extractPath(path: string): string {
    if (path.startsWith('a/') || path.startsWith('b/')) {
        return path.substring(2);
    }
    return path;
}
