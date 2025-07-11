import { NextResponse } from 'next/server';
import { MCPClient } from '@/lib/mcp-client';

export async function GET() {
  try {
    const mcpClient = new MCPClient();
    
    // Test the connection
    const connectionTest = await mcpClient.testConnection();
    
    // Try to get template statistics, but don't fail if it doesn't work
    let templateStats = null;
    try {
      templateStats = await mcpClient.getTemplateStats();
    } catch (templateError) {
      console.warn('Template stats not available:', templateError);
      templateStats = { error: 'Template database not available' };
    }
    
    return NextResponse.json({
      success: true,
      connection: connectionTest,
      templateStats: templateStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MCP Test Error:', error);
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