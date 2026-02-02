# git-preflight

Simplifies the final self-review before committing changes to Git.

## Features

- View all uncommitted changes in a single, readable diff view
- Syntax-highlighted diff with added/removed/unchanged lines
- Auto-refresh when files are saved (if panel is visible)
- Lazy refresh when panel becomes active (if changes occurred while hidden)
- Single reusable panel — no clutter from multiple views

## Usage

**Trigger the command:**

- Command Palette: `Git Preflight: Show Diff`
- Keyboard shortcut: `Ctrl+Alt+R` (Windows/Linux) or `Cmd+Alt+R` (macOS)

## When to use

Run it right before you commit to catch accidental changes, debug leftovers, or forgotten TODOs.
