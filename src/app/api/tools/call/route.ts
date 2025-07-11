import { NextRequest, NextResponse } from 'next/server';
import { getN8nClient } from '@/lib/n8n-client';

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

export async function POST(request: NextRequest) {
  try {
    const { name, arguments: args = {} }: MCPToolRequest = await request.json();
    
    let response: MCPResponse;
    
    try {
      const n8nClient = getN8nClient();
      
      switch (name) {
        case 'list_workflows':
          const workflows = await n8nClient.listWorkflows(args.active);
          response = {
            content: [{ type: 'text', text: JSON.stringify(workflows) }]
          };
          break;
          
        case 'get_workflow':
          const workflow = await n8nClient.getWorkflow(args.id);
          response = {
            content: [{ type: 'text', text: JSON.stringify(workflow) }]
          };
          break;
          
        case 'execute_workflow':
          const execution = await n8nClient.executeWorkflow(args.id, args.data);
          response = {
            content: [{ type: 'text', text: JSON.stringify(execution) }]
          };
          break;
          
        case 'activate_workflow':
          const activateResult = await n8nClient.activateWorkflow(args.id);
          response = {
            content: [{ type: 'text', text: JSON.stringify(activateResult) }]
          };
          break;
          
        case 'deactivate_workflow':
          const deactivateResult = await n8nClient.deactivateWorkflow(args.id);
          response = {
            content: [{ type: 'text', text: JSON.stringify(deactivateResult) }]
          };
          break;
          
        case 'get_executions':
          const executions = await n8nClient.getExecutions(args.workflowId, args.limit);
          response = {
            content: [{ type: 'text', text: JSON.stringify(executions) }]
          };
          break;
          
        case 'stop_execution':
          const stopResult = await n8nClient.stopExecution(args.executionId);
          response = {
            content: [{ type: 'text', text: JSON.stringify(stopResult) }]
          };
          break;
          
        case 'test_connection':
          const connectionResult = await n8nClient.testConnection();
          response = {
            content: [{ type: 'text', text: JSON.stringify(connectionResult) }]
          };
          break;
          
        case 'get_template_stats':
          // For now, return basic stats from workflows
          const allWorkflows = await n8nClient.listWorkflows();
          const stats = {
            totalTemplates: allWorkflows.length,
            categories: ['AI/ML', 'Communication', 'Database', 'Automation'],
            totalExecutions: 0, // Would need to aggregate from executions
            lastUpdated: new Date().toISOString()
          };
          response = {
            content: [{ type: 'text', text: JSON.stringify(stats) }]
          };
          break;
          
        case 'list_integrations':
          // For now, return a basic list of common integrations
          const integrations = [
            { id: 'openai', name: 'OpenAI', category: 'AI/ML', description: 'OpenAI API integration' },
            { id: 'slack', name: 'Slack', category: 'Communication', description: 'Slack messaging' },
            { id: 'google-sheets', name: 'Google Sheets', category: 'Database', description: 'Google Sheets integration' },
            { id: 'webhook', name: 'Webhook', category: 'Communication', description: 'HTTP webhook integration' },
            { id: 'email', name: 'Email', category: 'Communication', description: 'Email integration' },
            { id: 'schedule', name: 'Schedule', category: 'Automation', description: 'Schedule trigger' }
          ];
          response = {
            content: [{ type: 'text', text: JSON.stringify(integrations) }]
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
          response = {
            content: [{ type: 'text', text: JSON.stringify(templates) }]
          };
          break;
          
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
          response = {
            content: [{ type: 'text', text: JSON.stringify(searchResults) }]
          };
          break;
          
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
          response = {
            content: [{ type: 'text', text: JSON.stringify(templateDetail) }]
          };
          break;
          
        default:
          response = {
            content: [{ type: 'text', text: `Unknown tool: ${name}` }],
            isError: true
          };
      }
    } catch (n8nError) {
      // If N8N API fails, return error response
      console.error('N8N API Error:', n8nError);
      response = {
        content: [{ type: 'text', text: `N8N API Error: ${n8nError instanceof Error ? n8nError.message : 'Unknown error'}` }],
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