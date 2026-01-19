import { NextRequest, NextResponse } from 'next/server';
import { AppData, Workspace } from '@/types';

// GET /api/workspaces/[id] - Get workspace by ID
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
        { success: false, error: 'Workspace not found' },
        { status: 404 }
      );
    }

    const appData: AppData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const workspace = appData.workspaces.find(w => w.id === params.id);

    if (!workspace) {
      return NextResponse.json(
        { success: false, error: 'Workspace not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: workspace,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch workspace' },
      { status: 500 }
    );
  }
}

// PUT /api/workspaces/[id] - Update workspace
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
        { success: false, error: 'Workspace not found' },
        { status: 404 }
      );
    }

    const appData: AppData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const workspaceIndex = appData.workspaces.findIndex(w => w.id === params.id);

    if (workspaceIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Workspace not found' },
        { status: 404 }
      );
    }

    // Update workspace
    appData.workspaces[workspaceIndex] = {
      ...appData.workspaces[workspaceIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    appData.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      data: appData.workspaces[workspaceIndex],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update workspace' },
      { status: 500 }
    );
  }
}

// DELETE /api/workspaces/[id] - Delete workspace
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
        { success: false, error: 'Workspace not found' },
        { status: 404 }
      );
    }

    const appData: AppData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const workspaceIndex = appData.workspaces.findIndex(w => w.id === params.id);

    if (workspaceIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Workspace not found' },
        { status: 404 }
      );
    }

    // Delete workspace and related data
    appData.workspaces.splice(workspaceIndex, 1);
    appData.projects = appData.projects.filter(p => p.workspaceId !== params.id);
    appData.tasks = appData.tasks.filter(t => t.workspaceId !== params.id);
    appData.lastUpdated = new Date().toISOString();

    fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Workspace deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete workspace' },
      { status: 500 }
    );
  }
}
