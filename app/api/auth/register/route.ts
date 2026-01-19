import { NextRequest, NextResponse } from 'next/server';
import { AppData, User } from '@/types';
import { loadData, saveData } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Load data using storage utility
    let appData = loadData();

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
    saveData(appData);

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
