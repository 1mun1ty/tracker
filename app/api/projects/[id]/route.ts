import { NextRequest, NextResponse } from 'next/server';
import { AppData, Project } from '@/types';

// GET /api/projects/[id] - Get project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fs = require('fs');
    const path = require('path');
    const DATA_FILE = path.join(process.cwd(), 'data', 'app.json');
    
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const appData: AppData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const project = appData.projects.find(p => p.id === params.id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const fs = require('fs');
    const path = require('path');
    const DATA_FILE = path.join(process.cwd(), 'data', 'app.json');
    
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const appData: AppData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const projectIndex = appData.projects.findIndex(p => p.id === params.id);

    if (projectIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Update project
    appData.projects[projectIndex] = {
      ...appData.projects[projectIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    appData.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      data: appData.projects[projectIndex],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fs = require('fs');
    const path = require('path');
    const DATA_FILE = path.join(process.cwd(), 'data', 'app.json');
    
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const appData: AppData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const projectIndex = appData.projects.findIndex(p => p.id === params.id);

    if (projectIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete project and related data
    appData.projects.splice(projectIndex, 1);
    appData.tasks = appData.tasks.filter(t => t.projectId !== params.id);
    appData.comments = appData.comments.filter(c => {
      const task = appData.tasks.find(t => t.id === c.taskId);
      return task && task.projectId === params.id;
    });
    appData.lastUpdated = new Date().toISOString();

    fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}
