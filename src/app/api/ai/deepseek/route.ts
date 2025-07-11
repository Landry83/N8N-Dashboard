import { NextRequest, NextResponse } from 'next/server';
import { createDeepSeekClient } from '@/lib/deepseek-client';

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();
    
    const deepseekClient = createDeepSeekClient();
    
    let result;
    
    switch (action) {
      case 'translateToWorkflowCommand':
        result = await deepseekClient.translateToWorkflowCommand(data.userInput);
        break;
        
      case 'generateJarvisResponse':
        result = await deepseekClient.generateJarvisResponse(data.context, data.userMessage);
        break;
        
      case 'chatCompletion':
        result = await deepseekClient.chatCompletion(data.messages);
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({ result });
    
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 