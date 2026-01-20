'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/lib/userContext';
import { useToast } from '@/components/UI/Toast';
import { 
  Clock, Calendar, CheckCircle2, XCircle, Coffee,
  MapPin, ChevronLeft, ChevronRight, Play, Square, TrendingUp, Timer
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  userId: string;
  userName?: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  workHours?: number;
  breakDuration?: number;
  totalHours?: number;
  status: 'present' | 'absent' | 'late' | 'early-departure' | 'half-day';
  approved: boolean;
  notes?: string;
  createdAt: string;
}

// Get local date string (YYYY-MM-DD) in local timezone
const getLocalDateString = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function AttendancePage() {
  const { user } = useUser();
  const { showToast } = useToast();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Load clock-in state from localStorage on mount (per user)
  useEffect(() => {
    if (!user?.id) return;
    const storageKey = `attendance_clockIn_${user.id}`;
    const dateKey = `attendance_date_${user.id}`;
    const savedClockIn = localStorage.getItem(storageKey);
    const savedDate = localStorage.getItem(dateKey);
    const today = getLocalDateString();
    
    // Only restore if it's the same day
    if (savedClockIn && savedDate === today) {
      setClockInTime(savedClockIn);
      setIsClockedIn(true);
    } else {
      // Clear old data if it's a new day
      localStorage.removeItem(storageKey);
      localStorage.removeItem(dateKey);
    }
  }, [user?.id]);

  useEffect(() => {
    // Cleanup invalid records on first load
    cleanupInvalidRecords();
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    // Refresh attendance records every 30 seconds for real-time updates
    const refreshTimer = setInterval(() => loadAttendance(), 30000);
    return () => {
      clearInterval(timer);
      clearInterval(refreshTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cleanupInvalidRecords = async () => {
    try {
      await fetch('/api/attendance/cleanup', { method: 'POST' });
      loadAttendance();
    } catch {
      // Silently ignore
    }
  };

  const loadAttendance = async () => {
    try {
      const res = await fetch('/api/attendance');
      const data = await res.json();
      if (data.success) {
        // Filter valid records on the client side too
        const validRecords = (data.data || []).filter((r: AttendanceRecord) => r.clockIn);
        setRecords(validRecords);
        
        // Check if THIS USER is already clocked in today
        const today = getLocalDateString();
        const todayRecord = data.data?.find((r: AttendanceRecord) => 
          r.date === today && r.userId === user?.id
        );
        
        if (todayRecord?.clockIn && !todayRecord?.clockOut) {
          setIsClockedIn(true);
          setClockInTime(todayRecord.clockIn);
          // Save to localStorage for persistence (per user)
          localStorage.setItem(`attendance_clockIn_${user?.id}`, todayRecord.clockIn);
          localStorage.setItem(`attendance_date_${user?.id}`, today);
        } else if (todayRecord?.clockOut) {
          // Already clocked out today
          setIsClockedIn(false);
          setClockInTime(null);
          localStorage.removeItem(`attendance_clockIn_${user?.id}`);
          localStorage.removeItem(`attendance_date_${user?.id}`);
        }
      }
    } catch (error) {
      console.error('Failed to load attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      const today = getLocalDateString();
      const clockInTimeNow = new Date().toISOString();
      
      const res = await fetch('/api/attendance/clock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          date: today,
          clockIn: clockInTimeNow,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsClockedIn(true);
        setClockInTime(clockInTimeNow);
        // Save to localStorage for persistence across page refreshes (per user)
        localStorage.setItem(`attendance_clockIn_${user?.id}`, clockInTimeNow);
        localStorage.setItem(`attendance_date_${user?.id}`, today);
        loadAttendance();
        showToast('success', `${user?.name} clocked in! Have a productive day 🚀`);
      } else {
        showToast('warning', data.error || 'Failed to clock in');
      }
    } catch {
      showToast('error', 'Failed to clock in. Please try again.');
    }
  };

  const handleClockOut = async () => {
    try {
      const today = getLocalDateString();
      
      const res = await fetch('/api/attendance/clock-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          date: today,
          clockOut: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsClockedIn(false);
        setClockInTime(null);
        // Clear localStorage (per user)
        localStorage.removeItem(`attendance_clockIn_${user?.id}`);
        localStorage.removeItem(`attendance_date_${user?.id}`);
        loadAttendance();
        const hours = data.data?.workHours?.toFixed(1) || '0';
        showToast('success', `${user?.name} clocked out! Worked ${hours} hours today 💪`);
      } else {
        showToast('error', data.error || 'Failed to clock out');
      }
    } catch {
      showToast('error', 'Failed to clock out. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'absent': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'late': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'half-day': return <Coffee className="w-4 h-4 text-orange-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'absent': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'late': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'half-day': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const getElapsedTime = () => {
    if (!clockInTime) return '00:00:00';
    
    const start = new Date(clockInTime);
    const now = currentTime;
    const diff = now.getTime() - start.getTime();
    
    // Ensure we don't show negative time
    if (diff < 0) return '00:00:00';
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getElapsedHours = () => {
    if (!clockInTime) return 0;
    const start = new Date(clockInTime);
    const now = currentTime;
    const diff = now.getTime() - start.getTime();
    return diff / 3600000;
  };

  // Calculate stats for CURRENT USER only
  const myRecords = records.filter(r => r.userId === user?.id);
  
  const getTotalHoursThisWeek = () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    let total = myRecords
      .filter(r => new Date(r.date) >= weekStart)
      .reduce((sum, r) => sum + (r.workHours || 0), 0);
    
    // Add current session if clocked in
    if (isClockedIn) {
      total += getElapsedHours();
    }
    
    return total;
  };

  const getTotalHoursThisMonth = () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    let total = myRecords
      .filter(r => new Date(r.date) >= monthStart)
      .reduce((sum, r) => sum + (r.workHours || 0), 0);
    
    // Add current session if clocked in
    if (isClockedIn) {
      total += getElapsedHours();
    }
    
    return total;
  };

  const getAvgHoursPerDay = () => {
    const recordsWithHours = myRecords.filter(r => r.workHours && r.workHours > 0);
    if (recordsWithHours.length === 0) return 0;
    return recordsWithHours.reduce((sum, r) => sum + (r.workHours || 0), 0) / recordsWithHours.length;
  };

  // Generate calendar days for current month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add empty slots for days before first day
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add all days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }
    
    return days;
  };

  const getRecordForDay = (day: number) => {
    const date = getLocalDateString(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    return records.find(r => r.date === date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weeklyHours = getTotalHoursThisWeek();
  const monthlyHours = getTotalHoursThisMonth();
  const avgHours = getAvgHoursPerDay();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Attendance - {user?.name}
        </h1>
        <p className="text-slate-400">Track your work hours and attendance</p>
      </div>

      {/* Clock In/Out Card */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 mb-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <p className="text-sm text-slate-400 mb-2">Current Time</p>
            <p className="text-5xl font-bold text-white font-mono">
              {formatTime(currentTime)}
            </p>
            <p className="text-slate-400 mt-2">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            {isClockedIn ? (
              <>
                <div className="text-center mb-2">
                  <p className="text-sm text-slate-400">Time Worked Today</p>
                  <p className="text-5xl font-bold text-cyan-400 font-mono">{getElapsedTime()}</p>
                  {clockInTime && (
                    <p className="text-xs text-slate-500 mt-2">
                      Clocked in at {new Date(clockInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleClockOut}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 transition-all"
                >
                  <Square className="w-6 h-6" />
                  Clock Out
                </button>
              </>
            ) : (
              <button
                onClick={handleClockIn}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
              >
                <Play className="w-6 h-6" />
                Clock In
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold ${
              user?.id === 'user-ali' 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                : 'bg-gradient-to-br from-violet-500 to-purple-600'
            }`}>
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-xs text-slate-500">Home Office</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hours Summary - Current User */}
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-white">{user?.name}&apos;s Hours</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <Timer className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-sm text-slate-400">Today</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {isClockedIn ? getElapsedHours().toFixed(1) : 
              (records.find(r => r.date === getLocalDateString())?.workHours?.toFixed(1) || '0')}
            <span className="text-lg text-slate-400 ml-1">hrs</span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-violet-400" />
            </div>
            <span className="text-sm text-slate-400">This Week</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {weeklyHours.toFixed(1)}
            <span className="text-lg text-slate-400 ml-1">hrs</span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm text-slate-400">This Month</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {monthlyHours.toFixed(1)}
            <span className="text-lg text-slate-400 ml-1">hrs</span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-sm text-slate-400">Avg/Day</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {avgHours.toFixed(1)}
            <span className="text-lg text-slate-400 ml-1">hrs</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-slate-500 py-2">
                {day}
              </div>
            ))}
            {getDaysInMonth().map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }
              
              const record = getRecordForDay(day);
              const isToday = 
                day === new Date().getDate() && 
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();
              
              return (
                <div
                  key={day}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg border transition-colors cursor-pointer hover:bg-slate-700/50 ${
                    isToday 
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                      : 'border-transparent text-slate-400'
                  }`}
                >
                  <span className="text-sm">{day}</span>
                  {record && (
                    <div className="flex flex-col items-center mt-0.5">
                      {getStatusIcon(record.status)}
                      {record.workHours && (
                        <span className="text-[10px] text-slate-500">{record.workHours.toFixed(1)}h</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Records */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Work Log - All Users</h2>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {(() => {
              // Filter valid records (must have clockIn) and sort by date+time
              const validRecords = records
                .filter(r => r.clockIn) // Only show records with valid clock-in
                .sort((a, b) => {
                  // Sort by date first, then by clockIn time
                  const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
                  if (dateCompare !== 0) return dateCompare;
                  return new Date(b.clockIn!).getTime() - new Date(a.clockIn!).getTime();
                });
              
              // Group by date
              const groupedByDate: Record<string, AttendanceRecord[]> = {};
              validRecords.forEach(record => {
                if (!groupedByDate[record.date]) {
                  groupedByDate[record.date] = [];
                }
                groupedByDate[record.date].push(record);
              });
              
              const formatWorkHours = (hours: number) => {
                const h = Math.floor(hours);
                const m = Math.round((hours - h) * 60);
                if (h > 0 && m > 0) return `${h}h ${m}m`;
                if (h > 0) return `${h}h`;
                if (m > 0) return `${m}m`;
                return '< 1m';
              };
              
              return Object.entries(groupedByDate)
                .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                .slice(0, 5) // Show last 5 days
                .map(([date, dayRecords]) => {
                  const dayTotal = dayRecords.reduce((sum, r) => sum + (r.workHours || 0), 0);
                  
                  return (
                    <div key={date} className="space-y-2">
                      {/* Date Header */}
                      <div className="flex items-center justify-between px-2 py-1 bg-slate-700/30 rounded-lg">
                        <span className="text-sm font-medium text-slate-300">
                          {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className="text-sm font-bold text-cyan-400">
                          {formatWorkHours(dayTotal)} total
                        </span>
                      </div>
                      
                      {/* Day's Records */}
                      {dayRecords.map((record) => {
                        const isAli = record.userId === 'user-ali';
                        const userName = record.userName || (isAli ? 'Ali' : 'Ahad');
                        const isCurrentUser = record.userId === user?.id;
                        const isActive = record.clockIn && !record.clockOut;
                        
                        return (
                          <div
                            key={record.id}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                              isCurrentUser 
                                ? 'bg-cyan-500/10 border border-cyan-500/20' 
                                : 'bg-slate-900/50'
                            }`}
                          >
                            {/* User Avatar */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 ${
                              isAli 
                                ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                                : 'bg-gradient-to-br from-violet-500 to-purple-600'
                            }`}>
                              {userName.charAt(0)}
                            </div>
                            
                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`font-medium ${isAli ? 'text-emerald-400' : 'text-violet-400'}`}>
                                  {userName}
                                </span>
                                {isCurrentUser && <span className="text-xs text-cyan-400">(You)</span>}
                                {isActive && (
                                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full animate-pulse">
                                    Working
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-400 mt-0.5">
                                <span>
                                  {new Date(record.clockIn!).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span>→</span>
                                {record.clockOut ? (
                                  <span>
                                    {new Date(record.clockOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                ) : (
                                  <span className="text-emerald-400">Now</span>
                                )}
                              </div>
                            </div>
                            
                            {/* Hours & Status */}
                            <div className="text-right flex-shrink-0">
                              <div className={`font-mono font-bold ${isActive ? 'text-emerald-400' : 'text-white'}`}>
                                {record.workHours ? formatWorkHours(record.workHours) : (isActive ? 'Active' : '-')}
                              </div>
                              {record.status && record.clockOut && (
                                <span className={`text-xs px-1.5 py-0.5 rounded ${getStatusColor(record.status)}`}>
                                  {record.status === 'early-departure' ? 'Early' : 
                                   record.status === 'half-day' ? 'Half' : 
                                   record.status === 'present' ? '✓' : record.status}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                });
            })()}
            
            {records.filter(r => r.clockIn).length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <Calendar className="w-10 h-10 mx-auto mb-3 text-slate-500" />
                <p>No attendance records yet</p>
                <p className="text-sm text-slate-500 mt-1">Clock in to start tracking</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
