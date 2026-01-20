import { NextRequest, NextResponse } from 'next/server';
import { loadData, saveData } from '@/lib/storage';

// POST - Clock in for today
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, date, clockIn } = body;
    
    if (!date || !clockIn) {
      return NextResponse.json(
        { success: false, error: 'Date and clockIn time are required' },
        { status: 400 }
      );
    }

    // Get user name from userId
    const userName = userId === 'user-ali' ? 'Ali' : userId === 'user-ahad' ? 'Ahad' : 'User';
    const actualUserId = userId || 'default-user';
    
    const appData = loadData() as any;
    
    if (!appData.attendances) {
      appData.attendances = [];
    }

    // Check if already clocked in today for THIS USER (not clocked out yet)
    const existingRecord = appData.attendances.find(
      (a: any) => a.date === date && a.userId === actualUserId && a.clockIn && !a.clockOut
    );

    if (existingRecord) {
      return NextResponse.json(
        { success: false, error: `${userName} already clocked in. Please clock out first.` },
        { status: 400 }
      );
    }

    // Allow multiple clock-in/out sessions per day - no restriction on completed records

    // Create new attendance record
    const newRecord = {
      id: `attendance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: actualUserId,
      userName,
      date,
      clockIn,
      clockOut: null,
      status: 'present',
      workHours: 0,
      breakMinutes: 0,
      notes: '',
      approved: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    appData.attendances.push(newRecord);
    saveData(appData);

    return NextResponse.json({ success: true, data: newRecord }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to clock in' },
      { status: 500 }
    );
  }
}
