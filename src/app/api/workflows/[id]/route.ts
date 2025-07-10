import { NextRequest, NextResponse } from 'next/server';
import { MCPClient } from '@/lib/mcp-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mcpClient = new MCPClient();
    
    // Get workflow details
    const workflow = await mcpClient.getWorkflow(id);
    
    return NextResponse.json({
      success: true,
      data: workflow,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error fetching workflow ${(await params).id}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action, data } = await request.json();
    const mcpClient = new MCPClient();
    
    let result;
    
    switch (action) {
      case 'execute':
        result = await mcpClient.executeWorkflow(id, data);
        break;
      case 'activate':
        result = await mcpClient.activateWorkflow(id);
        break;
      case 'deactivate':
        result = await mcpClient.deactivateWorkflow(id);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    return NextResponse.json({
      success: true,
      action,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error performing action on workflow ${(await params).id}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 