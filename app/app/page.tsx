'use client';

import { useEffect, useState } from 'react';
import { AppData, Project } from '@/types';
import { UserProvider, useUser } from '@/lib/userContext';
import { ToastProvider } from '@/components/UI/Toast';
import ProjectView from '@/components/Project/ProjectView';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import Dashboard from '@/components/Dashboard/Dashboard';
import AttendancePage from '@/components/Attendance/AttendancePage';
import ChatPage from '@/components/Chat/ChatPage';
import LoginPage from '@/components/Auth/LoginPage';

type ViewType = 'dashboard' | 'projects' | 'chat' | 'attendance';

function MainApp() {
  const { user, isLoading: authLoading } = useUser();
  const [data, setData] = useState<AppData | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      // Load projects
      const projectsRes = await fetch('/api/projects');
      const projectsData = await projectsRes.json();

      // Load tasks
      const tasksRes = await fetch('/api/tasks');
      const tasksData = await tasksRes.json();

      const appData: AppData = {
        workspaces: [],
        projects: projectsData.data || [],
        tasks: tasksData.data || [],
        comments: [],
        attachments: [],
        timeEntries: [],
        activities: [],
        notifications: [],
        views: [],
        stats: {},
        lastUpdated: new Date().toISOString(),
      };

      setData(appData);
      
      // Auto-select Learning Roadmap project if exists
      const roadmapProject = appData.projects.find(p => p.name.includes('Learning Roadmap'));
      if (roadmapProject && !selectedProject) {
        setSelectedProject(roadmapProject);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setActiveView('projects');
  };

  const handleProjectCreated = (project: Project) => {
    if (data) {
      setData({
        ...data,
        projects: [...data.projects, project],
      });
      setSelectedProject(project);
      setActiveView('projects');
    }
  };

  const handleViewChange = (view: string) => {
    if (['dashboard', 'projects', 'chat', 'attendance'].includes(view)) {
      setActiveView(view as ViewType);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="mt-6 text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <LoginPage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-6 text-slate-400 font-medium">Loading TimeFlow...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <p className="text-red-400">Failed to load data. Please refresh.</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onViewChange={handleViewChange} onProjectSelect={handleProjectSelect} projects={data.projects} />;
      case 'projects':
        return selectedProject ? (
          <ProjectView
            project={selectedProject}
            data={data}
            onDataUpdate={loadData}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Select a Project</h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Choose a project from the sidebar to view its tasks and details, or create a new project to get started.
              </p>
            </div>
          </div>
        );
      case 'attendance':
        return <AttendancePage />;
      case 'chat':
        return <ChatPage />;
      default:
        return <Dashboard onViewChange={handleViewChange} onProjectSelect={handleProjectSelect} projects={data.projects} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      <Sidebar
        projects={data.projects}
        selectedProject={selectedProject}
        activeView={activeView}
        onProjectSelect={handleProjectSelect}
        onProjectCreate={handleProjectCreated}
        onViewChange={handleViewChange}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header onNavigate={handleViewChange} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function AppPage() {
  return (
    <UserProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </UserProvider>
  );
}
