import { NextRequest, NextResponse } from 'next/server';
import { AppData, Task } from '@/types';

// GET /api/tasks/[id] - Get task by ID
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
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    const appData: AppData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const task = appData.tasks.find(t => t.id === params.id);

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[id] - Update task
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
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    const appData: AppData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const taskIndex = appData.tasks.findIndex(t => t.id === params.id);

    if (taskIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    const oldTask = appData.tasks[taskIndex];
    const userId = 'default-user';

    // Update task
    const updatedTask: Task = {
      ...oldTask,
      ...body,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    };

    // Handle status change
    if (body.status && body.status !== oldTask.status) {
      if (body.status === 'done') {
        updatedTask.completedAt = new Date().toISOString();
      } else if (oldTask.status === 'done' && body.status !== 'done') {
        updatedTask.completedAt = undefined;
      }
    }

    appData.tasks[taskIndex] = updatedTask;
    appData.lastUpdated = new Date().toISOString();

    // Add activity
    appData.activities.push({
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      workspaceId: updatedTask.workspaceId,
      projectId: updatedTask.projectId,
      taskId: updatedTask.id,
      userId,
      type: 'task_updated',
      description: `Updated task "${updatedTask.title}"`,
      metadata: { changes: body },
      createdAt: new Date().toISOString(),
    });

    // Handle assignee changes
    if (body.assigneeIds) {
      const newAssignees = body.assigneeIds.filter((id: string) => !oldTask.assigneeIds.includes(id));
      newAssignees.forEach((assigneeId: string) => {
        if (assigneeId !== userId) {
          appData.notifications.push({
            id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userId: assigneeId,
            type: 'task_assigned',
            title: 'Task Assigned',
            message: `You've been assigned to "${updatedTask.title}"`,
            link: `/tasks/${updatedTask.id}`,
            read: false,
            createdAt: new Date().toISOString(),
          });
        }
      });
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      data: updatedTask,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete task
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
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    const appData: AppData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const taskIndex = appData.tasks.findIndex(t => t.id === params.id);

    if (taskIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    const task = appData.tasks[taskIndex];
    const userId = 'default-user';

    // Delete task and related data
    appData.tasks.splice(taskIndex, 1);
    appData.comments = appData.comments.filter(c => c.taskId !== params.id);
    appData.attachments = appData.attachments.filter(a => a.taskId === params.id);
    appData.timeEntries = appData.timeEntries.filter(te => te.taskId !== params.id);

    // Add activity
    appData.activities.push({
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      workspaceId: task.workspaceId,
      projectId: task.projectId,
      userId,
      type: 'task_deleted',
      description: `Deleted task "${task.title}"`,
      createdAt: new Date().toISOString(),
    });

    appData.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete task' },
      { status: 500 }
    );
  }
}
