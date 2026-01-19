import { NextRequest, NextResponse } from 'next/server';
import { AppData, Task, TaskFilter } from '@/types';
import { loadData, saveData } from '@/lib/storage';

// GET /api/tasks - List tasks (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const workspaceId = searchParams.get('workspaceId');
    const status = searchParams.get('status');
    const assigneeId = searchParams.get('assigneeId');

    const appData = loadData();
    
    let tasks = appData.tasks;

    // Apply filters
    if (projectId) {
      tasks = tasks.filter(t => t.projectId === projectId);
    }
    if (workspaceId) {
      tasks = tasks.filter(t => t.workspaceId === workspaceId);
    }
    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }
    if (assigneeId) {
      tasks = tasks.filter(t => t.assigneeIds.includes(assigneeId));
    }

    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, workspaceId, title, description, status, priority, assigneeIds, dueDate, tags } = body;

    if (!projectId || !workspaceId || !title) {
      return NextResponse.json(
        { success: false, error: 'Project ID, workspace ID, and title are required' },
        { status: 400 }
      );
    }

    let appData = loadData();

    // Verify project exists
    const project = appData.projects.find(p => p.id === projectId);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Use default user (no authentication required)
    const userId = 'default-user';

    // Get max position for ordering
    const projectTasks = appData.tasks.filter(t => t.projectId === projectId);
    const maxPosition = projectTasks.length > 0 
      ? Math.max(...projectTasks.map(t => t.position))
      : -1;

    // Create task
    const task: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      projectId,
      workspaceId,
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      assigneeIds: assigneeIds || [],
      reporterId: userId,
      dueDate,
      tags: tags || [],
      dependencies: [],
      subtasks: [],
      position: maxPosition + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId,
      updatedBy: userId,
    };

    appData.tasks.push(task);
    appData.lastUpdated = new Date().toISOString();

    // Add activity
    appData.activities.push({
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      workspaceId,
      projectId,
      taskId: task.id,
      userId,
      type: 'task_created',
      description: `Created task "${title}"`,
      createdAt: new Date().toISOString(),
    });

    // Create notifications for assignees
    if (assigneeIds && assigneeIds.length > 0) {
      assigneeIds.forEach((assigneeId: string) => {
        if (assigneeId !== userId) {
          appData.notifications.push({
            id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userId: assigneeId,
            type: 'task_assigned',
            title: 'Task Assigned',
            message: `You've been assigned to "${title}"`,
            link: `/tasks/${task.id}`,
            read: false,
            createdAt: new Date().toISOString(),
          });
        }
      });
    }

    saveData(appData);

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create task' },
      { status: 500 }
    );
  }
}
