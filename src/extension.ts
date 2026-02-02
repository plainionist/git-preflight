import * as vscode from 'vscode';
import { getDiff } from './git';
import { parseDiff } from './diffParser';
import { renderDiffToHtml } from './diffRenderer';

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
            const html = renderDiffToHtml(parsedDiff);

            const panel = vscode.window.createWebviewPanel(
                'gitPreflightDiff',
                'Git Preflight',
                vscode.ViewColumn.One,
                { enableScripts: false }
            );

            panel.webview.html = html;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            vscode.window.showErrorMessage(`Git Preflight: Failed to get diff - ${message}`);
        }
    });

    context.subscriptions.push(showDiff);
}

export function deactivate() {}
