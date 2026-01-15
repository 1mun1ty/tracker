'use client';

import { ProjectData } from '@/types';
import { formatDuration, formatTime } from '@/lib/utils';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

interface PhaseViewProps {
  data: ProjectData;
  onUpdate: () => void;
}

export default function PhaseView({ data, onUpdate }: PhaseViewProps) {
  const phasesWithProgress = data.phases.map(phase => {
    const phaseTasks = data.tasks.filter(t => t.phaseId === phase.id);
    const completed = phaseTasks.filter(t => t.status === 'completed').length;
    const inProgress = phaseTasks.filter(t => t.status === 'in_progress').length;
    const total = phaseTasks.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    const estimatedHours = phaseTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    const actualHours = phaseTasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);

    return {
      ...phase,
      completed,
      inProgress,
      total,
      percentage,
      estimatedHours,
      actualHours,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Project Phases</h2>
        <p className="mt-2 text-sm text-gray-400">
          Overview of all project phases and their progress
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {phasesWithProgress.map(phase => (
          <div key={phase.id} className="bg-gray-800 shadow-xl rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                  <p className="mt-1 text-sm text-gray-400">{phase.description}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Month {phase.monthStart} - {phase.monthEnd}</span>
                    <span>•</span>
                    <span>{phase.total} tasks</span>
                  </div>
                </div>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  style={{ backgroundColor: phase.color }}
                >
                  {Math.round(phase.percentage)}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${phase.percentage}%`,
                      backgroundColor: phase.color,
                    }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Completed</span>
                  </div>
                  <p className="text-lg font-semibold text-white mt-1">
                    {phase.completed} / {phase.total}
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>In Progress</span>
                  </div>
                  <p className="text-lg font-semibold text-white mt-1">
                    {phase.inProgress}
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Circle className="w-4 h-4 text-gray-500" />
                    <span>Estimated</span>
                  </div>
                  <p className="text-lg font-semibold text-white mt-1">
                    {formatTime(phase.estimatedHours)}
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span>Actual</span>
                  </div>
                  <p className="text-lg font-semibold text-white mt-1">
                    {formatTime(phase.actualHours)}
                  </p>
                </div>
              </div>

              {/* Recent Tasks */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="text-sm font-medium text-white mb-3">Recent Tasks</h4>
                {phase.total === 0 ? (
                  <div className="text-center py-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <p className="text-sm text-gray-400 mb-2">No tasks yet for this phase</p>
                    <p className="text-xs text-gray-500">
                      Use &quot;Add New Task&quot; button to create tasks for this phase
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {data.tasks
                      .filter(t => t.phaseId === phase.id)
                      .slice(0, 5)
                      .map(task => (
                        <div key={task.id} className="flex items-center justify-between text-sm">
                          <span className={task.status === 'completed' ? 'line-through text-gray-500' : 'text-white'}>
                            {task.title}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            task.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            'bg-gray-700 text-gray-300 border border-gray-600'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}