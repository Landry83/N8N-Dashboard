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

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  private async callTool(toolName: string, args: any = {}): Promise<MCPResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tools/call`, {
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