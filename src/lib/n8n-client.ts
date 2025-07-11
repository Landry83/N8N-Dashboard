interface N8nConfig {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
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

interface N8nExecution {
  id: string;
  workflowId: string;
  status: 'success' | 'error' | 'running' | 'waiting';
  startedAt: string;
  finishedAt?: string;
  mode: string;
}

export class N8nClient {
  private config: N8nConfig;

  constructor(config: N8nConfig) {
    this.config = {
      timeout: 30000,
      ...config
    };
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-N8N-API-KEY': this.config.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.config.timeout!),
    });

    if (!response.ok) {
      throw new Error(`N8N API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async listWorkflows(active?: boolean): Promise<N8nWorkflow[]> {
    const endpoint = active !== undefined ? `/api/v1/workflows?active=${active}` : '/api/v1/workflows';
    const response = await this.makeRequest<any>(endpoint);
    
    // Handle different N8N API response formats
    if (Array.isArray(response)) {
      return response;
    } else if (response.workflows && Array.isArray(response.workflows)) {
      return response.workflows;
    } else if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.warn('Unexpected N8N API response format:', response);
      return [];
    }
  }

  async getWorkflow(id: string): Promise<N8nWorkflow> {
    return this.makeRequest<N8nWorkflow>(`/api/v1/workflows/${id}`);
  }

  async executeWorkflow(id: string, data?: any): Promise<any> {
    return this.makeRequest(`/api/v1/workflows/${id}/execute`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  }

  async activateWorkflow(id: string): Promise<any> {
    return this.makeRequest(`/api/v1/workflows/${id}/activate`, {
      method: 'POST',
    });
  }

  async deactivateWorkflow(id: string): Promise<any> {
    return this.makeRequest(`/api/v1/workflows/${id}/deactivate`, {
      method: 'POST',
    });
  }

  async getExecutions(workflowId: string, limit: number = 10): Promise<N8nExecution[]> {
    const endpoint = workflowId 
      ? `/api/v1/executions?workflowId=${workflowId}&limit=${limit}`
      : `/api/v1/executions?limit=${limit}`;
    const response = await this.makeRequest<any>(endpoint);
    
    // Handle different N8N API response formats
    if (Array.isArray(response)) {
      return response;
    } else if (response.executions && Array.isArray(response.executions)) {
      return response.executions;
    } else if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.warn('Unexpected N8N API response format for executions:', response);
      return [];
    }
  }

  async stopExecution(executionId: string): Promise<any> {
    return this.makeRequest(`/api/v1/executions/${executionId}/stop`, {
      method: 'POST',
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/api/v1/workflows?limit=1');
      return true;
    } catch (error) {
      console.error('N8N connection test failed:', error);
      return false;
    }
  }

  async getSystemHealth(): Promise<any> {
    try {
      const workflows = await this.makeRequest<N8nWorkflow[]>('/api/v1/workflows?limit=1');
      const executions = await this.makeRequest<N8nExecution[]>('/api/v1/executions?limit=1');
      
      return {
        status: 'healthy',
        n8nConnected: true,
        workflowCount: workflows.length,
        recentExecutions: executions.length,
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        n8nConnected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastCheck: new Date().toISOString()
      };
    }
  }
}

// Create singleton instance
let n8nClient: N8nClient | null = null;

export const getN8nClient = (): N8nClient => {
  if (!n8nClient) {
    const baseUrl = process.env.N8N_BASE_URL || process.env.NEXT_PUBLIC_N8N_BASE_URL || 'https://n8n-persistent.onrender.com';
    const apiKey = process.env.N8N_API_KEY || process.env.NEXT_PUBLIC_N8N_API_KEY || '';
    
    if (!baseUrl || !apiKey) {
      throw new Error('N8N configuration missing: N8N_BASE_URL and N8N_API_KEY are required');
    }

    n8nClient = new N8nClient({
      baseUrl,
      apiKey,
      timeout: parseInt(process.env.N8N_TIMEOUT || '30000')
    });
  }
  
  return n8nClient;
}; 