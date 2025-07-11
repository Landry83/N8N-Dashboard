"use client";

import { useN8nApi } from "@/hooks/use-n8n-api";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Square, Power, PowerOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { VoiceInterface } from "@/components/voice-interface";

export function DashboardContent() {
  const {
    workflows,
    executions,
    systemHealth,
    loading,
    error,
    executeWorkflow,
    activateWorkflow,
    deactivateWorkflow,
  } = useN8nApi();

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleWorkflowAction = async (action: string, workflowId: string) => {
    setActionLoading(`${action}-${workflowId}`);
    try {
      switch (action) {
        case 'execute':
          await executeWorkflow(workflowId);
          break;
        case 'activate':
          await activateWorkflow(workflowId);
          break;
        case 'deactivate':
          await deactivateWorkflow(workflowId);
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} workflow:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  // Calculate stats
  const activeWorkflows = workflows.filter(w => w.active).length;
  const totalWorkflows = workflows.length;
  const recentExecutions = executions.slice(0, 5);
  const successfulExecutions = executions.filter(e => e.status === 'success').length;
  const failedExecutions = executions.filter(e => e.status === 'error').length;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          
          {/* Main Dashboard Layout with AI Assistant */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Left side - Main content */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* System Health Status */}
                {systemHealth && (
                  <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    System Status
                    <Badge variant={systemHealth.n8nConnected ? "default" : "destructive"}>
                      {systemHealth.n8nConnected ? "Connected" : "Disconnected"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    N8N MCP Server connection status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium capitalize">{systemHealth.status}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">N8N Connected</p>
                      <p className="font-medium">{systemHealth.n8nConnected ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Templates</p>
                      <p className="font-medium">{systemHealth.templatesLoaded || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Integrations</p>
                      <p className="font-medium">{systemHealth.integrationsAvailable || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Real-time Statistics Cards */}
            <div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
                  <Power className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalWorkflows}</div>
                  <p className="text-xs text-muted-foreground">
                    {activeWorkflows} active, {totalWorkflows - activeWorkflows} inactive
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
                  <PowerOff className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeWorkflows}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalWorkflows > 0 ? Math.round((activeWorkflows / totalWorkflows) * 100) : 0}% of total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Executions</CardTitle>
                  <Play className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{executions.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {successfulExecutions} successful, {failedExecutions} failed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <Square className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {executions.length > 0 ? Math.round((successfulExecutions / executions.length) * 100) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last {executions.length} executions
                  </p>
                </CardContent>
              </Card>
            </div>
            </div>

            {/* Charts */}
            <div>
              <ChartAreaInteractive />
            </div>

            {/* Workflows Table */}
            <div>
            <Card>
              <CardHeader>
                <CardTitle>Workflows</CardTitle>
                <CardDescription>
                  Manage your N8N workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading workflows...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    Error: {error}
                  </div>
                ) : workflows.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No workflows found
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4 pr-4">
                      {workflows.map((workflow) => (
                        <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <h4 className="font-medium">{workflow.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant={workflow.active ? "default" : "secondary"}>
                                {workflow.active ? "Active" : "Inactive"}
                              </Badge>
                              <span>•</span>
                              <span>{workflow.nodes?.length || 0} nodes</span>
                              <span>•</span>
                              <span>Updated {new Date(workflow.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWorkflowAction('execute', workflow.id)}
                              disabled={actionLoading === `execute-${workflow.id}`}
                            >
                              {actionLoading === `execute-${workflow.id}` ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                              Execute
                            </Button>
                            <Button
                              size="sm"
                              variant={workflow.active ? "destructive" : "default"}
                              onClick={() => handleWorkflowAction(workflow.active ? 'deactivate' : 'activate', workflow.id)}
                              disabled={actionLoading === `${workflow.active ? 'deactivate' : 'activate'}-${workflow.id}`}
                            >
                              {actionLoading === `${workflow.active ? 'deactivate' : 'activate'}-${workflow.id}` ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : workflow.active ? (
                                <PowerOff className="h-4 w-4" />
                              ) : (
                                <Power className="h-4 w-4" />
                              )}
                              {workflow.active ? 'Deactivate' : 'Activate'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
            </div>

            {/* Recent Executions */}
            <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Executions</CardTitle>
                <CardDescription>
                  Latest workflow execution results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentExecutions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent executions
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentExecutions.map((execution) => (
                      <div key={execution.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h4 className="font-medium">Execution {execution.id}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge 
                              variant={
                                execution.status === 'success' ? 'default' :
                                execution.status === 'error' ? 'destructive' :
                                execution.status === 'running' ? 'secondary' : 'outline'
                              }
                            >
                              {execution.status}
                            </Badge>
                            <span>•</span>
                            <span>Started {new Date(execution.startedAt).toLocaleString()}</span>
                            {execution.finishedAt && (
                              <>
                                <span>•</span>
                                <span>Finished {new Date(execution.finishedAt).toLocaleString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Mode: {execution.mode}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            </div>
            
            </div>
            
            {/* Right side - AI Assistant */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 max-h-[calc(100vh-6rem)] overflow-hidden">
                <VoiceInterface />
              </div>
            </div>
            
          </div>
        </div>
        
        </div>
      </div>
    </div>
  );
} 