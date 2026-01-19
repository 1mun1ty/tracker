'use client';

import { useState, useEffect } from 'react';
import { AppData, Project, Workspace, Task } from '@/types';
import TaskKanban from '@/components/Task/TaskKanban';
import TaskList from '@/components/Task/TaskList';
import { LayoutGrid, List, Calendar } from 'lucide-react';

interface ProjectViewProps {
  project: Project;
  workspace: Workspace;
  data: AppData;
  onDataUpdate: () => void;
}

type ViewType = 'kanban' | 'list' | 'calendar';

export default function ProjectView({ project, workspace, data, onDataUpdate }: ProjectViewProps) {
  const [view, setView] = useState<ViewType>('kanban');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?projectId=${project.id}`);
      const result = await response.json();
      if (result.success) {
        setTasks(result.data || []);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  const handleTaskUpdate = () => {
    loadTasks();
    onDataUpdate();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Project Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: project.color }}
            >
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              {project.description && (
                <p className="text-sm text-gray-400">{project.description}</p>
              )}
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setView('kanban')}
              className={`p-2 rounded transition-colors ${
                view === 'kanban' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded transition-colors ${
                view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`p-2 rounded transition-colors ${
                view === 'calendar' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Task View */}
      <div className="flex-1 overflow-auto">
        {view === 'kanban' && (
          <TaskKanban
            tasks={tasks}
            project={project}
            workspace={workspace}
            onTaskUpdate={handleTaskUpdate}
          />
        )}
        {view === 'list' && (
          <TaskList
            tasks={tasks}
            project={project}
            workspace={workspace}
            onTaskUpdate={handleTaskUpdate}
          />
        )}
        {view === 'calendar' && (
          <div className="p-6">
            <p className="text-gray-400">Calendar view coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
