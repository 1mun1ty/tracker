# Quick Start Guide

## First Time Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to http://localhost:3000

## Initial Data

The application automatically loads with the complete 18-month roadmap including:
- 6 Phases
- 18 Months
- 72 Weeks
- 100+ Tasks
- 7 Key Milestones

All data is stored in your browser's localStorage and persists across sessions.

## Key Features to Try

### 1. Dashboard
- View overall project statistics
- See completion percentages
- Check time tracking summaries
- View progress charts

### 2. Tasks
- Click on any task to view details
- Use filters to find specific tasks
- Update task status by clicking the status icon
- Search for tasks by keyword

### 3. Time Tracker
- Select a task from the dropdown
- Click "Start Timer" to begin tracking
- Timer runs in real-time
- Click "Stop" to save the time entry
- View all time entries below

### 4. Phases
- See progress for each of the 6 phases
- View task completion statistics
- Track estimated vs actual hours

### 5. Milestones
- Track 7 key project milestones
- See target dates and status
- View related tasks

## Tips

- **Update Task Status**: Click the status icon (circle/checkmark) next to any task
- **View Task Details**: Click on a task row to see full details and edit
- **Filter Tasks**: Use the filter dropdowns to narrow down tasks
- **Track Time**: Use the timer for accurate time tracking
- **Monitor Progress**: Check the dashboard regularly for overall progress

## Data Management

All data is stored in browser localStorage. To backup:
1. Open browser DevTools (F12)
2. Go to Application tab
3. Click Local Storage
4. Copy the `projectData` value

To restore:
1. Paste the JSON data back into localStorage
2. Refresh the page

## Next Steps

1. Start working on tasks from Month 1
2. Track your time as you work
3. Update task status as you complete them
4. Monitor your progress on the dashboard
5. Review milestones regularly

Happy tracking! 🚀