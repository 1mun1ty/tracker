'use client';

import { useState } from 'react';
import { Task, Project, TaskStatus } from '@/types';
import { Plus, ChevronDown } from 'lucide-react';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

interface TaskKanbanProps {
  tasks: Task[];
  project: Project;
  onTaskUpdate: () => void;
}

const statusColumns: { status: TaskStatus; label: string; color: string; bgColor: string }[] = [
  { status: 'todo', label: 'To Do', color: 'bg-slate-500', bgColor: 'bg-slate-500/10' },
  { status: 'in_progress', label: 'In Progress', color: 'bg-blue-500', bgColor: 'bg-blue-500/10' },
  { status: 'in_review', label: 'In Review', color: 'bg-yellow-500', bgColor: 'bg-yellow-500/10' },
  { status: 'done', label: 'Done', color: 'bg-emerald-500', bgColor: 'bg-emerald-500/10' },
];

const INITIAL_DISPLAY_COUNT = 5;

export default function TaskKanban({ tasks, project, onTaskUpdate }: TaskKanbanProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [creatingStatus, setCreatingStatus] = useState<TaskStatus | null>(null);
  const [expandedColumns, setExpandedColumns] = useState<Set<TaskStatus>>(new Set());

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

  const toggleColumnExpand = (status: TaskStatus) => {
    const newExpanded = new Set(expandedColumns);
    if (newExpanded.has(status)) {
      newExpanded.delete(status);
    } else {
      newExpanded.add(status);
    }
    setExpandedColumns(newExpanded);
  };

  return (
    <div className="flex-1 overflow-x-auto p-6 bg-slate-900/50">
      <div className="flex gap-4 min-w-max">
        {statusColumns.map((column) => {
          const columnTasks = getTasksByStatus(column.status);
          const isExpanded = expandedColumns.has(column.status);
          const displayTasks = isExpanded ? columnTasks : columnTasks.slice(0, INITIAL_DISPLAY_COUNT);
          const hasMore = columnTasks.length > INITIAL_DISPLAY_COUNT;

          return (
            <div
              key={column.status}
              className="flex-shrink-0 w-80 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex flex-col backdrop-blur-sm"
            >
              {/* Column Header */}
              <div className={`p-4 rounded-t-2xl ${column.bgColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`} />
                    <h3 className="font-semibold text-white">{column.label}</h3>
                    <span className="px-2 py-0.5 bg-slate-800/50 rounded-full text-xs text-slate-300">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCreateTask(column.status)}
                    className="p-1.5 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tasks */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[500px]">
                {displayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => handleTaskClick(task)}
                  />
                ))}
                
                {/* Show More Button */}
                {hasMore && !isExpanded && (
                  <button
                    onClick={() => toggleColumnExpand(column.status)}
                    className="w-full py-3 text-sm text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 rounded-xl transition-all flex items-center justify-center gap-1"
                  >
                    <span>Show {columnTasks.length - INITIAL_DISPLAY_COUNT} more</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}

                {/* Show Less Button */}
                {hasMore && isExpanded && (
                  <button
                    onClick={() => toggleColumnExpand(column.status)}
                    className="w-full py-3 text-sm text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 rounded-xl transition-all flex items-center justify-center gap-1"
                  >
                    <span>Show less</span>
                    <ChevronDown className="w-4 h-4 rotate-180" />
                  </button>
                )}

                {columnTasks.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Plus className="w-6 h-6 text-slate-500" />
                    </div>
                    <p className="text-slate-500 text-sm">No tasks</p>
                    <button 
                      onClick={() => handleCreateTask(column.status)}
                      className="text-cyan-400 text-sm hover:text-cyan-300 mt-1"
                    >
                      Add a task
                    </button>
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
