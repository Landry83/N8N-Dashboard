import { NextRequest, NextResponse } from 'next/server';
import { MCPClient } from '@/lib/mcp-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get('workflowId');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const mcpClient = new MCPClient();
    
    // Get executions
    const executions = workflowId 
      ? await mcpClient.getExecutions(workflowId, limit)
      : await mcpClient.getExecutions(undefined, limit);
    
    return NextResponse.json({
      success: true,
      data: executions,
      count: executions.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching executions:', error);
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