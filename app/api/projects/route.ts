import { NextRequest, NextResponse } from 'next/server';
import { AppData, Project } from '@/types';
import { loadData, saveData } from '@/lib/storage';

// GET /api/projects - List projects (optionally filtered by workspaceId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');

    const appData = loadData();
    
    let projects = appData.projects;
    if (workspaceId) {
      projects = projects.filter(p => p.workspaceId === workspaceId);
    }

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workspaceId, name, description, color, icon } = body;

    if (!workspaceId || !name) {
      return NextResponse.json(
        { success: false, error: 'Workspace ID and project name are required' },
        { status: 400 }
      );
    }

    let appData = loadData();

    // Verify workspace exists
    const workspace = appData.workspaces.find(w => w.id === workspaceId);
    if (!workspace) {
      return NextResponse.json(
        { success: false, error: 'Workspace not found' },
        { status: 404 }
      );
    }

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

    // Create project
    const project: Project = {
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      workspaceId,
      name,
      description,
      color: color || '#3B82F6',
      icon,
      status: 'active',
      ownerId: userId,
      members: [{
        userId,
        role: 'owner',
        joinedAt: new Date().toISOString(),
      }],
      settings: {
        defaultView: 'list',
        allowPublicAccess: false,
        enableTimeTracking: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    appData.projects.push(project);
    saveData(appData);

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}
