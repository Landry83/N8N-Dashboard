import { NextResponse } from 'next/server';
import { MCPClient } from '@/lib/mcp-client';

export async function GET() {
  try {
    const mcpClient = new MCPClient();
    
    // Test N8N connection
    const n8nConnected = await mcpClient.testConnection();
    
    // Get system health data
    const systemHealth = await mcpClient.getSystemHealth();
    
    return NextResponse.json({
      success: true,
      health: {
        status: n8nConnected ? 'healthy' : 'unhealthy',
        ...systemHealth,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error checking system health:', error);
    return NextResponse.json(
      {
        success: false,
        health: {
          status: 'error',
          n8nConnected: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
} 