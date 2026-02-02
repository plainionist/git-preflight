import * as vscode from 'vscode';
import { getDiff } from './git';

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
            vscode.window.showInformationMessage(`Git Preflight: Captured ${diff.length} characters of diff`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            vscode.window.showErrorMessage(`Git Preflight: Failed to get diff - ${message}`);
        }
    });

    context.subscriptions.push(showDiff);
}

export function deactivate() {}
