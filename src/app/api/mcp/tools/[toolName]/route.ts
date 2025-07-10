import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { toolName: string } }
) {
  try {
    const { toolName } = params;
    const body = await request.json();

    // Forward the request to the MCP server
    const mcpResponse = await fetch('http://localhost:3001/api/tools/call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: toolName,
        arguments: body,
      }),
    });

    if (!mcpResponse.ok) {
      throw new Error(`MCP server responded with status: ${mcpResponse.status}`);
    }

    const data = await mcpResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calling MCP tool:', error);
    return NextResponse.json(
      {
        content: [{ 
          type: 'text', 
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }],
        isError: true
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { toolName: string } }
) {
  try {
    const { toolName } = params;
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // Forward the request to the MCP server
    const mcpResponse = await fetch('http://localhost:3001/api/tools/call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: toolName,
        arguments: queryParams,
      }),
    });

    if (!mcpResponse.ok) {
      throw new Error(`MCP server responded with status: ${mcpResponse.status}`);
    }

    const data = await mcpResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calling MCP tool:', error);
    return NextResponse.json(
      {
        content: [{ 
          type: 'text', 
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }],
        isError: true
      },
      { status: 500 }
    );
  }
} 