# AI SOC & Pentest Agent - Project Tracker

A comprehensive project management application for tracking the development of an AI-powered Security Operations Center (SOC) and Penetration Testing Agent platform.

## Features

- 📋 **Complete Todo Management** - All 18 months of tasks from the roadmap organized by phases, months, and weeks
- ⏱️ **Time Tracking** - Real-time timer and manual time entry tracking
- 📊 **Progress Dashboard** - Visual analytics with charts and statistics
- 🎯 **Milestone Tracking** - Track key project milestones and achievements
- 📈 **Phase Management** - View progress across all 6 project phases
- 🔍 **Advanced Filtering** - Filter tasks by status, priority, phase, and search
- 💾 **Local Storage** - All data persisted in browser localStorage
- 🎨 **Professional UI** - Modern, responsive design with Tailwind CSS

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
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page component
├── components/
│   ├── Dashboard.tsx        # Main dashboard with charts
│   ├── TaskList.tsx         # Task management interface
│   ├── TimeTracker.tsx      # Time tracking component
│   ├── PhaseView.tsx        # Phase overview
│   ├── MilestoneView.tsx    # Milestone tracking
│   └── Navigation.tsx       # Navigation bar
├── lib/
│   ├── data.ts              # Data management (localStorage)
│   ├── initialData.ts      # Roadmap data generator
│   └── utils.ts             # Utility functions
├── types/
│   └── index.ts             # TypeScript type definitions
└── data/                    # Data directory (for future file storage)
```

## Roadmap Data

The application comes pre-loaded with the complete 18-month roadmap including:

- **Phase 1 (Months 1-3)**: Foundation Building
  - Rust basics and security fundamentals
  - Python & AI/ML foundations
  - Security tools & techniques
  
- **Phase 2 (Month 4)**: Architecture & Design
  - System architecture planning
  - Database design
  - API design

- **Phase 3 (Months 5-8)**: Core Development
  - Rust core services
  - Python AI - SOC Agent
  - Python AI - Pentest Agent
  - Advanced AI integration

- **Phase 4 (Months 9-10)**: Frontend Development
  - React dashboard
  - Integration & testing

- **Phase 5 (Months 11-12)**: Production Hardening
  - Security & compliance
  - Performance & scalability

- **Phase 6 (Months 13-18)**: Launch & Growth
  - Beta program
  - Commercial launch
  - Feature expansion

## Usage

### Dashboard
View overall project statistics, completion rates, and visual progress charts.

### Tasks
- View all tasks organized by phase, month, and week
- Filter by status, priority, or phase
- Search tasks by title or description
- Update task status and priority
- Track estimated vs actual hours

### Time Tracker
- Start/stop timer for active tasks
- View time entries by date
- See daily and weekly time summaries
- Manual time entry support

### Phases
- View progress for each project phase
- See task completion statistics
- Track estimated vs actual hours per phase

### Milestones
- Track key project milestones
- View milestone status and target dates
- See related tasks for each milestone

## Data Storage

Currently, all data is stored in browser localStorage. This means:
- Data persists across browser sessions
- Data is specific to each browser/device
- To backup data, export from browser DevTools > Application > Local Storage

Future enhancements may include:
- Cloud sync
- Export/import functionality
- Database integration

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library for visualizations
- **Lucide React** - Icon library
- **date-fns** - Date formatting utilities

## Development

### Code Style
- TypeScript strict mode enabled
- ESLint configured with Next.js rules
- Prettier recommended for code formatting

### Adding New Tasks
Tasks are generated from `lib/initialData.ts`. To add new tasks, modify the task generation logic in that file.

### Customization
- Colors and styling: Modify `tailwind.config.ts`
- Component styling: Update individual component files
- Data structure: Modify types in `types/index.ts`

## License

This project is for personal use in tracking the AI SOC & Pentest Agent development roadmap.

## Support

For issues or questions, refer to the project documentation or create an issue in the repository.