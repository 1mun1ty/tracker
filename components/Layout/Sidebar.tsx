'use client';

import { useState } from 'react';
import { Project } from '@/types';
import { useUser } from '@/lib/userContext';
import { 
  Folder, Plus, Clock, BarChart3, Calendar, 
  MessageCircle, ChevronDown, ChevronRight,
  Briefcase, LogOut
} from 'lucide-react';

interface SidebarProps {
  projects: Project[];
  selectedProject: Project | null;
  activeView?: string;
  onProjectSelect: (project: Project) => void;
  onProjectCreate: (project: Project) => void;
  onViewChange?: (view: string) => void;
}

const navItems = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
  { id: 'projects' as const, label: 'Projects', icon: Briefcase },
  { id: 'attendance' as const, label: 'Attendance', icon: Calendar },
  { id: 'chat' as const, label: 'Chat', icon: MessageCircle },
];

export default function Sidebar({
  projects,
  selectedProject,
  activeView = 'dashboard',
  onProjectSelect,
  onProjectCreate,
  onViewChange,
}: SidebarProps) {
  const { user, logout } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [loading, setLoading] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#EC4899', '#14B8A6', '#84CC16', '#F97316',
  ];

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, color }),
      });

      const data = await response.json();
      if (data.success) {
        onProjectCreate(data.data);
        setShowCreateModal(false);
        setName('');
        setDescription('');
        setColor('#3B82F6');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-72 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-700/50 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-5 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              TimeFlow
            </h1>
            <p className="text-xs text-slate-500">Learning Tracker</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="p-3 border-b border-slate-700/50">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange?.(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 shadow-lg shadow-cyan-500/5'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : ''}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Projects Section */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>Projects</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-cyan-400 transition-colors"
              title="Create project"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setProjectsExpanded(!projectsExpanded)}
              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-300 transition-colors"
              title={projectsExpanded ? 'Collapse' : 'Expand'}
            >
              {projectsExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {projectsExpanded && (
          <div className="space-y-1 mt-2">
            {projects.length === 0 ? (
              <div className="px-3 py-4 text-center">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Folder className="w-6 h-6 text-slate-600" />
                </div>
                <p className="text-sm text-slate-500 mb-2">No projects yet</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="text-sm text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Create your first project
                </button>
              </div>
            ) : (
              projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    onProjectSelect(project);
                    onViewChange?.('projects');
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    selectedProject?.id === project.id && activeView === 'projects'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-md ring-2 ring-offset-1 ring-offset-slate-900"
                    style={{ backgroundColor: project.color, boxShadow: `0 0 8px ${project.color}40` }}
                  />
                  <span className="flex-1 text-left truncate text-sm">{project.name}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer - User Info */}
      {user && (
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-xl">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
              user.id === 'user-ali' 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                : 'bg-gradient-to-br from-violet-500 to-purple-600'
            }`}>
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-700 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-5">Create Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="What's this project about?"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Color Theme
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-9 h-9 rounded-lg transition-transform hover:scale-110 ${
                        color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/25"
                >
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setName('');
                    setDescription('');
                    setColor('#3B82F6');
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
