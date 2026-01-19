'use client';

import { Task } from '@/types';
import { Clock, User } from 'lucide-react';

interface TaskRowProps {
  task: Task;
  onClick: () => void;
}

const statusColors: Record<string, string> = {
  todo: 'bg-gray-600',
  in_progress: 'bg-blue-600',
  in_review: 'bg-yellow-600',
  done: 'bg-green-600',
  blocked: 'bg-red-600',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

export default function TaskRow({ task, onClick }: TaskRowProps) {
  const statusColor = statusColors[task.status] || statusColors.todo;
  const priorityColor = priorityColors[task.priority] || priorityColors.medium;

  return (
    <tr
      onClick={onClick}
      className="hover:bg-gray-800 cursor-pointer transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-white">{task.title}</div>
          {task.description && (
            <div className="text-sm text-gray-400 line-clamp-1">{task.description}</div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${statusColor}`}>
          {task.status.replace('_', ' ')}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${priorityColor}`} />
          <span className="text-sm text-gray-300 capitalize">{task.priority}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <User className="w-4 h-4" />
          <span>{task.assigneeIds.length}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {task.dueDate ? (
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-500">—</span>
        )}
      </td>
    </tr>
  );
}
