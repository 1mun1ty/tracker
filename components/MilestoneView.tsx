'use client';

import { useState } from 'react';
import { ProjectData, Milestone } from '@/types';
import { DataManager } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { Target, CheckCircle2, Clock, AlertCircle, Play, Trophy, Plus, X } from 'lucide-react';

interface MilestoneViewProps {
  data: ProjectData;
  onUpdate: () => void;
}

export default function MilestoneView({ data, onUpdate }: MilestoneViewProps) {
  const manager = DataManager.getInstance();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    phaseId: data.phases[0]?.id || '',
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const startMilestone = (milestoneId: string) => {
    // Mark milestone as in progress (we'll use 'pending' status but track it differently)
    // For now, we'll just update the milestone
    const milestone = data.milestones.find(m => m.id === milestoneId);
    if (milestone && milestone.status === 'pending') {
      // You can add a 'startedAt' field or just track it
      onUpdate();
    }
  };

  const achieveMilestone = (milestoneId: string) => {
    const milestone = data.milestones.find(m => m.id === milestoneId);
    if (milestone) {
      // Update milestone status
      const updatedMilestones = data.milestones.map(m => 
        m.id === milestoneId 
          ? { ...m, status: 'achieved' as const, achievedDate: new Date().toISOString() }
          : m
      );
      manager.updateData(d => ({ ...d, milestones: updatedMilestones }));
      onUpdate();
    }
  };
  const getMilestoneIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'achieved':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'delayed':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getMilestoneColor = (status: Milestone['status']) => {
    switch (status) {
      case 'achieved':
        return 'border-green-500/50 bg-green-500/100/10';
      case 'delayed':
        return 'border-red-500/50 bg-red-500/100/10';
      default:
        return 'border-yellow-500/50 bg-yellow-500/100/10';
    }
  };

  const sortedMilestones = [...data.milestones].sort((a, b) => 
    new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  );

  const createMilestone = () => {
    if (!newMilestone.title.trim() || !newMilestone.phaseId) return;

    const milestone: Milestone = {
      id: `milestone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: newMilestone.title,
      description: newMilestone.description || undefined,
      targetDate: new Date(newMilestone.targetDate).toISOString(),
      phaseId: newMilestone.phaseId,
      status: 'pending',
      tasks: [],
    };

    manager.addMilestone(milestone);
    setShowAddModal(false);
    setNewMilestone({
      title: '',
      description: '',
      phaseId: data.phases[0]?.id || '',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Milestones</h2>
          <p className="mt-2 text-sm text-gray-400">
            Track key project milestones and achievements
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Milestone</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sortedMilestones.map(milestone => {
          const phase = data.phases.find(p => p.id === milestone.phaseId);
          const targetDate = new Date(milestone.targetDate);
          const isOverdue = milestone.status === 'pending' && targetDate < new Date();
          const daysUntil = Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

          return (
            <div
              key={milestone.id}
              className={`bg-gray-800 shadow rounded-lg border-2 p-6 ${getMilestoneColor(milestone.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="mt-1">
                    {getMilestoneIcon(milestone.status)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{milestone.title}</h3>
                    {milestone.description && (
                      <p className="mt-1 text-sm text-gray-400">{milestone.description}</p>
                    )}
                    
                    <div className="mt-4 flex items-center space-x-6 text-sm">
                      <div>
                        <span className="text-gray-400">Target Date:</span>
                        <span className="ml-2 font-medium text-white">
                          {formatDate(milestone.targetDate)}
                        </span>
                        {isOverdue && (
                          <span className="ml-2 text-red-400 font-semibold">
                            (Overdue by {Math.abs(daysUntil)} days)
                          </span>
                        )}
                        {!isOverdue && milestone.status === 'pending' && (
                          <span className="ml-2 text-gray-400">
                            ({daysUntil > 0 ? `${daysUntil} days remaining` : 'Due today'})
                          </span>
                        )}
                      </div>
                      
                      {milestone.achievedDate && (
                        <div>
                          <span className="text-gray-400">Achieved:</span>
                          <span className="ml-2 font-medium text-white">
                            {formatDate(milestone.achievedDate)}
                          </span>
                        </div>
                      )}
                      
                      {phase && (
                        <div>
                          <span className="text-gray-400">Phase:</span>
                          <span className="ml-2 font-medium text-white">
                            {phase.title}
                          </span>
                        </div>
                      )}
                    </div>

                    {milestone.tasks.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-300 mb-2">Related Tasks:</p>
                        <div className="flex flex-wrap gap-2">
                          {milestone.tasks.map(taskId => {
                            const task = data.tasks.find(t => t.id === taskId);
                            if (!task) return null;
                            const isCompleted = task.status === 'completed';
                            return (
                              <span
                                key={taskId}
                                className={`px-2 py-1 text-xs rounded flex items-center space-x-1 ${
                                  isCompleted
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-gray-700 text-gray-300'
                                }`}
                              >
                                {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                                <span>{task.title}</span>
                              </span>
                            );
                          })}
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-500/100 h-2 rounded-full transition-all"
                              style={{
                                width: `${(milestone.tasks.filter(tId => {
                                  const t = data.tasks.find(t => t.id === tId);
                                  return t?.status === 'completed';
                                }).length / milestone.tasks.length) * 100}%`
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {milestone.tasks.filter(tId => {
                              const t = data.tasks.find(t => t.id === tId);
                              return t?.status === 'completed';
                            }).length} / {milestone.tasks.length} tasks completed
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    milestone.status === 'achieved'
                      ? 'bg-green-500/20 text-green-400'
                      : milestone.status === 'delayed'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                  </span>
                  
                  {milestone.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => achieveMilestone(milestone.id)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 font-semibold text-sm flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
                      >
                        <Trophy className="w-4 h-4" />
                        <span>Mark Achieved</span>
                      </button>
                    </div>
                  )}
                  
                  {milestone.status === 'achieved' && (
                    <div className="flex items-center space-x-1 text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-semibold">Achieved!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Milestone Summary */}
      <div className="bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-500/10 rounded-lg">
            <p className="text-2xl font-bold text-green-400">
              {data.milestones.filter(m => m.status === 'achieved').length}
            </p>
            <p className="text-sm text-gray-400 mt-1">Achieved</p>
          </div>
          <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
            <p className="text-2xl font-bold text-yellow-400">
              {data.milestones.filter(m => m.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-400 mt-1">Pending</p>
          </div>
          <div className="text-center p-4 bg-red-500/10 rounded-lg">
            <p className="text-2xl font-bold text-red-400">
              {data.milestones.filter(m => m.status === 'delayed').length}
            </p>
            <p className="text-sm text-gray-400 mt-1">Delayed</p>
          </div>
        </div>
      </div>

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Add New Milestone</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Milestone Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                    placeholder="Enter milestone title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                    placeholder="Enter milestone description"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phase <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newMilestone.phaseId}
                      onChange={(e) => setNewMilestone({ ...newMilestone, phaseId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {data.phases.map(phase => (
                        <option key={phase.id} value={phase.id}>{phase.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={newMilestone.targetDate}
                      onChange={(e) => setNewMilestone({ ...newMilestone, targetDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    onClick={createMilestone}
                    disabled={!newMilestone.title.trim() || !newMilestone.phaseId}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Milestone
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-300 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}