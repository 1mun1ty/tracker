import { NextRequest, NextResponse } from 'next/server';
import { AppData, TimeEntry } from '@/types';

// GET /api/time-entries - List time entries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    const fs = require('fs');
    const path = require('path');
    const DATA_FILE = path.join(process.cwd(), 'data', 'app.json');
    
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const appData: AppData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    
    let entries = appData.timeEntries;

    if (taskId) {
      entries = entries.filter(e => e.taskId === taskId);
    }
    if (userId) {
      entries = entries.filter(e => e.userId === userId);
    }
    if (date) {
      entries = entries.filter(e => e.date === date);
    }

    // Sort by date (newest first)
    entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      data: entries,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch time entries' },
      { status: 500 }
    );
  }
}

// POST /api/time-entries - Create time entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, startTime, endTime, duration, description, date } = body;

    if (!taskId || !date) {
      return NextResponse.json(
        { success: false, error: 'Task ID and date are required' },
        { status: 400 }
      );
    }

    const fs = require('fs');
    const path = require('path');
    const DATA_FILE = path.join(process.cwd(), 'data', 'app.json');
    
    let appData: AppData = {
      workspaces: [],
      projects: [],
      tasks: [],
      comments: [],
      attachments: [],
      timeEntries: [],
      activities: [],
      notifications: [],
      views: [],
      stats: {},
      lastUpdated: new Date().toISOString(),
    };

    if (fs.existsSync(DATA_FILE)) {
      appData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }

    // Verify task exists
    const task = appData.tasks.find(t => t.id === taskId);
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    // Get current user from session
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);
    const userId = session.userId;

    // Calculate duration if not provided
    let calculatedDuration = duration;
    if (!calculatedDuration && startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      calculatedDuration = Math.round((end.getTime() - start.getTime()) / 1000 / 60); // minutes
    }

    // Create time entry
    const entry: TimeEntry = {
      id: `te-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      taskId,
      userId,
      startTime: startTime || new Date().toISOString(),
      endTime,
      duration: calculatedDuration,
      description,
      date,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    appData.timeEntries.push(entry);
    appData.lastUpdated = new Date().toISOString();

    // Update task actual hours
    if (calculatedDuration) {
      const taskIndex = appData.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        const currentHours = appData.tasks[taskIndex].actualHours || 0;
        appData.tasks[taskIndex].actualHours = currentHours + (calculatedDuration / 60);
      }
    }

    // Save data
    const DATA_DIR = path.join(process.cwd(), 'data');
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      data: entry,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create time entry' },
      { status: 500 }
    );
  }
}
