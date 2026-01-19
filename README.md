# Professional Task Tracker

A modern, professional task management application built with Next.js, TypeScript, and Tailwind CSS. Similar to ClickUp, Slack, and Google Todo, this application provides comprehensive task management with workspaces, projects, teams, and collaboration features.

## Features

### Core Features
- ✅ **User Authentication** - Secure login and registration
- 🏢 **Workspace Management** - Create and manage multiple workspaces
- 📁 **Project Organization** - Organize tasks within projects
- 📋 **Task Management** - Full CRUD operations for tasks
- 🎯 **Multiple Views** - Kanban board, List view, and Calendar (coming soon)
- 🔍 **Advanced Filtering** - Filter by status, priority, assignee, tags
- 🏷️ **Tags & Labels** - Organize tasks with custom tags
- ⏰ **Due Dates** - Set and track task deadlines
- 👥 **Team Collaboration** - Assign tasks to team members
- 💬 **Comments** - Add comments and discussions on tasks
- 🔔 **Notifications** - Real-time notifications for task updates
- ⏱️ **Time Tracking** - Track time spent on tasks
- 📊 **Activity Logs** - Track all project activities

### Professional Features
- **Role-Based Access Control** - Owner, Admin, Member, Viewer roles
- **Workspace Isolation** - Separate workspaces for different teams/projects
- **Project Templates** - Quick project setup
- **Custom Views** - Save and reuse custom task views
- **Search** - Full-text search across tasks and projects
- **API-First Architecture** - Complete REST API for all operations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
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

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── workspaces/   # Workspace management
│   │   ├── projects/     # Project management
│   │   ├── tasks/        # Task CRUD operations
│   │   ├── comments/     # Comment management
│   │   ├── time-entries/ # Time tracking
│   │   └── notifications/ # Notifications
│   ├── app/              # Main application page
│   ├── login/            # Login page
│   └── register/         # Registration page
├── components/
│   ├── Auth/             # Authentication components
│   ├── Layout/            # Layout components (Header, Sidebar)
│   ├── Workspace/         # Workspace components
│   ├── Project/           # Project components
│   └── Task/              # Task management components
├── lib/
│   └── data.ts            # Data management layer
├── types/
│   └── index.ts           # TypeScript type definitions
└── data/                  # Data storage directory
```

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Workspaces
- `GET /api/workspaces` - List all workspaces
- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces/[id]` - Get workspace
- `PUT /api/workspaces/[id]` - Update workspace
- `DELETE /api/workspaces/[id]` - Delete workspace

### Projects
- `GET /api/projects` - List projects (filter by workspaceId)
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Tasks
- `GET /api/tasks` - List tasks (filter by projectId, workspaceId, status, assigneeId)
- `POST /api/tasks` - Create task
- `GET /api/tasks/[id]` - Get task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Comments
- `GET /api/comments` - List comments (filter by taskId)
- `POST /api/comments` - Create comment
- `PUT /api/comments/[id]` - Update comment
- `DELETE /api/comments/[id]` - Delete comment

### Time Entries
- `GET /api/time-entries` - List time entries
- `POST /api/time-entries` - Create time entry

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications?id=[id]` - Mark notification as read

## Usage

### Creating Your First Workspace

1. Register/Login to your account
2. Click "Create Workspace" or select an existing one
3. Add a name and description for your workspace

### Creating Projects

1. Select a workspace from the sidebar
2. Click the "+" button in the Projects section
3. Fill in project details (name, description, color)
4. Click "Create"

### Managing Tasks

1. Select a project from the sidebar
2. Choose your preferred view (Kanban or List)
3. Click "New Task" or the "+" button in a column
4. Fill in task details:
   - Title (required)
   - Description
   - Status (To Do, In Progress, In Review, Done, Blocked)
   - Priority (Low, Medium, High, Urgent)
   - Due Date
   - Tags
5. Click "Create Task"

### Task Views

**Kanban View**: Visualize tasks in columns by status. Drag and drop to change status (coming soon).

**List View**: Table view with all task details. Perfect for detailed task management.

**Calendar View**: Coming soon - View tasks on a calendar timeline.

## Data Storage

Currently, all data is stored in JSON files in the `data/` directory. This makes it easy to:
- Backup your data
- Migrate to a database (PostgreSQL, MongoDB, etc.)
- Export/import data

### Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- Real-time collaboration with WebSockets
- File attachments
- Advanced reporting and analytics
- Mobile app
- Calendar view
- Gantt chart view
- Custom fields
- Workflow automation
- Integration with third-party tools

## Development

### Code Style

- TypeScript strict mode enabled
- ESLint configured with Next.js rules
- Prettier recommended for code formatting

### Adding New Features

1. Define types in `types/index.ts`
2. Create API routes in `app/api/`
3. Build UI components in `components/`
4. Update data layer in `lib/data.ts` if needed

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions, create an issue in the repository.
