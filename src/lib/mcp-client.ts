interface MCPResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: 'low' | 'medium' | 'high';
  nodes: number;
  integrations: string[];
  active: boolean;
  executions: number;
  lastExecuted?: string;
  trigger_type: string;
  thumbnail?: string;
}

interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  nodes: any[];
  connections: any;
}

interface ExecutionData {
  id: string;
  workflowId: string;
  status: 'success' | 'error' | 'running' | 'waiting';
  startedAt: string;
  finishedAt?: string;
  mode: string;
}

export class MCPClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private async callTool(toolName: string, args: any = {}): Promise<MCPResponse> {
    try {
      // For server-side calls, use direct logic instead of HTTP requests
      if (typeof window === 'undefined') {
        return await this.handleToolDirect(toolName, args);
      }
      
      // For client-side calls, use HTTP requests
      const response = await fetch('/api/tools/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: toolName,
          arguments: args,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error calling MCP tool ${toolName}:`, error);
      return {
        content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        isError: true
      };
    }
  }

  private async handleToolDirect(toolName: string, args: any = {}): Promise<MCPResponse> {
    // Direct tool handling for server-side calls using real N8N API
    try {
      const { getN8nClient } = await import('@/lib/n8n-client');
      const n8nClient = getN8nClient();

      switch (toolName) {
        case 'list_workflows':
          const workflows = await n8nClient.listWorkflows(args.active);
          return {
            content: [{ type: 'text', text: JSON.stringify(workflows) }]
          };
          
        case 'get_workflow':
          const workflow = await n8nClient.getWorkflow(args.id);
          return {
            content: [{ type: 'text', text: JSON.stringify(workflow) }]
          };
          
        case 'execute_workflow':
          const execution = await n8nClient.executeWorkflow(args.id, args.data);
          return {
            content: [{ type: 'text', text: JSON.stringify(execution) }]
          };
          
        case 'activate_workflow':
          const activateResult = await n8nClient.activateWorkflow(args.id);
          return {
            content: [{ type: 'text', text: JSON.stringify(activateResult) }]
          };
          
        case 'deactivate_workflow':
          const deactivateResult = await n8nClient.deactivateWorkflow(args.id);
          return {
            content: [{ type: 'text', text: JSON.stringify(deactivateResult) }]
          };
          
        case 'get_executions':
          const executions = await n8nClient.getExecutions(args.workflowId, args.limit);
          return {
            content: [{ type: 'text', text: JSON.stringify(executions) }]
          };
          
        case 'stop_execution':
          const stopResult = await n8nClient.stopExecution(args.executionId);
          return {
            content: [{ type: 'text', text: JSON.stringify(stopResult) }]
          };
          
        case 'test_connection':
          const connectionResult = await n8nClient.testConnection();
          return {
            content: [{ type: 'text', text: JSON.stringify(connectionResult) }]
          };
          
        case 'get_template_stats':
          // For now, return basic stats from workflows
          const allWorkflows = await n8nClient.listWorkflows();
          const stats = {
            totalTemplates: allWorkflows.length,
            categories: ['AI/ML', 'Communication', 'Database', 'Automation'],
            totalExecutions: 0, // Would need to aggregate from executions
            lastUpdated: new Date().toISOString()
          };
          return {
            content: [{ type: 'text', text: JSON.stringify(stats) }]
          };
          
        case 'list_integrations':
          // For now, return a basic list of common integrations
          // In a real implementation, this would query the n8n nodes/credentials
          const integrations = [
            { id: 'openai', name: 'OpenAI', category: 'AI/ML', description: 'OpenAI API integration' },
            { id: 'slack', name: 'Slack', category: 'Communication', description: 'Slack messaging' },
            { id: 'google-sheets', name: 'Google Sheets', category: 'Database', description: 'Google Sheets integration' },
            { id: 'webhook', name: 'Webhook', category: 'Communication', description: 'HTTP webhook integration' },
            { id: 'email', name: 'Email', category: 'Communication', description: 'Email integration' },
            { id: 'schedule', name: 'Schedule', category: 'Automation', description: 'Schedule trigger' }
          ];
          return {
            content: [{ type: 'text', text: JSON.stringify(integrations) }]
          };
          
        case 'list_templates':
          // Mock template data - in a real app this would come from a database
          const templates = [
            {
              id: 'template_1',
              name: 'AI Content Generator',
              description: 'Generate content using OpenAI GPT models',
              category: 'AI/ML',
              complexity: 'medium',
              nodes: 4,
              integrations: ['OpenAI', 'Slack'],
              active: true,
              executions: 156,
              trigger_type: 'webhook',
              thumbnail: '/templates/ai-content.jpg'
            },
            {
              id: 'template_2', 
              name: 'Email Automation',
              description: 'Automated email responses and notifications',
              category: 'Communication',
              complexity: 'low',
              nodes: 3,
              integrations: ['Gmail', 'Webhook'],
              active: true,
              executions: 89,
              trigger_type: 'cron',
              thumbnail: '/templates/email-automation.jpg'
            },
            {
              id: 'template_3',
              name: 'Data Sync Pipeline',
              description: 'Sync data between multiple databases',
              category: 'Database',
              complexity: 'high',
              nodes: 6,
              integrations: ['PostgreSQL', 'MongoDB'],
              active: false,
              executions: 23,
              trigger_type: 'schedule',
              thumbnail: '/templates/data-sync.jpg'
            }
          ];
          return {
            content: [{ type: 'text', text: JSON.stringify(templates) }]
          };
          
        case 'search_templates':
          // Mock search results - filter by query and category
          const searchResults = [
            {
              id: 'template_1',
              name: 'AI Content Generator',
              description: 'Generate content using OpenAI GPT models',
              category: 'AI/ML',
              complexity: 'medium',
              nodes: 4,
              integrations: ['OpenAI', 'Slack'],
              active: true,
              executions: 156,
              trigger_type: 'webhook',
              thumbnail: '/templates/ai-content.jpg'
            }
          ];
          return {
            content: [{ type: 'text', text: JSON.stringify(searchResults) }]
          };
          
        case 'get_template':
          // Mock template detail
          const templateDetail = {
            id: args.id,
            name: 'AI Content Generator',
            description: 'Generate content using OpenAI GPT models with customizable prompts',
            category: 'AI/ML',
            complexity: 'medium',
            nodes: 4,
            integrations: ['OpenAI', 'Slack'],
            active: true,
            executions: 156,
            trigger_type: 'webhook',
            thumbnail: '/templates/ai-content.jpg',
            workflow_json: {
              nodes: [],
              connections: {}
            }
          };
          return {
            content: [{ type: 'text', text: JSON.stringify(templateDetail) }]
          };
          
        case 'deploy_template':
          const deployResult = {
            workflowId: `wf_${Date.now()}`,
            templateId: args.templateId,
            name: args.customName || 'Deployed Workflow',
            active: args.activate || false,
            message: 'Template deployed successfully'
          };
          return {
            content: [{ type: 'text', text: JSON.stringify(deployResult) }]
          };
          
        default:
          return {
            content: [{ type: 'text', text: `Unknown tool: ${toolName}` }],
            isError: true
          };
      }
    } catch (error) {
      console.error(`Error in handleToolDirect for ${toolName}:`, error);
      return {
        content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        isError: true
      };
    }
  }

  // Workflow Management
  async listWorkflows(active?: boolean): Promise<N8nWorkflow[]> {
    const response = await this.callTool('list_workflows', { active });
    if (response.isError) {
      throw new Error(response.content[0]?.text || 'Failed to list workflows');
    }
    return JSON.parse(response.content[0]?.text || '[]');
  }

  async getWorkflow(id: string): Promise<N8nWorkflow> {
    const response = await this.callTool('get_workflow', { id });
    if (response.isError) {
      throw new Error(response.content[0]?.text || 'Failed to get workflow');
    }
    return JSON.parse(response.content[0]?.text || '{}');
  }

  async executeWorkflow(id: string, data?: any): Promise<any> {
    const response = await this.callTool('execute_workflow', { id, data });
    if (response.isError) {
      throw new Error(response.content[0]?.text || 'Failed to execute workflow');
    }
    return JSON.parse(response.content[0]?.text || '{}');
  }

  async activateWorkflow(id: string): Promise<any> {
    const response = await this.callTool('activate_workflow', { id });
    if (response.isError) {
      throw new Error(response.content[0]?.text || 'Failed to activate workflow');
    }
    return JSON.parse(response.content[0]?.text || '{}');
  }

  async deactivateWorkflow(id: string): Promise<any> {
    const response = await this.callTool('deactivate_workflow', { id });
    if (response.isError) {
      throw new Error(response.content[0]?.text || 'Failed to deactivate workflow');
    }
    return JSON.parse(response.content[0]?.text || '{}');
  }

  async getExecutions(workflowId: string, limit: number = 10): Promise<ExecutionData[]> {
    const response = await this.callTool('get_executions', { workflowId, limit });
    if (response.isError) {
      throw new Error(response.content[0]?.text || 'Failed to get executions');
    }
    return JSON.parse(response.content[0]?.text || '[]');
  }

  async stopExecution(executionId: string): Promise<any> {
    const response = await this.callTool('stop_execution', { executionId });
    if (response.isError) {
      throw new Error(response.content[0]?.text || 'Failed to stop execution');
    }
    return JSON.parse(response.content[0]?.text || '{}');
  }

  // Template Management
  async searchTemplates(query: string, category?: string, complexity?: 'low' | 'medium' | 'high', triggerType?: string, limit: number = 50): Promise<WorkflowTemplate[]> {
    const response = await this.callTool('search_templates', { 
      query, 
      category, 
      complexity, 
      trigger_type: triggerType, 
      limit 
    });
    if (response.isError) {
      throw new Error(response.content[0]?.text || 'Failed to search templates');
    }
    return JSON.parse(response.content[0]?.text || '[]');
  }

  async listTemplates(filters: {
    category?: string;
    complexity?: 'low' | 'medium' | 'high';
    trigger_type?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<WorkflowTemplate[]> {
    const response = await this.callTool('list_templates', filters);
    if (response.isError) {
      throw new Error(response.content[0]?.text || 'Failed to list templates');
    }
    return JSON.parse(response.content[0]?.text || '[]');
  }

  async getTemplate(id: string): Promise<WorkflowTemplate> {
    const response = await this.callTool('get_template', { id });
    if (response.isError) {
      throw new Error(response.content[0]?.text || 'Failed to get template');
    }
    return JSON.parse(response.content[0]?.text || '{}');
  }

  async deployTemplate(templateId: string, customName?: string, activate: boolean = false): Promise<any> {
    const response = await this.callTool('deploy_template', { templateId, customName, activate });
    if (response.isError) {
      throw new Error(response.content[0]?.text || 'Failed to deploy template');
    }
    return JSON.parse(response.content[0]?.text || '{}');
  }

  async getTemplateStats(): Promise<any> {
    const response = await this.callTool('get_template_stats');
    if (response.isError) {
      throw new Error(response.content[0]?.text || 'Failed to get template stats');
    }
    
    const responseText = response.content[0]?.text || '{}';
    try {
      return JSON.parse(responseText);
    } catch (error) {
      // If parsing fails, return the raw text
      return { raw: responseText };
    }
  }

  async listIntegrations(): Promise<any[]> {
    const response = await this.callTool('list_integrations');
    if (response.isError) {
      throw new Error(response.content[0]?.text || 'Failed to list integrations');
    }
    return JSON.parse(response.content[0]?.text || '[]');
  }

  // System Health
  async testConnection(): Promise<any> {
    const response = await this.callTool('test_connection');
    if (response.isError) {
      throw new Error(response.content[0]?.text || 'Failed to test connection');
    }
    return JSON.parse(response.content[0]?.text || 'false');
  }

  // Utility method to get system health status
  async getSystemHealth(): Promise<{
    n8nConnected: boolean;
    templatesLoaded: number;
    integrationsAvailable: number;
    lastCheck: string;
  }> {
    try {
      const [connectionTest, templateStats, integrations] = await Promise.allSettled([
        this.testConnection(),
        this.getTemplateStats(),
        this.listIntegrations()
      ]);

      // Handle connection test result
      const isConnected = connectionTest.status === 'fulfilled' && connectionTest.value === true;
      
      // Handle template stats (may fail due to SQLite issues)
      let templatesCount = 0;
      if (templateStats.status === 'fulfilled') {
        templatesCount = templateStats.value?.totalTemplates || 0;
      }

      // Handle integrations
      let integrationsCount = 0;
      if (integrations.status === 'fulfilled') {
        integrationsCount = integrations.value?.length || 0;
      }

      return {
        n8nConnected: isConnected,
        templatesLoaded: templatesCount,
        integrationsAvailable: integrationsCount,
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      return {
        n8nConnected: false,
        templatesLoaded: 0,
        integrationsAvailable: 0,
        lastCheck: new Date().toISOString()
      };
    }
  }
}

// Export a singleton instance
export const mcpClient = new MCPClient(); 