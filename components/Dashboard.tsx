'use client';

import { ProjectData, Task } from '@/types';
import { DataManager } from '@/lib/data';
import { formatDuration, formatTimerTime, getStatusColor } from '@/lib/utils';
import { useToast } from '@/lib/toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';

interface DashboardProps {
  data: ProjectData;
  onUpdate: () => void;
}

export default function Dashboard({ data, onUpdate }: DashboardProps) {
  const stats = data.stats;
  const { showConfirm, showToast } = useToast();
  
  // Calculate actual time from timeEntries (more accurate)
  const totalActualMinutes = data.timeEntries.reduce((sum, te) => sum + (te.duration || 0), 0);
  const totalActualHours = totalActualMinutes / 60;

  // Phase progress data
  const phaseData = data.phases.map(phase => {
    const phaseTasks = data.tasks.filter(t => t.phaseId === phase.id);
    const completed = phaseTasks.filter(t => t.status === 'completed').length;
    return {
      name: phase.title.replace('Phase ', '').substring(0, 20),
      completed,
      total: phaseTasks.length,
      percentage: phaseTasks.length > 0 ? (completed / phaseTasks.length) * 100 : 0,
    };
  });

  // Status distribution
  const blockedTasks = data.tasks.filter(t => t.status === 'blocked').length;
  const statusData = [
    { name: 'Completed', value: stats.completedTasks, color: '#10B981' },
    { name: 'In Progress', value: stats.inProgressTasks, color: '#3B82F6' },
    { name: 'Pending', value: stats.pendingTasks, color: '#F59E0B' },
    { name: 'Blocked', value: blockedTasks, color: '#EF4444' },
  ].filter(item => item.value > 0); // Only show statuses with tasks

  // Time tracking over time (last 7 days)
  const timeData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayEntries = data.timeEntries.filter(te => te.date === dateStr);
    const totalMinutes = dayEntries.reduce((sum, te) => sum + (te.duration || 0), 0);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      hours: totalMinutes / 60,
    };
  });

  const completionRate = stats.totalTasks > 0 
    ? ((stats.completedTasks / stats.totalTasks) * 100).toFixed(1)
    : '0';

  const reloadAllTasks = () => {
    showConfirm(
      'This will add missing tasks from the complete roadmap while preserving all your progress (completed tasks, time entries, etc.). Continue?',
      () => {
        const manager = DataManager.getInstance();
        const currentData = manager.getData();
        const { generateInitialData } = require('@/lib/initialData');
        const initialData = generateInitialData();
        
        // Create a map of existing tasks by ID for quick lookup
        const existingTasksMap = new Map(currentData.tasks.map(t => [t.id, t]));
        
        // Merge tasks: preserve existing task progress, add new tasks
        const mergedTasks = initialData.tasks.map((newTask: Task) => {
          const existingTask = existingTasksMap.get(newTask.id);
          if (existingTask) {
            // Preserve existing task progress
            return {
              ...newTask, // Get updated structure from initial data
              status: existingTask.status, // Preserve status
              actualHours: existingTask.actualHours || 0, // Preserve actual hours
              completedAt: existingTask.completedAt, // Preserve completion date
              updatedAt: existingTask.updatedAt, // Preserve last update
              createdAt: existingTask.createdAt, // Preserve creation date
              // Preserve any custom changes (priority, estimated hours if manually changed)
              priority: existingTask.priority !== 'medium' ? existingTask.priority : newTask.priority,
              estimatedHours: existingTask.estimatedHours !== newTask.estimatedHours ? existingTask.estimatedHours : newTask.estimatedHours,
            };
          }
          // New task - use as is
          return newTask;
        });
        
        // Preserve all existing time entries
        const preservedTimeEntries = currentData.timeEntries;
        
        // Update data with merged tasks, preserving time entries and milestones
        manager.updateData(() => ({
          ...initialData,
          tasks: mergedTasks,
          timeEntries: preservedTimeEntries, // Keep all existing time entries
          milestones: currentData.milestones, // Preserve milestone progress
        }));
        
        onUpdate();
        showToast('Tasks updated successfully! All your progress (completed tasks, time entries) has been preserved.', 'success');
      }
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2">Project Dashboard</h2>
            <p className="text-blue-100 text-lg">
              Track your progress on the AI SOC & Pentest Agent development
            </p>
          </div>
          {data.tasks.length < 200 && (
            <button
              onClick={reloadAllTasks}
              className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg font-semibold transition-all flex items-center space-x-2 backdrop-blur-sm"
            >
              <span>Reload All Tasks</span>
            </button>
          )}
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Cards with enhanced design */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden shadow-xl rounded-xl border border-green-500/30 hover:border-green-500/50 transition-all duration-300 transform hover:-translate-y-1">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-400 uppercase tracking-wide mb-1">Completion Rate</p>
                <p className="text-3xl font-bold text-white">{completionRate}%</p>
                <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="ml-4 p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden shadow-xl rounded-xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-1">Completed Tasks</p>
                <p className="text-3xl font-bold text-white">
                  {stats.completedTasks} <span className="text-lg text-gray-400">/ {stats.totalTasks}</span>
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {stats.inProgressTasks} in progress
                </p>
              </div>
              <div className="ml-4 p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden shadow-xl rounded-xl border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 transform hover:-translate-y-1">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-orange-400 uppercase tracking-wide mb-1">Time Logged</p>
                <p className="text-3xl font-bold text-white font-mono">
                  {formatTimerTime(Math.floor(totalActualMinutes * 60))}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {stats.totalEstimatedHours > 0 
                    ? `${Math.round((totalActualHours / stats.totalEstimatedHours) * 100)}% of estimated`
                    : 'No estimate set'}
                </p>
              </div>
              <div className="ml-4 p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden shadow-xl rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-1">Estimated Hours</p>
                <p className="text-3xl font-bold text-white">
                  {formatDuration(stats.totalEstimatedHours * 60)}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {stats.totalTasks} total tasks
                </p>
              </div>
              <div className="ml-4 p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts with enhanced styling */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Phase Progress */}
        <div className="bg-gray-800 shadow-xl rounded-xl border border-gray-700 p-6 hover:shadow-2xl hover:border-gray-600 transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Phase Progress</h3>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={phaseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                }}
              />
              <Bar 
                dataKey="percentage" 
                radius={[8, 8, 0, 0]}
                fill="url(#colorGradient)"
              >
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-gray-800 shadow-xl rounded-xl border border-gray-700 p-6 hover:shadow-2xl hover:border-gray-600 transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Task Status</h3>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Time Tracking Chart */}
      <div className="bg-gray-800 shadow-xl rounded-xl border border-gray-700 p-6 hover:shadow-2xl hover:border-gray-600 transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Time Logged (Last 7 Days)</h3>
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
            <Clock className="h-6 w-6 text-white" />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="hours" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 shadow-xl rounded-xl border border-gray-700 p-6 hover:shadow-2xl hover:border-gray-600 transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Recent Activity</h3>
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="space-y-3">
          {data.tasks
            .filter(t => t.status === 'completed')
            .sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''))
            .slice(0, 5)
            .map(task => (
              <div 
                key={task.id} 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg border border-gray-600 hover:border-green-500/50 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{task.title}</p>
                    <p className="text-xs text-gray-400">
                      Completed {task.completedAt ? new Date(task.completedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      }) : ''}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                  Completed
                </span>
              </div>
            ))}
          {data.tasks.filter(t => t.status === 'completed').length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-gray-600" />
              <p>No completed tasks yet. Start working on your tasks!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}