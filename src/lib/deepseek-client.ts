import OpenAI from 'openai';

export interface DeepSeekConfig {
  apiKey: string;
  baseURL: string;
  timeout?: number;
}

export class DeepSeekClient {
  private client: OpenAI;

  constructor(config: DeepSeekConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
    });
  }

  async chatCompletion(messages: Array<{ role: string; content: string }>) {
    try {
      const response = await this.client.chat.completions.create({
        model: 'deepseek-chat',
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 2000,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error;
    }
  }

  async translateToWorkflowCommand(userInput: string): Promise<string> {
    const systemPrompt = `You are a workflow automation expert that translates natural language requests into N8N workflow commands.

Available N8N workflow operations:
- list_workflows: List all available workflows
- create_workflow: Create a new workflow from description
- execute_workflow: Execute an existing workflow
- search_templates: Search workflow templates
- deploy_template: Deploy a template to N8N
- get_workflow_status: Get execution status

Parse the user's request and return the appropriate command with parameters.
Format: {"command": "operation_name", "parameters": {...}}

User request: "${userInput}"`;

    const response = await this.chatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput }
    ]);

    return response;
  }

  async generateJarvisResponse(context: string, userMessage: string): Promise<string> {
    const systemPrompt = `You are an intelligent N8N workflow assistant, similar to Jarvis. You help users create, manage, and execute workflows through natural conversation.

Your personality:
- Professional but friendly
- Knowledgeable about automation
- Proactive in suggesting improvements
- Clear in explanations
- Helpful in troubleshooting

Always respond in character as a workflow automation expert.

Context: ${context}`;

    const response = await this.chatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ]);

    return response;
  }
}

// Mock DeepSeek client for demo mode
class MockDeepSeekClient {
  async chatCompletion(messages: Array<{ role: string; content: string }>) {
    console.log('Using mock DeepSeek client - set DEEPSEEK_API_KEY for real AI responses');
    return 'I understand your request, but I\'m running in demo mode. To enable full AI capabilities, please set the DEEPSEEK_API_KEY environment variable.';
  }

  async translateToWorkflowCommand(userInput: string): Promise<string> {
    // Simple rule-based command parsing for demo mode
    const input = userInput.toLowerCase();
    
    if (input.includes('list') && input.includes('workflow')) {
      return JSON.stringify({ command: 'list_workflows', parameters: {} });
    } else if (input.includes('search') && input.includes('template')) {
      return JSON.stringify({ 
        command: 'search_templates', 
        parameters: { query: 'AI', category: 'AI/ML' }
      });
    } else if (input.includes('execute') || input.includes('run')) {
      return JSON.stringify({ 
        command: 'execute_workflow', 
        parameters: { workflowId: 'demo_workflow' }
      });
    } else if (input.includes('health') || input.includes('status')) {
      return JSON.stringify({ command: 'test_connection', parameters: {} });
    } else {
      return JSON.stringify({ command: 'help', parameters: {} });
    }
  }

  async generateJarvisResponse(context: string, userMessage: string): Promise<string> {
    const input = userMessage.toLowerCase();
    
    if (input.includes('workflow')) {
      return "I've processed your workflow request. In demo mode, I can help you navigate the interface and test basic functionality. For full AI-powered responses, please configure the DEEPSEEK_API_KEY.";
    } else if (input.includes('template')) {
      return "I found some workflow templates for you! You can browse through our collection and deploy them to your n8n instance. Full AI search requires the DEEPSEEK_API_KEY to be configured.";
    } else if (input.includes('help')) {
      return "I'm your workflow assistant! I can help you manage workflows, search templates, and execute automation tasks. Currently running in demo mode - set DEEPSEEK_API_KEY for enhanced AI capabilities.";
    } else {
      return "I understand your request and I'm here to help with your workflow automation needs. I'm currently running in demo mode with limited AI capabilities.";
    }
  }
}

// Create singleton instance
export const createDeepSeekClient = (): DeepSeekClient | MockDeepSeekClient => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseURL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';

  if (!apiKey) {
    console.warn('DEEPSEEK_API_KEY not found - using demo mode with limited AI capabilities');
    return new MockDeepSeekClient();
  }

  return new DeepSeekClient({
    apiKey,
    baseURL,
  });
};
