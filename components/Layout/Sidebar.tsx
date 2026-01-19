'use client';

import { useState } from 'react';
import { Workspace, Project } from '@/types';
import { Folder, Plus, ChevronDown, ChevronRight, Settings, Users, Clock } from 'lucide-react';

interface SidebarProps {
  workspace: Workspace;
  projects: Project[];
  selectedProject: Project | null;
  activeView?: 'project' | 'time';
  onProjectSelect: (project: Project) => void;
  onProjectCreate: (project: Project) => void;
  onWorkspaceChange: (workspace: Workspace) => void;
  onViewChange?: (view: 'project' | 'time') => void;
  workspaces: Workspace[];
}

export default function Sidebar({
  workspace,
  projects,
  selectedProject,
  activeView = 'project',
  onProjectSelect,
  onProjectCreate,
  onWorkspaceChange,
  onViewChange,
  workspaces,
}: SidebarProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({
          workspaceId: workspace.id,
          name,
          description,
          color,
        }),
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
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col h-screen">
      {/* Workspace Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <button
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-semibold">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-white font-medium truncate">{workspace.name}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {showWorkspaceMenu && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    onWorkspaceChange(ws);
                    setShowWorkspaceMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 text-white flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                  {ws.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-b border-gray-700 space-y-2">
        <button
          onClick={() => onViewChange?.('time')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            activeView === 'time'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Time Tracker</span>
        </button>
        <button
          onClick={() => onViewChange?.('project')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            activeView === 'project'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Folder className="w-4 h-4" />
          <span className="text-sm font-medium">Projects</span>
        </button>
      </div>

      {/* Projects Section */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Projects</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => {
                onProjectSelect(project);
                onViewChange?.('project');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                selectedProject?.id === project.id && activeView === 'project'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: project.color }}
              />
              <span className="flex-1 text-left truncate">{project.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </button>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Create Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="My Project"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Project description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded ${
                        color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setName('');
                    setDescription('');
                    setColor('#3B82F6');
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
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
