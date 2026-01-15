'use client';

import { useEffect, useState } from 'react';
import { DataManager } from '@/lib/data';
import { generateInitialData } from '@/lib/initialData';
import { ProjectData } from '@/types';
import { TimerProvider } from '@/lib/timerContext';
import { ToastProvider } from '@/lib/toast';
import Dashboard from '@/components/Dashboard';
import TaskList from '@/components/TaskList';
import TimeTracker from '@/components/TimeTracker';
import PhaseView from '@/components/PhaseView';
import MilestoneView from '@/components/MilestoneView';
import Navigation from '@/components/Navigation';
import TimerBanner from '@/components/TimerBanner';

export default function Home() {
  const [data, setData] = useState<ProjectData | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'time' | 'phases' | 'milestones'>('dashboard');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const manager = DataManager.getInstance();
    let projectData = manager.getData();

    // Check if we need to initialize or reload data
    // Complete comprehensive roadmap should have ~293 tasks across all 6 phases
    const hasIncompleteData = projectData.tasks.length === 0 || 
                              !projectData.phases.length ||
                              projectData.tasks.length < 290 || // Less than expected comprehensive tasks
                              projectData.phases.some(phase => {
                                const phaseTasks = projectData.tasks.filter(t => t.phaseId === phase.id);
                                return phaseTasks.length === 0 && phase.id !== 'phase-1'; // All phases except phase-1 should have tasks
                              });

    if (hasIncompleteData) {
      console.log('Initializing with complete roadmap data...');
      projectData = generateInitialData();
      manager.updateData(() => projectData);
      console.log('Loaded tasks:', projectData.tasks.length, 'across', projectData.phases.length, 'phases');
    }

    setData(projectData);
    setInitialized(true);

    // Listen for storage changes (for multi-tab sync)
    const handleStorageChange = () => {
      setData(manager.getData());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateData = () => {
    const manager = DataManager.getInstance();
    setData(manager.getData());
  };

  if (!initialized || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading project data...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <TimerProvider>
        <div className="min-h-screen bg-gray-900">
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <TimerBanner data={data} onStop={updateData} />
            {activeTab === 'dashboard' && <Dashboard data={data} onUpdate={updateData} />}
            {activeTab === 'tasks' && <TaskList data={data} onUpdate={updateData} />}
            {activeTab === 'time' && <TimeTracker data={data} onUpdate={updateData} />}
            {activeTab === 'phases' && <PhaseView data={data} onUpdate={updateData} />}
            {activeTab === 'milestones' && <MilestoneView data={data} onUpdate={updateData} />}
          </main>
        </div>
      </TimerProvider>
    </ToastProvider>
  );
}