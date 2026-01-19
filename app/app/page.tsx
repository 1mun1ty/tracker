'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppData, Workspace, Project } from '@/types';
import { TimerProvider } from '@/lib/timerContext';
import WorkspaceSelector from '@/components/Workspace/WorkspaceSelector';
import ProjectView from '@/components/Project/ProjectView';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import TimeDashboard from '@/components/TimeTracker/TimeDashboard';

export default function AppPage() {
  const [data, setData] = useState<AppData | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeView, setActiveView] = useState<'time' | 'project'>('time');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadData = async () => {
    try {
      // Load workspaces
      const workspacesRes = await fetch('/api/workspaces');
      const workspacesData = await workspacesRes.json();
      
      // Load projects
      const projectsRes = await fetch('/api/projects');
      const projectsData = await projectsRes.json();

      // Load tasks
      const tasksRes = await fetch('/api/tasks');
      const tasksData = await tasksRes.json();

      const appData: AppData = {
        workspaces: workspacesData.data || [],
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

      // Auto-select first workspace if available
      if (appData.workspaces.length > 0 && !selectedWorkspace) {
        setSelectedWorkspace(appData.workspaces[0]);
      }
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


  const handleWorkspaceSelect = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setSelectedProject(null);
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleWorkspaceCreated = (workspace: Workspace) => {
    if (data) {
      setData({
        ...data,
        workspaces: [...data.workspaces, workspace],
      });
      setSelectedWorkspace(workspace);
    }
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

  // Show workspace selector if no workspace selected
  if (!selectedWorkspace) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <WorkspaceSelector
          workspaces={data.workspaces}
          onSelect={handleWorkspaceSelect}
          onCreate={handleWorkspaceCreated}
        />
      </div>
    );
  }

  return (
    <TimerProvider>
      <div className="min-h-screen bg-gray-900 flex">
        <Sidebar
          workspace={selectedWorkspace}
          projects={data.projects.filter(p => p.workspaceId === selectedWorkspace.id)}
          selectedProject={selectedProject}
          activeView={activeView}
          onProjectSelect={handleProjectSelect}
          onProjectCreate={handleProjectCreated}
          onWorkspaceChange={handleWorkspaceSelect}
          onViewChange={setActiveView}
          workspaces={data.workspaces}
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
              workspace={selectedWorkspace}
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
