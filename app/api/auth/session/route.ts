import { NextRequest, NextResponse } from 'next/server';
import { Session } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'No session found' },
        { status: 401 }
      );
    }

    const session: Session = JSON.parse(sessionCookie.value);

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Session expired' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { session },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Invalid session' },
      { status: 401 }
    );
  }
}
