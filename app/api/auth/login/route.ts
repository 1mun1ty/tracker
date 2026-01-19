import { NextRequest, NextResponse } from 'next/server';
import { AppData, User, Session } from '@/types';
import { loadData, saveData } from '@/lib/storage';

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

    // Load data using storage utility
    let appData = loadData();

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
      saveData(appData);
    } else {
      // Update last login
      user.lastLoginAt = new Date().toISOString();
      appData.currentUser = user;
      saveData(appData);
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
