import { NextRequest, NextResponse } from 'next/server';
import { AppData, Workspace } from '@/types';
import { loadData, saveData } from '@/lib/storage';

// GET /api/workspaces - List all workspaces
export async function GET(request: NextRequest) {
  try {
    const appData = loadData();
    
    return NextResponse.json({
      success: true,
      data: appData.workspaces || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch workspaces' },
      { status: 500 }
    );
  }
}

// POST /api/workspaces - Create new workspace
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Workspace name is required' },
        { status: 400 }
      );
    }

    let appData = loadData();

    // Get current user from session
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);
    const userId = session.userId;

    // Create workspace
    const workspace: Workspace = {
      id: `workspace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      status: 'active',
      ownerId: userId,
      members: [{
        userId,
        role: 'owner',
        joinedAt: new Date().toISOString(),
      }],
      settings: {
        allowPublicProjects: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    appData.workspaces.push(workspace);
    saveData(appData);

    return NextResponse.json({
      success: true,
      data: workspace,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create workspace' },
      { status: 500 }
    );
  }
}
