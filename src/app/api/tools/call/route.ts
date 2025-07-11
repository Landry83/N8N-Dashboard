import { NextRequest, NextResponse } from 'next/server';

interface MCPToolRequest {
  name: string;
  arguments?: any;
}

interface MCPResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}

// Mock data for demonstration
const mockWorkflows = [
  {
    id: 'wf_001',
    name: 'AI Content Generator',
    active: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:22:00Z',
    nodes: [
      { id: 'node_1', type: 'trigger', name: 'Manual Trigger' },
      { id: 'node_2', type: 'openai', name: 'OpenAI GPT-4' },
      { id: 'node_3', type: 'webhook', name: 'Webhook Response' }
    ],
    connections: {}
  },
  {
    id: 'wf_002',
    name: 'Slack Message Automation',
    active: true,
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
    nodes: [
      { id: 'node_1', type: 'schedule', name: 'Schedule Trigger' },
      { id: 'node_2', type: 'slack', name: 'Send Slack Message' }
    ],
    connections: {}
  }
];

const mockExecutions = [
  {
    id: 'exec_001',
    workflowId: 'wf_001',
    status: 'success',
    startedAt: '2024-01-16T14:30:00Z',
    finishedAt: '2024-01-16T14:30:15Z',
    mode: 'manual'
  },
  {
    id: 'exec_002',
    workflowId: 'wf_002',
    status: 'success',
    startedAt: '2024-01-16T14:25:00Z',
    finishedAt: '2024-01-16T14:25:08Z',
    mode: 'trigger'
  }
];

const mockTemplates = [
  {
    id: 'tpl_001',
    name: 'OpenAI Content Generator',
    description: 'Generate AI content using OpenAI GPT-4',
    category: 'AI/ML',
    complexity: 'medium',
    nodes: 3,
    integrations: ['OpenAI', 'Webhook'],
    active: true,
    executions: 156,
    lastExecuted: '2024-01-16T14:30:00Z',
    trigger_type: 'manual'
  },
  {
    id: 'tpl_002',
    name: 'Slack Notification Bot',
    description: 'Automated Slack notifications for team updates',
    category: 'Communication',
    complexity: 'low',
    nodes: 2,
    integrations: ['Slack', 'Schedule'],
    active: true,
    executions: 342,
    lastExecuted: '2024-01-16T14:25:00Z',
    trigger_type: 'schedule'
  }
];

const mockIntegrations = [
  { id: 'int_001', name: 'OpenAI', category: 'AI/ML', description: 'OpenAI GPT models' },
  { id: 'int_002', name: 'Slack', category: 'Communication', description: 'Slack messaging' },
  { id: 'int_003', name: 'Google Sheets', category: 'Database', description: 'Google Sheets integration' },
  { id: 'int_004', name: 'Discord', category: 'Communication', description: 'Discord bot integration' }
];

export async function POST(request: NextRequest) {
  try {
    const { name, arguments: args = {} }: MCPToolRequest = await request.json();
    
    let response: MCPResponse;
    
    switch (name) {
      case 'list_workflows':
        const filteredWorkflows = args.active !== undefined 
          ? mockWorkflows.filter(w => w.active === args.active)
          : mockWorkflows;
        response = {
          content: [{ type: 'text', text: JSON.stringify(filteredWorkflows) }]
        };
        break;
        
      case 'get_workflow':
        const workflow = mockWorkflows.find(w => w.id === args.id);
        if (workflow) {
          response = {
            content: [{ type: 'text', text: JSON.stringify(workflow) }]
          };
        } else {
          response = {
            content: [{ type: 'text', text: 'Workflow not found' }],
            isError: true
          };
        }
        break;
        
      case 'get_executions':
        const executions = args.workflowId 
          ? mockExecutions.filter(e => e.workflowId === args.workflowId)
          : mockExecutions;
        response = {
          content: [{ type: 'text', text: JSON.stringify(executions.slice(0, args.limit || 10)) }]
        };
        break;
        
      case 'search_templates':
        const searchResults = mockTemplates.filter(t => 
          t.name.toLowerCase().includes(args.query?.toLowerCase() || '') ||
          t.description.toLowerCase().includes(args.query?.toLowerCase() || '')
        );
        response = {
          content: [{ type: 'text', text: JSON.stringify(searchResults.slice(0, args.limit || 50)) }]
        };
        break;
        
      case 'list_templates':
        let filteredTemplates = mockTemplates;
        if (args.category) {
          filteredTemplates = filteredTemplates.filter(t => t.category === args.category);
        }
        if (args.complexity) {
          filteredTemplates = filteredTemplates.filter(t => t.complexity === args.complexity);
        }
        response = {
          content: [{ type: 'text', text: JSON.stringify(filteredTemplates.slice(0, args.limit || 50)) }]
        };
        break;
        
      case 'get_template':
        const template = mockTemplates.find(t => t.id === args.id);
        if (template) {
          response = {
            content: [{ type: 'text', text: JSON.stringify(template) }]
          };
        } else {
          response = {
            content: [{ type: 'text', text: 'Template not found' }],
            isError: true
          };
        }
        break;
        
      case 'get_template_stats':
        const stats = {
          totalTemplates: mockTemplates.length,
          categories: ['AI/ML', 'Communication', 'Database'],
          totalExecutions: mockTemplates.reduce((sum, t) => sum + t.executions, 0),
          lastUpdated: new Date().toISOString()
        };
        response = {
          content: [{ type: 'text', text: JSON.stringify(stats) }]
        };
        break;
        
      case 'list_integrations':
        response = {
          content: [{ type: 'text', text: JSON.stringify(mockIntegrations) }]
        };
        break;
        
      case 'test_connection':
        // Simulate connection test
        response = {
          content: [{ type: 'text', text: 'true' }]
        };
        break;
        
      case 'execute_workflow':
        const executionResult = {
          id: `exec_${Date.now()}`,
          workflowId: args.id,
          status: 'success',
          startedAt: new Date().toISOString(),
          finishedAt: new Date(Date.now() + 5000).toISOString(),
          mode: 'manual'
        };
        response = {
          content: [{ type: 'text', text: JSON.stringify(executionResult) }]
        };
        break;
        
      case 'activate_workflow':
        const activateResult = {
          id: args.id,
          active: true,
          message: 'Workflow activated successfully'
        };
        response = {
          content: [{ type: 'text', text: JSON.stringify(activateResult) }]
        };
        break;
        
      case 'deactivate_workflow':
        const deactivateResult = {
          id: args.id,
          active: false,
          message: 'Workflow deactivated successfully'
        };
        response = {
          content: [{ type: 'text', text: JSON.stringify(deactivateResult) }]
        };
        break;
        
      case 'deploy_template':
        const deployResult = {
          workflowId: `wf_${Date.now()}`,
          templateId: args.templateId,
          name: args.customName || 'Deployed Workflow',
          active: args.activate || false,
          message: 'Template deployed successfully'
        };
        response = {
          content: [{ type: 'text', text: JSON.stringify(deployResult) }]
        };
        break;
        
      default:
        response = {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true
        };
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in tools/call endpoint:', error);
    return NextResponse.json(
      {
        content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        isError: true
      },
      { status: 500 }
    );
  }
} 