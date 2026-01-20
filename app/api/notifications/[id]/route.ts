import { NextRequest, NextResponse } from 'next/server';
import { loadData, saveData } from '@/lib/storage';

// GET - Get single item by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appData = loadData() as any;
    const items = appData.notifications || [];
    const item = items.find((i: any) => i.id === id);
    
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch item' },
      { status: 500 }
    );
  }
}

// PUT - Update item by id
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const appData = loadData() as any;
    
    if (!appData.notifications) {
      appData.notifications = [];
    }
    
    const index = appData.notifications.findIndex((i: any) => i.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    appData.notifications[index] = {
      ...appData.notifications[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    saveData(appData);

    return NextResponse.json({ success: true, data: appData.notifications[index] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete item by id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appData = loadData() as any;
    
    if (!appData.notifications) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    
    const index = appData.notifications.findIndex((i: any) => i.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    appData.notifications.splice(index, 1);
    saveData(appData);

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete item' },
      { status: 500 }
    );
  }
}
