import { NextRequest, NextResponse } from 'next/server';
import { loadData, saveData } from '@/lib/storage';

// POST - Clock out for today
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, date, clockOut } = body;
    
    if (!date || !clockOut) {
      return NextResponse.json(
        { success: false, error: 'Date and clockOut time are required' },
        { status: 400 }
      );
    }

    const actualUserId = userId || 'default-user';
    const userName = userId === 'user-ali' ? 'Ali' : userId === 'user-ahad' ? 'Ahad' : 'User';
    
    const appData = loadData() as any;
    
    if (!appData.attendances) {
      appData.attendances = [];
    }

    // Find today's attendance record for THIS USER that has clock in but no clock out
    const recordIndex = appData.attendances.findIndex(
      (a: any) => a.date === date && a.userId === actualUserId && a.clockIn && !a.clockOut
    );

    if (recordIndex === -1) {
      return NextResponse.json(
        { success: false, error: `No active clock-in found for ${userName}. Please clock in first.` },
        { status: 400 }
      );
    }

    // Calculate work hours
    const record = appData.attendances[recordIndex];
    const clockInTime = new Date(record.clockIn);
    const clockOutTime = new Date(clockOut);
    const workMilliseconds = clockOutTime.getTime() - clockInTime.getTime();
    const workHours = workMilliseconds / (1000 * 60 * 60);

    // Determine status based on hours worked
    let status = 'present';
    if (workHours < 4) {
      status = 'early-departure';
    } else if (workHours < 8) {
      status = 'half-day';
    }

    // Update the record with clock out time
    appData.attendances[recordIndex] = {
      ...record,
      clockOut,
      workHours: Math.round(workHours * 100) / 100, // Round to 2 decimal places
      status,
      updatedAt: new Date().toISOString(),
    };

    saveData(appData);

    return NextResponse.json({ success: true, data: appData.attendances[recordIndex] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to clock out' },
      { status: 500 }
    );
  }
}
