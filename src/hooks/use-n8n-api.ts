import { useState, useEffect, useCallback } from 'react';

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

interface SystemHealth {
  status: 'healthy' | 'unhealthy' | 'error';
  n8nConnected: boolean;
  templatesLoaded?: number;
  integrationsAvailable?: number;
  lastCheck: string;
}

export function useN8nApi() {
  const [workflows, setWorkflows] = useState<N8nWorkflow[]>([]);
  const [executions, setExecutions] = useState<N8nExecution[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch workflows
  const fetchWorkflows = useCallback(async (active?: boolean) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (active !== undefined) {
        params.append('active', active.toString());
      }
      
      const response = await fetch(`/api/workflows?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setWorkflows(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workflows');
      // Set fallback mock data when API fails
      setWorkflows([
        {
          id: 'mock_1',
          name: 'AI Email Assistant (Demo Mode)',
          active: true,
          nodes: [{ type: 'trigger' }, { type: 'openai' }, { type: 'gmail' }],
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          connections: {}
        },
        {
          id: 'mock_2',
          name: 'Slack Bot Workflow (Demo Mode)',
          active: false,
          nodes: [{ type: 'webhook' }, { type: 'slack' }],
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          connections: {}
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch executions
  const fetchExecutions = useCallback(async (workflowId?: string, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (workflowId) {
        params.append('workflowId', workflowId);
      }
      params.append('limit', limit.toString());
      
      const response = await fetch(`/api/executions?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setExecutions(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch executions');
      // Set fallback mock data when API fails
      setExecutions([
        {
          id: 'mock_exec_1',
          workflowId: 'mock_1',
          status: 'success',
          startedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          finishedAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
          mode: 'trigger'
        },
        {
          id: 'mock_exec_2',
          workflowId: 'mock_2',
          status: 'error',
          startedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          finishedAt: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
          mode: 'manual'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch system health
  const fetchSystemHealth = useCallback(async () => {
    try {
      const response = await fetch('/api/system/health');
      const result = await response.json();
      
      if (result.success) {
        setSystemHealth(result.health);
      } else {
        setSystemHealth({
          status: 'error',
          n8nConnected: false,
          lastCheck: new Date().toISOString()
        });
      }
    } catch (err) {
      setSystemHealth({
        status: 'error',
        n8nConnected: false,
        templatesLoaded: 0,
        integrationsAvailable: 0,
        lastCheck: new Date().toISOString()
      });
    }
  }, []);

  // Execute workflow
  const executeWorkflow = useCallback(async (workflowId: string, data?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'execute',
          data,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh executions after execution
        await fetchExecutions();
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute workflow');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchExecutions]);

  // Activate workflow
  const activateWorkflow = useCallback(async (workflowId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'activate',
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh workflows after activation
        await fetchWorkflows();
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate workflow');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWorkflows]);

  // Deactivate workflow
  const deactivateWorkflow = useCallback(async (workflowId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deactivate',
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh workflows after deactivation
        await fetchWorkflows();
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate workflow');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWorkflows]);

  // Initialize data on mount
  useEffect(() => {
    fetchWorkflows();
    fetchExecutions();
    fetchSystemHealth();
  }, [fetchWorkflows, fetchExecutions, fetchSystemHealth]);

  return {
    workflows,
    executions,
    systemHealth,
    loading,
    error,
    fetchWorkflows,
    fetchExecutions,
    fetchSystemHealth,
    executeWorkflow,
    activateWorkflow,
    deactivateWorkflow,
  };
} 