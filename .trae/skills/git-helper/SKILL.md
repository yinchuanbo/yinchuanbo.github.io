---
name: "git-helper"
description: "Automates Git sync: checks uncommitted changes, commits, pulls (rebase), and pushes. Invoke for 'git push', 'sync code', or 'upload changes'."
---

# Git Helper

This skill helps users automate the Git synchronization workflow.

## Features
- Checks for uncommitted changes in staging and working directory.
- Commits changes if found.
- Pulls latest remote changes using rebase (`git pull --rebase`).
- Pushes changes to remote (`git push`).

## Usage
Invoke this skill when the user wants to push code or sync their local repository with the remote.

## Workflow
1. **Check Status**: Run `git status --porcelain` to see if there are uncommitted changes.
2. **Commit (if needed)**:
   - If changes exist, ask the user for a commit message or generate a descriptive one.
   - Run `git add .` and `git commit -m "message"`.
3. **Sync**:
   - Run `git pull --rebase` to ensure linear history.
   - Handle any conflicts if they arise (or stop and ask user).
4. **Push**:
   - Run `git push` to upload changes.
