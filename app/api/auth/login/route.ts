import { NextRequest, NextResponse } from 'next/server';
import { AppData, User, Session } from '@/types';

// In production, use proper authentication (JWT, OAuth, etc.)
// This is a simplified version for demo purposes

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Load data to check user
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

    // Find or create user (simplified - in production, use proper password hashing)
    let user = appData.currentUser;
    
    if (!user || user.email !== email) {
      // Create new user for demo
      user = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        role: 'owner',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      
      appData.currentUser = user;
      appData.lastUpdated = new Date().toISOString();
      
      // Save updated data
      const DATA_DIR = path.join(process.cwd(), 'data');
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2), 'utf-8');
    } else {
      // Update last login
      user.lastLoginAt = new Date().toISOString();
      appData.currentUser = user;
      appData.lastUpdated = new Date().toISOString();
      
      fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2), 'utf-8');
    }

    // Create session (in production, use secure cookies/JWT)
    const session: Session = {
      userId: user.id,
      email: user.email,
      name: user.name,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    const response = NextResponse.json({
      success: true,
      data: {
        user,
        session,
      },
    });

    // Set session cookie (in production, use httpOnly, secure, sameSite)
    response.cookies.set('session', JSON.stringify(session), {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
