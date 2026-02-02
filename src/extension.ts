import * as vscode from 'vscode';
import { getDiff } from './git';
import { parseDiff } from './diffParser';

export function activate(context: vscode.ExtensionContext) {
    const showDiff = vscode.commands.registerCommand('git-preflight.showDiff', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('Git Preflight: No workspace folder open');
            return;
        }

        try {
            const diff = await getDiff(workspaceFolder.uri.fsPath);
            if (!diff) {
                vscode.window.showInformationMessage('Git Preflight: No changes detected');
                return;
            }

            const parsedDiff = parseDiff(diff);
            const fileCount = parsedDiff.length;
            const hunkCount = parsedDiff.reduce((sum, file) => sum + file.hunks.length, 0);
            vscode.window.showInformationMessage(`Git Preflight: Parsed ${fileCount} file(s) with ${hunkCount} hunk(s)`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            vscode.window.showErrorMessage(`Git Preflight: Failed to get diff - ${message}`);
        }
    });

    context.subscriptions.push(showDiff);
}

export function deactivate() {}
