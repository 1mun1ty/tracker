# Professional Time Tracker

A comprehensive time tracking application built with Next.js, TypeScript, and Tailwind CSS. Track time across projects, analyze your productivity, and manage your work hours efficiently.

## Features

### Core Time Tracking
- ⏱️ **Real-Time Timer** - Start/stop timer for any task with live elapsed time display
- 📊 **Time Dashboard** - Comprehensive analytics and insights
- 📝 **Manual Time Entry** - Add time entries manually with flexible duration formats
- 📅 **Time Reports** - View time by day, week, month, or all time
- 🎯 **Project-Based Tracking** - Track time across multiple projects and workspaces
- 📈 **Analytics & Insights** - Daily averages, project breakdowns, and trends

### Time Management
- **Active Timer Display** - See current timer at a glance with task name and elapsed time
- **Time Entry History** - Complete log of all time entries with descriptions
- **Project Time Breakdown** - Visual breakdown of time spent per project
- **Daily/Weekly/Monthly Views** - Filter and analyze time by period
- **Time Goals** - Set and track time targets (coming soon)

### Project & Task Integration
- **Workspace Management** - Organize projects into workspaces
- **Project Organization** - Create and manage multiple projects
- **Task Management** - Create tasks and track time against them
- **Task Views** - Kanban and List views for task management

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Data Storage**: JSON file (easily migratable to PostgreSQL/MongoDB)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Usage

### Starting a Timer

1. Go to the **Time Tracker** dashboard
2. Select a task from the dropdown
3. Click **Start Timer**
4. The timer runs in the background - you'll see it at the top of the page
5. Click **Stop Timer** when done - time is automatically saved

### Adding Manual Time Entry

1. Click **View All Entries** in the Time Tracker
2. Click **Add Time Entry**
3. Select a task
4. Enter duration (e.g., "2h 30m", "90m", "1.5h")
5. Add optional description
6. Select date
7. Click **Add Entry**

### Viewing Time Analytics

- **Dashboard**: See total time, daily averages, and project breakdowns
- **Filters**: Filter by time period (Today, Week, Month, All Time) and project
- **Project Breakdown**: Visual chart showing time distribution across projects
- **Recent Entries**: Quick view of your latest time entries

### Managing Projects

1. Create a workspace (if you don't have one)
2. Create projects within the workspace
3. Create tasks within projects
4. Track time against tasks
5. View time analytics per project

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication
│   │   ├── workspaces/   # Workspace management
│   │   ├── projects/     # Project management
│   │   ├── tasks/        # Task management
│   │   └── time-entries/ # Time tracking API
│   ├── app/              # Main application
│   ├── login/            # Login page
│   └── register/         # Registration page
├── components/
│   ├── TimeTracker/     # Time tracking components
│   │   ├── TimeDashboard.tsx  # Main dashboard
│   │   ├── TimeTracker.tsx     # Time entry list
│   │   └── ActiveTimer.tsx     # Active timer display
│   ├── Timer/            # Timer components
│   ├── Project/          # Project components
│   └── Layout/           # Layout components
├── lib/
│   ├── timerContext.tsx  # Timer state management
│   └── storage.ts        # Data storage utility
└── types/
    └── index.ts          # TypeScript definitions
```

## API Routes

### Time Tracking
- `GET /api/time-entries` - List time entries (filter by taskId, userId, date)
- `POST /api/time-entries` - Create time entry

### Projects & Tasks
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task

See full API documentation in the codebase.

## Time Tracking Features

### Duration Formats
When adding manual time entries, you can use various formats:
- `"2h 30m"` - 2 hours and 30 minutes
- `"90m"` - 90 minutes
- `"1.5h"` - 1.5 hours
- `"120"` - 120 minutes (defaults to minutes if no unit)

### Timer Features
- **Persistent Timer**: Timer persists across page refreshes (stored in localStorage)
- **Background Tracking**: Timer continues running even when you navigate away
- **Automatic Saving**: Time is automatically saved when you stop the timer
- **Real-Time Display**: See elapsed time update every second

### Analytics
- **Total Time**: Sum of all time entries for selected period
- **Daily Average**: Average hours per day
- **Project Breakdown**: Visual breakdown with percentages
- **Entry Count**: Number of time entries logged

## Data Storage

Currently, all data is stored in JSON files in the `data/` directory. This makes it easy to:
- Backup your data
- Migrate to a database (PostgreSQL, MongoDB, etc.)
- Export/import data

### Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- Time goals and targets
- Export to CSV/PDF
- Time reports and invoices
- Team time tracking
- Time approval workflows
- Integration with calendar apps
- Mobile app

## Development

### Code Style

- TypeScript strict mode enabled
- ESLint configured with Next.js rules
- Prettier recommended for code formatting

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions, create an issue in the repository.
