import { NextRequest, NextResponse } from 'next/server';
import { AppData, Comment } from '@/types';

// GET /api/comments - List comments (filtered by taskId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    const fs = require('fs');
    const path = require('path');
    const DATA_FILE = path.join(process.cwd(), 'data', 'app.json');
    
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const appData: AppData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    
    let comments = appData.comments;
    if (taskId) {
      comments = comments.filter(c => c.taskId === taskId);
    }

    // Sort by creation date (newest first)
    comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      data: comments,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/comments - Create new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, content, mentions } = body;

    if (!taskId || !content) {
      return NextResponse.json(
        { success: false, error: 'Task ID and content are required' },
        { status: 400 }
      );
    }

    const fs = require('fs');
    const path = require('path');
    const DATA_FILE = path.join(process.cwd(), 'data', 'app.json');
    
    let appData: AppData = {
      workspaces: [],
      projects: [],
      tasks: [],
      comments: [],
      attachments: [],
      timeEntries: [],
      activities: [],
      notifications: [],
      views: [],
      stats: {},
      lastUpdated: new Date().toISOString(),
    };

    if (fs.existsSync(DATA_FILE)) {
      appData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }

    // Verify task exists
    const task = appData.tasks.find(t => t.id === taskId);
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
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

    // Create comment
    const comment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      taskId,
      userId,
      content,
      mentions: mentions || [],
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    appData.comments.push(comment);
    appData.lastUpdated = new Date().toISOString();

    // Add activity
    appData.activities.push({
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      workspaceId: task.workspaceId,
      projectId: task.projectId,
      taskId,
      userId,
      type: 'comment_added',
      description: `Added a comment on "${task.title}"`,
      createdAt: new Date().toISOString(),
    });

    // Create notifications for mentions
    if (mentions && mentions.length > 0) {
      mentions.forEach((mentionedUserId: string) => {
        if (mentionedUserId !== userId) {
          appData.notifications.push({
            id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userId: mentionedUserId,
            type: 'task_mentioned',
            title: 'You were mentioned',
            message: `You were mentioned in a comment on "${task.title}"`,
            link: `/tasks/${taskId}`,
            read: false,
            createdAt: new Date().toISOString(),
          });
        }
      });
    }

    // Notify task assignees (except commenter)
    task.assigneeIds.forEach((assigneeId: string) => {
      if (assigneeId !== userId && !mentions?.includes(assigneeId)) {
        appData.notifications.push({
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId: assigneeId,
          type: 'comment_added',
          title: 'New Comment',
          message: `New comment on "${task.title}"`,
          link: `/tasks/${taskId}`,
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
    });

    // Save data
    const DATA_DIR = path.join(process.cwd(), 'data');
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      data: comment,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create comment' },
      { status: 500 }
    );
  }
}
