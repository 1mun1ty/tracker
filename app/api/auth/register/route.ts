import { NextRequest, NextResponse } from 'next/server';
import { AppData, User } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Load data
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

    // Check if user already exists
    if (appData.currentUser && appData.currentUser.email === email) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const user: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
      role: 'owner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    appData.currentUser = user;
    appData.lastUpdated = new Date().toISOString();

    // Save data
    const DATA_DIR = path.join(process.cwd(), 'data');
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
