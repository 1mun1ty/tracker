'use client';

import { useState } from 'react';
import { Task, Project, Workspace, TaskStatus } from '@/types';
import { Plus, MoreVertical } from 'lucide-react';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

interface TaskKanbanProps {
  tasks: Task[];
  project: Project;
  workspace: Workspace;
  onTaskUpdate: () => void;
}

const statusColumns: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'todo', label: 'To Do', color: 'bg-gray-600' },
  { status: 'in_progress', label: 'In Progress', color: 'bg-blue-600' },
  { status: 'in_review', label: 'In Review', color: 'bg-yellow-600' },
  { status: 'done', label: 'Done', color: 'bg-green-600' },
  { status: 'blocked', label: 'Blocked', color: 'bg-red-600' },
];

export default function TaskKanban({ tasks, project, workspace, onTaskUpdate }: TaskKanbanProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [creatingStatus, setCreatingStatus] = useState<TaskStatus | null>(null);

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(t => t.status === status);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleCreateTask = (status: TaskStatus) => {
    setCreatingStatus(status);
    setSelectedTask(null);
    setShowTaskModal(true);
  };

  return (
    <div className="flex-1 overflow-x-auto p-6">
      <div className="flex gap-4 min-w-max">
        {statusColumns.map((column) => {
          const columnTasks = getTasksByStatus(column.status);
          return (
            <div
              key={column.status}
              className="flex-shrink-0 w-80 bg-gray-800 rounded-lg border border-gray-700 flex flex-col"
            >
              {/* Column Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`} />
                    <h3 className="font-semibold text-white">{column.label}</h3>
                    <span className="text-sm text-gray-400">({columnTasks.length})</span>
                  </div>
                  <button
                    onClick={() => handleCreateTask(column.status)}
                    className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tasks */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[400px]">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => handleTaskClick(task)}
                  />
                ))}
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showTaskModal && (
        <TaskModal
          task={selectedTask || undefined}
          project={project}
          workspace={workspace}
          initialStatus={creatingStatus || undefined}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
            setCreatingStatus(null);
          }}
          onSave={onTaskUpdate}
        />
      )}
    </div>
  );
}
