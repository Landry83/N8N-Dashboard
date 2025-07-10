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

// Create singleton instance
export const createDeepSeekClient = (): DeepSeekClient => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseURL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY environment variable is required');
  }

  return new DeepSeekClient({
    apiKey,
    baseURL,
  });
};
