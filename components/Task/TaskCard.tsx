'use client';

import { Task, Priority } from '@/types';
import { Clock, User, Tag, Timer } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const priorityColor = priorityColors[task.priority] || priorityColors.medium;

  return (
    <div
      onClick={onClick}
      className="bg-gray-700 border border-gray-600 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
    >
      <h4 className="font-medium text-white mb-2 line-clamp-2">{task.title}</h4>
      
      {task.description && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${priorityColor}`} />
          <span className="text-xs text-gray-400 capitalize">{task.priority}</span>
        </div>

        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}

        {task.assigneeIds && task.assigneeIds.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <User className="w-3 h-3" />
            <span>{task.assigneeIds.length}</span>
          </div>
        )}

        {task.tags && task.tags.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Tag className="w-3 h-3" />
            <span>{task.tags.length}</span>
          </div>
        )}

        {task.actualHours && task.actualHours > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Timer className="w-3 h-3" />
            <span>{task.actualHours.toFixed(1)}h</span>
          </div>
        )}
      </div>
    </div>
  );
}
