import * as vscode from 'vscode';
import { getDiff } from './git';
import { parseDiff } from './diffParser';
import { renderDiffToHtml } from './diffRenderer';

let diffPanel: vscode.WebviewPanel | undefined;
let needsRefresh = false;

async function refreshDiff(): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder || !diffPanel) {
        return;
    }

    try {
        const diff = await getDiff(workspaceFolder.uri.fsPath);
        const parsedDiff = parseDiff(diff);
        const html = renderDiffToHtml(parsedDiff);
        diffPanel.webview.html = html;
        needsRefresh = false;
    } catch {
        // Silently ignore refresh errors
    }
}

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

            if (diffPanel) {
                diffPanel.webview.html = html;
                diffPanel.reveal(vscode.ViewColumn.One);
            } else {
                diffPanel = vscode.window.createWebviewPanel(
                    'gitPreflightDiff',
                    'Git Preflight',
                    vscode.ViewColumn.One,
                    { enableScripts: false }
                );

                diffPanel.onDidDispose(() => {
                    diffPanel = undefined;
                    needsRefresh = false;
                });

                diffPanel.onDidChangeViewState(() => {
                    if (diffPanel?.visible && needsRefresh) {
                        refreshDiff();
                    }
                });

                diffPanel.webview.html = html;
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            vscode.window.showErrorMessage(`Git Preflight: Failed to get diff - ${message}`);
        }
    });

    const onSave = vscode.workspace.onDidSaveTextDocument(() => {
        if (!diffPanel) {
            return;
        }

        if (diffPanel.visible) {
            refreshDiff();
        } else {
            needsRefresh = true;
        }
    });

    context.subscriptions.push(showDiff, onSave);
}

export function deactivate() {}
