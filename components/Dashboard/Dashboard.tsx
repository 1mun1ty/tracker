'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/types';
import { useUser } from '@/lib/userContext';
import { 
  Clock, Users, Briefcase, TrendingUp, Calendar,
  CheckCircle2, ListTodo, BookOpen, MessageCircle
} from 'lucide-react';

interface DashboardProps {
  onViewChange?: (view: string) => void;
  onProjectSelect?: (project: Project) => void;
  projects?: Project[];
}

interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  tasksCompleted: number;
  pendingTasks: number;
  inProgressTasks: number;
}

export default function Dashboard({ onViewChange, onProjectSelect, projects = [] }: DashboardProps) {
  const { user } = useUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load tasks for stats
      const tasksRes = await fetch('/api/tasks');
      const tasksData = await tasksRes.json();

      // Calculate task stats
      let tasksCompleted = 0;
      let pendingTasks = 0;
      let inProgressTasks = 0;
      if (tasksData.success && tasksData.data) {
        tasksData.data.forEach((task: any) => {
          if (task.status === 'done' || task.status === 'completed') tasksCompleted++;
          else if (task.status === 'in_progress' || task.status === 'in-progress') inProgressTasks++;
          else pendingTasks++;
        });
      }

      setStats({
        totalProjects: projects.length,
        totalTasks: tasksData.data?.length || 0,
        tasksCompleted,
        pendingTasks,
        inProgressTasks,
      });
    } catch {
      // Silently handle fetch errors
    } finally {
      setLoading(false);
    }
  };

  const handleViewProjects = () => {
    onViewChange?.('projects');
  };

  const handleViewTasks = () => {
    // Find learning roadmap project
    const roadmapProject = projects.find(p => p.name.includes('Learning Roadmap'));
    if (roadmapProject && onProjectSelect) {
      onProjectSelect(roadmapProject);
    } else {
      onViewChange?.('projects');
    }
  };

  const handleViewAttendance = () => {
    onViewChange?.('attendance');
  };

  const handleViewChat = () => {
    onViewChange?.('chat');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Tasks',
      value: stats?.totalTasks || 0,
      unit: '',
      icon: CheckCircle2,
      color: 'from-cyan-500 to-blue-600',
      shadowColor: 'shadow-cyan-500/20',
      change: `${stats?.tasksCompleted || 0} done`,
    },
    {
      label: 'In Progress',
      value: stats?.inProgressTasks || 0,
      unit: '',
      icon: ListTodo,
      color: 'from-orange-500 to-amber-600',
      shadowColor: 'shadow-orange-500/20',
      change: `${stats?.pendingTasks || 0} pending`,
    },
    {
      label: 'Projects',
      value: stats?.totalProjects || 0,
      unit: '',
      icon: Briefcase,
      color: 'from-emerald-500 to-teal-600',
      shadowColor: 'shadow-emerald-500/20',
      change: 'Active',
    },
    {
      label: 'Team Members',
      value: 2,
      unit: '',
      icon: Users,
      color: 'from-violet-500 to-purple-600',
      shadowColor: 'shadow-violet-500/20',
      change: 'Ali & Ahad',
    },
  ];

  const progressPercentage = stats?.totalTasks 
    ? Math.round((stats.tasksCompleted / stats.totalTasks) * 100) 
    : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-slate-400">
          Track your SIEM Security Learning Roadmap progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 overflow-hidden group hover:border-slate-600/50 transition-all"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg ${stat.shadowColor}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm text-slate-400">
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">
                    {stat.value}
                    {stat.unit && <span className="text-lg text-slate-400 ml-1">{stat.unit}</span>}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Progress */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Learning Progress</h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>{stats?.tasksCompleted || 0} of {stats?.totalTasks || 0} tasks</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Overall Progress</span>
              <span className="text-sm font-bold text-cyan-400">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Task Status Breakdown */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">{stats?.tasksCompleted || 0}</p>
              <p className="text-xs text-slate-400 mt-1">Completed</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-orange-400">{stats?.inProgressTasks || 0}</p>
              <p className="text-xs text-slate-400 mt-1">In Progress</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-400">{stats?.pendingTasks || 0}</p>
              <p className="text-xs text-slate-400 mt-1">Pending</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
          
          <div className="space-y-3">
            <button 
              onClick={handleViewAttendance}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl text-left hover:from-cyan-500/20 hover:to-blue-500/20 transition-all group"
            >
              <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-white">Clock In/Out</p>
                <p className="text-xs text-slate-400">Track work hours</p>
              </div>
            </button>

            <button 
              onClick={handleViewTasks}
              className="w-full flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-left hover:bg-slate-900 hover:border-slate-600 transition-all group"
            >
              <div className="w-10 h-10 bg-violet-500 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-white">Learning Roadmap</p>
                <p className="text-xs text-slate-400">View your learning tasks</p>
              </div>
            </button>

            <button 
              onClick={handleViewProjects}
              className="w-full flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-left hover:bg-slate-900 hover:border-slate-600 transition-all group"
            >
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-white">All Projects</p>
                <p className="text-xs text-slate-400">Manage your projects</p>
              </div>
            </button>

            <button 
              onClick={handleViewChat}
              className="w-full flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-left hover:bg-slate-900 hover:border-slate-600 transition-all group"
            >
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-white">Chat</p>
                <p className="text-xs text-slate-400">Message your partner</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
