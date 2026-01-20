import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const isVercel = process.env.VERCEL === '1';
const DATA_FILE = isVercel ? '/tmp/chat.json' : path.join(process.cwd(), 'data', 'chat.json');

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

interface ChatData {
  messages: Message[];
}

function loadChatData(): ChatData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
    // On Vercel, also check original data file for initial data
    if (isVercel) {
      const originalFile = path.join(process.cwd(), 'data', 'chat.json');
      if (fs.existsSync(originalFile)) {
        const data = fs.readFileSync(originalFile, 'utf-8');
        return JSON.parse(data);
      }
    }
  } catch (error) {
    console.error('Error loading chat data:', error);
  }
  return { messages: [] };
}

function saveChatData(data: ChatData): void {
  try {
    if (!isVercel) {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving chat data:', error);
  }
}

// GET - Get all messages
export async function GET() {
  try {
    const data = loadChatData();
    // Return last 100 messages
    const messages = data.messages.slice(-100);
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error getting messages:', error);
    return NextResponse.json({ success: false, error: 'Failed to get messages' }, { status: 500 });
  }
}

// POST - Send a new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId, senderName, content } = body;

    if (!senderId || !senderName || !content) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const data = loadChatData();

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      senderId,
      senderName,
      content,
      timestamp: new Date().toISOString(),
    };

    data.messages.push(newMessage);

    // Keep only last 500 messages
    if (data.messages.length > 500) {
      data.messages = data.messages.slice(-500);
    }

    saveChatData(data);

    return NextResponse.json({ success: true, data: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}

// DELETE - Clear all messages
export async function DELETE() {
  try {
    saveChatData({ messages: [] });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing messages:', error);
    return NextResponse.json({ success: false, error: 'Failed to clear messages' }, { status: 500 });
  }
}
