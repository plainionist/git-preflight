import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const showDiff = vscode.commands.registerCommand('git-preflight.showDiff', () => {
        vscode.window.showInformationMessage('Git Preflight ready');
    });

    context.subscriptions.push(showDiff);
}

export function deactivate() {}
