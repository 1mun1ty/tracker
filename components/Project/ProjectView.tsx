'use client';

import { useState, useEffect } from 'react';
import { AppData, Project, Task } from '@/types';
import TaskKanban from '@/components/Task/TaskKanban';
import TaskList from '@/components/Task/TaskList';
import { LayoutGrid, List, BookOpen } from 'lucide-react';

interface ProjectViewProps {
  project: Project;
  data: AppData;
  onDataUpdate: () => void;
}

type ViewType = 'list' | 'kanban';

export default function ProjectView({ project, data, onDataUpdate }: ProjectViewProps) {
  const [view, setView] = useState<ViewType>('list'); // Default to list view
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
      <div className="flex items-center justify-center h-full bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-700 border-t-cyan-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Project Header */}
      <div className="bg-slate-800/50 border-b border-slate-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
              style={{ backgroundColor: project.color, boxShadow: `0 4px 20px ${project.color}40` }}
            >
              {project.name.includes('Learning') ? (
                <BookOpen className="w-6 h-6" />
              ) : (
                project.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              {project.description && (
                <p className="text-sm text-slate-400 mt-0.5">{project.description}</p>
              )}
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1 border border-slate-700">
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                view === 'list' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-medium">List</span>
            </button>
            <button
              onClick={() => setView('kanban')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                view === 'kanban' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="text-sm font-medium">Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* Task View */}
      <div className="flex-1 overflow-auto">
        {view === 'list' && (
          <TaskList
            tasks={tasks}
            project={project}
            onTaskUpdate={handleTaskUpdate}
          />
        )}
        {view === 'kanban' && (
          <TaskKanban
            tasks={tasks}
            project={project}
            onTaskUpdate={handleTaskUpdate}
          />
        )}
      </div>
    </div>
  );
}
