'use client';

import { useState } from 'react';
import { Workspace } from '@/types';
import { Plus, Building2, Check } from 'lucide-react';

interface WorkspaceSelectorProps {
  workspaces: Workspace[];
  onSelect: (workspace: Workspace) => void;
  onCreate: (workspace: Workspace) => void;
}

export default function WorkspaceSelector({ workspaces, onSelect, onCreate }: WorkspaceSelectorProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      const data = await response.json();
      if (data.success) {
        onCreate(data.data);
        setShowCreateModal(false);
        setName('');
        setDescription('');
      }
    } catch (error) {
      console.error('Failed to create workspace:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Select Workspace</h1>
        <p className="text-gray-400">Choose a workspace or create a new one</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workspaces.map((workspace) => (
          <button
            key={workspace.id}
            onClick={() => onSelect(workspace)}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors text-left group"
          >
            <div className="flex items-center justify-between mb-3">
              <Building2 className="w-8 h-8 text-blue-500" />
              <Check className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{workspace.name}</h3>
            {workspace.description && (
              <p className="text-sm text-gray-400 line-clamp-2">{workspace.description}</p>
            )}
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <span>{workspace.members.length} member{workspace.members.length !== 1 ? 's' : ''}</span>
            </div>
          </button>
        ))}

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors text-left flex flex-col items-center justify-center min-h-[150px]"
        >
          <Plus className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-gray-400 font-medium">Create Workspace</span>
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Create Workspace</h2>
            <form onSubmit={handleCreate} className="space-y-4">
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
                  placeholder="My Workspace"
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
                  placeholder="Workspace description"
                  rows={3}
                />
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
