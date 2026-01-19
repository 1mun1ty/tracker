import { NextRequest, NextResponse } from 'next/server';
import { AppData, Project } from '@/types';
import { loadData, saveData } from '@/lib/storage';

// GET /api/projects - List all projects
export async function GET(request: NextRequest) {
  try {
    const appData = loadData();
    const projects = appData.projects;

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
    const { name, description, color, icon } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Project name is required' },
        { status: 400 }
      );
    }

    let appData = loadData();

    // Use default user (no authentication required)
    const userId = 'default-user';

    // Create project
    const project: Project = {
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      workspaceId: 'default-workspace',
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
