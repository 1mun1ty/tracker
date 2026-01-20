import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const isVercel = process.env.VERCEL === '1';
const DATA_FILE = isVercel ? '/tmp/online-status.json' : path.join(process.cwd(), 'data', 'online-status.json');

interface OnlineStatus {
  [userId: string]: {
    lastSeen: string;
    isOnline: boolean;
  };
}

function loadStatus(): OnlineStatus {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading online status:', error);
  }
  return {};
}

function saveStatus(data: OnlineStatus): void {
  try {
    if (!isVercel) {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving online status:', error);
  }
}

// Check if user is online (active within last 30 seconds)
function isUserOnline(lastSeen: string): boolean {
  const lastSeenTime = new Date(lastSeen).getTime();
  const now = Date.now();
  const thirtySeconds = 30 * 1000;
  return (now - lastSeenTime) < thirtySeconds;
}

// GET - Get all users' online status
export async function GET() {
  try {
    const status = loadStatus();
    
    // Update online status based on last seen time
    const result: OnlineStatus = {};
    for (const userId in status) {
      result[userId] = {
        lastSeen: status[userId].lastSeen,
        isOnline: isUserOnline(status[userId].lastSeen),
      };
    }
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting online status:', error);
    return NextResponse.json({ success: false, error: 'Failed to get status' }, { status: 500 });
  }
}

// POST - Update user's online status (heartbeat)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 });
    }

    const status = loadStatus();
    
    status[userId] = {
      lastSeen: new Date().toISOString(),
      isOnline: true,
    };

    saveStatus(status);

    // Return all users' status
    const result: OnlineStatus = {};
    for (const uid in status) {
      result[uid] = {
        lastSeen: status[uid].lastSeen,
        isOnline: isUserOnline(status[uid].lastSeen),
      };
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating online status:', error);
    return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 });
  }
}
