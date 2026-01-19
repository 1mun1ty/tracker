'use client';

import { useEffect, useState } from 'react';
import { AppData, Project } from '@/types';
import { TimerProvider } from '@/lib/timerContext';
import ProjectView from '@/components/Project/ProjectView';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import TimeDashboard from '@/components/TimeTracker/TimeDashboard';

export default function AppPage() {
  const [data, setData] = useState<AppData | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeView, setActiveView] = useState<'time' | 'project'>('time');
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
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleProjectCreated = (project: Project) => {
    if (data) {
      setData({
        ...data,
        projects: [...data.projects, project],
      });
      setSelectedProject(project);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <TimerProvider>
      <div className="min-h-screen bg-gray-900 flex">
        <Sidebar
          projects={data.projects}
          selectedProject={selectedProject}
          activeView={activeView}
          onProjectSelect={handleProjectSelect}
          onProjectCreate={handleProjectCreated}
          onViewChange={setActiveView}
        />
      
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          {activeView === 'time' ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <TimeDashboard
                projects={data.projects}
                tasks={data.tasks}
                onUpdate={loadData}
              />
            </div>
          ) : selectedProject ? (
            <ProjectView
              project={selectedProject}
              data={data}
              onDataUpdate={loadData}
            />
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-white mb-2">Select a Project</h2>
                <p className="text-gray-400">Choose a project from the sidebar to get started</p>
              </div>
            </div>
          )}
        </main>
      </div>
      </div>
    </TimerProvider>
  );
}
