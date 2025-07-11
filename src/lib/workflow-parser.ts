import { createDeepSeekClient, DeepSeekClient } from './deepseek-client';
import { MCPClient } from './mcp-client';

interface WorkflowResult {
  success: boolean;
  message: string;
  data?: any;
}
export interface ParsedCommand {
  intent: string;
  action: string;
  parameters: Record<string, any>;
  confidence: number;
}

export interface WorkflowExecutionStep {
  step: number;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  timestamp: Date;
}

export class WorkflowParser {
  private deepseekClient: DeepSeekClient;
  private mcpClient: MCPClient;

  constructor() {
    this.deepseekClient = createDeepSeekClient();
    this.mcpClient = new MCPClient();
  }

  async initialize(): Promise<void> {
    try {
      // MCPClient does not require connection
      console.log('Workflow parser initialized successfully');
    } catch (error) {
      console.error('Failed to initialize workflow parser:', error);
      throw error;
    }
  }

  async parseVoiceCommand(userInput: string): Promise<ParsedCommand> {
    try {
      const commandJson = await this.deepseekClient.translateToWorkflowCommand(userInput);
      const command = JSON.parse(commandJson);
      
      return {
        intent: this.extractIntent(userInput),
        action: command.command,
        parameters: command.parameters || {},
        confidence: this.calculateConfidence(userInput, command)
      };
    } catch (error) {
      console.error('Error parsing voice command:', error);
      return {
        intent: 'unknown',
        action: 'help',
        parameters: {},
        confidence: 0
      };
    }
  }

  async executeWorkflowCommand(parsedCommand: ParsedCommand): Promise<WorkflowResult> {
    try {
      const { action, parameters } = parsedCommand;
      
      switch (action) {
        case 'list_workflows':
          const workflows = await this.mcpClient.listWorkflows(); return { success: true, message: "Workflows retrieved", data: workflows };
        
        case 'search_templates':
          const templates = await this.mcpClient.searchTemplates(
            parameters.query || '', 
            parameters.category
          );
        
        case 'execute_workflow':
          return await this.mcpClient.executeWorkflow(parameters.workflowId);
        
        case 'deploy_template':
          return await this.mcpClient.deployTemplate(
            parameters.templateId, 
            parameters.name
          );
        
        default:
          return {
            success: false,
            message: `Unknown command: ${action}`
          };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async processVoiceInput(userInput: string): Promise<{
    response: string;
    data?: any;
    executionSteps?: WorkflowExecutionStep[];
  }> {
    try {
      // Step 1: Parse the voice command
      const parsedCommand = await this.parseVoiceCommand(userInput);
      
      // Step 2: Execute the workflow command
      const result = await this.executeWorkflowCommand(parsedCommand);
      
      // Step 3: Generate a conversational response
      const response = await this.generateConversationalResponse(
        userInput, 
        parsedCommand, 
        result
      );
      
      return {
        response,
        data: result.data,
        executionSteps: this.generateExecutionSteps(parsedCommand, result)
      };
    } catch (error) {
      return {
        response: `I'm sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: null
      };
    }
  }

  private async generateConversationalResponse(
    userInput: string, 
    parsedCommand: ParsedCommand, 
    result: WorkflowResult
  ): Promise<string> {
    const context = `
User asked: "${userInput}"
Parsed command: ${parsedCommand.action}
Command parameters: ${JSON.stringify(parsedCommand.parameters)}
Execution result: ${result.success ? 'Success' : 'Failed'}
Result data: ${JSON.stringify(result.data)}
`;

    if (result.success) {
      return await this.deepseekClient.generateJarvisResponse(context, userInput);
    } else {
      return `I encountered an issue: ${result.message}. Let me know how I can help resolve this.`;
    }
  }

  private extractIntent(userInput: string): string {
    const input = userInput.toLowerCase();
    
    if (input.includes('create') || input.includes('build') || input.includes('make')) {
      return 'create';
    } else if (input.includes('run') || input.includes('execute') || input.includes('start')) {
      return 'execute';
    } else if (input.includes('search') || input.includes('find') || input.includes('look')) {
      return 'search';
    } else if (input.includes('list') || input.includes('show') || input.includes('display')) {
      return 'list';
    } else {
      return 'help';
    }
  }

  private calculateConfidence(userInput: string, command: any): number {
    const hasAction = command.command && command.command !== 'help';
    const hasParameters = command.parameters && Object.keys(command.parameters).length > 0;
    
    let confidence = 0.5;
    if (hasAction) confidence += 0.3;
    if (hasParameters) confidence += 0.2;
    
    return Math.min(confidence, 1.0);
  }

  private generateExecutionSteps(
    parsedCommand: ParsedCommand, 
    result: WorkflowResult
  ): WorkflowExecutionStep[] {
    const steps: WorkflowExecutionStep[] = [];
    
    steps.push({
      step: 1,
      description: `Parsed command: ${parsedCommand.action}`,
      status: 'completed',
      result: parsedCommand,
      timestamp: new Date()
    });
    
    steps.push({
      step: 2,
      description: `Executing ${parsedCommand.action}`,
      status: result.success ? 'completed' : 'failed',
      result: result.data,
      error: result.message,
      timestamp: new Date()
    });
    
    return steps;
  }

  async disconnect(): Promise<void> {
    // MCPClient does not have a disconnect method
    console.log("Workflow parser disconnected");
  }
}

export const createWorkflowParser = (): WorkflowParser => {
  return new WorkflowParser();
};
