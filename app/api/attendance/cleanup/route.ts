import { NextRequest, NextResponse } from 'next/server';
import { loadData, saveData } from '@/lib/storage';

// POST - Clean up invalid attendance records
export async function POST(request: NextRequest) {
  try {
    const appData = loadData() as any;
    
    if (!appData.attendances) {
      return NextResponse.json({ success: true, message: 'No attendances to clean', removed: 0 });
    }

    const originalCount = appData.attendances.length;
    
    // Filter out invalid records:
    // 1. Records without clockIn
    // 2. Duplicate records (same user, same date, same clockIn time)
    const seen = new Set<string>();
    const validRecords = appData.attendances.filter((record: any) => {
      // Must have clockIn
      if (!record.clockIn) return false;
      
      // Create unique key for deduplication
      const key = `${record.userId}-${record.date}-${record.clockIn}`;
      if (seen.has(key)) return false;
      seen.add(key);
      
      return true;
    });

    appData.attendances = validRecords;
    saveData(appData);

    const removedCount = originalCount - validRecords.length;

    return NextResponse.json({ 
      success: true, 
      message: `Cleaned up ${removedCount} invalid records`,
      removed: removedCount,
      remaining: validRecords.length
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to cleanup' },
      { status: 500 }
    );
  }
}
