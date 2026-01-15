# Fix Next.js 404 Errors for Static Files

## Quick Fix Steps:

### 1. Stop the Dev Server
Press `Ctrl+C` in the terminal where `npm run dev` is running

### 2. Clear Cache (Choose one method)

**Method A: Manual Delete (Recommended)**
- Close your IDE/editor
- Open File Explorer
- Navigate to `D:\Nydrax\Tracker`
- Delete the `.next` folder manually
- If it says "file in use", restart your computer or close all Node processes

**Method B: PowerShell (Run as Administrator)**
```powershell
# Stop all Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Delete .next folder
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
```

**Method C: Use Next.js Clean Command**
```bash
# Add this to package.json scripts, then run:
npm run clean
```

### 3. Restart Dev Server
```bash
npm run dev
```

## Alternative: Fresh Start

If the above doesn't work:

```bash
# 1. Stop dev server (Ctrl+C)

# 2. Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm install

# 3. Start fresh
npm run dev
```

## Why This Happens

The 404 errors occur when:
- Next.js cache gets corrupted
- Dev server is interrupted
- Files are locked by another process
- Build artifacts are out of sync

## Prevention

- Always stop the dev server properly (Ctrl+C)
- Don't delete `.next` while dev server is running
- Close IDE before clearing cache if files are locked
