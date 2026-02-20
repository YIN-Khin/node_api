# Git Push Guide - Quick Reference

## Daily Workflow (Copy & Paste)

### 1. Check Status
```cmd
git status
```

### 2. Add Changes
```cmd
git add .
```
Or add specific files:
```cmd
git add file1.js file2.js
```

### 3. Commit Changes
```cmd
git commit -m "your message here"
```

### 4. Push to GitHub
```cmd
git push origin main
```

## Common Commit Message Examples

```cmd
git commit -m "feat: add new feature"
git commit -m "fix: fix bug in login"
git commit -m "update: improve performance"
git commit -m "chore: update dependencies"
```

## Complete Push Command (One Line)
```cmd
git add . & git commit -m "update code" & git push origin main
```

## Important Notes

✅ `.env` file is now properly ignored
✅ Secrets will NOT be pushed to GitHub
✅ Always check `git status` before committing

## If Push Fails

1. Pull latest changes first:
```cmd
git pull origin main
```

2. Then push again:
```cmd
git push origin main
```

## Undo Last Commit (if needed)
```cmd
git reset --soft HEAD~1
```

## View Commit History
```cmd
git log --oneline
```

## Check What Will Be Committed
```cmd
git diff --cached
```
