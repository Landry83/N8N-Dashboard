import { NextRequest, NextResponse } from 'next/server';
import { MCPClient } from '@/lib/mcp-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    
    const mcpClient = new MCPClient();
    
    // Get workflows from N8N
    const workflows = await mcpClient.listWorkflows(
      active === 'true' ? true : active === 'false' ? false : undefined
    );
    
    return NextResponse.json({
      success: true,
      data: workflows,
      count: workflows.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching workflows:', error);
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