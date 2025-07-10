"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Play, 
  Square, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2,
  Calendar,
  Timer,
  Zap,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Eye,
  StopCircle
} from "lucide-react";
import { MCPClient } from "@/lib/mcp-client";
import { useToast } from "@/hooks/use-toast";

interface Execution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'success' | 'error' | 'running' | 'waiting' | 'cancelled';
  startedAt: string;
  finishedAt?: string;
  mode: string;
  duration?: number;
  error?: string;
  data?: any;
}

interface ExecutionStats {
  total: number;
  success: number;
  error: number;
  running: number;
  waiting: number;
  avgDuration: number;
  successRate: number;
  totalDuration: number;
}

const statusColors = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  running: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  waiting: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
};

const statusIcons = {
  success: CheckCircle,
  error: XCircle,
  running: Loader2,
  waiting: Clock,
  cancelled: StopCircle
};

export default function ExecutionsPage() {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [stats, setStats] = useState<ExecutionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [workflowFilter, setWorkflowFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("24h");
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { toast } = useToast();

  const mcpClient = new MCPClient();

  useEffect(() => {
    loadExecutions();
    loadStats();
  }, [timeFilter, statusFilter, workflowFilter]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        refreshExecutions();
      }, 5000); // Refresh every 5 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadExecutions = async () => {
    try {
      setLoading(true);
      // For now, we'll get executions from all workflows
      // In a real implementation, you'd have an endpoint to get all executions
      const response = await mcpClient.getExecutions('', 100);
      setExecutions(response);
    } catch (error) {
      console.error('Error loading executions:', error);
      toast({
        title: "Error",
        description: "Failed to load executions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshExecutions = async () => {
    try {
      setRefreshing(true);
      const response = await mcpClient.getExecutions('', 100);
      setExecutions(response);
    } catch (error) {
      console.error('Error refreshing executions:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const loadStats = async () => {
    try {
      // Calculate stats from executions
      if (executions.length > 0) {
        const stats: ExecutionStats = {
          total: executions.length,
          success: executions.filter(e => e.status === 'success').length,
          error: executions.filter(e => e.status === 'error').length,
          running: executions.filter(e => e.status === 'running').length,
          waiting: executions.filter(e => e.status === 'waiting').length,
          avgDuration: 0,
          successRate: 0,
          totalDuration: 0
        };

        const completedExecutions = executions.filter(e => e.finishedAt && e.startedAt);
        if (completedExecutions.length > 0) {
          const durations = completedExecutions.map(e => {
            const start = new Date(e.startedAt).getTime();
            const end = new Date(e.finishedAt!).getTime();
            return end - start;
          });
          stats.avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
          stats.totalDuration = durations.reduce((a, b) => a + b, 0);
        }

        stats.successRate = stats.total > 0 ? (stats.success / stats.total) * 100 : 0;
        setStats(stats);
      }
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const stopExecution = async (executionId: string) => {
    try {
      await mcpClient.stopExecution(executionId);
      toast({
        title: "Success",
        description: "Execution stopped successfully",
      });
      refreshExecutions();
    } catch (error) {
      console.error('Error stopping execution:', error);
      toast({
        title: "Error",
        description: "Failed to stop execution. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredExecutions = executions.filter(execution => {
    const matchesSearch = !searchQuery || 
      execution.workflowName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      execution.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || execution.status === statusFilter;
    const matchesWorkflow = workflowFilter === 'all' || execution.workflowId === workflowFilter;
    
    return matchesSearch && matchesStatus && matchesWorkflow;
  });

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const uniqueWorkflows = Array.from(new Set(executions.map(e => ({ id: e.workflowId, name: e.workflowName }))))
    .filter((workflow, index, self) => self.findIndex(w => w.id === workflow.id) === index);

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Execution Monitor</h1>
              <p className="text-muted-foreground">
                Monitor workflow executions in real-time
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshExecutions}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <Activity className="h-4 w-4 mr-2" />
                Auto Refresh
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">
                    All time
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{Math.round(stats.successRate)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.success} successful
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatDuration(stats.avgDuration)}</div>
                  <p className="text-xs text-muted-foreground">
                    Per execution
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Running</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.running}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently active
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Failed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.error}</div>
                  <p className="text-xs text-muted-foreground">
                    Need attention
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search executions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={workflowFilter} onValueChange={setWorkflowFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Workflow" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Workflows</SelectItem>
                  {uniqueWorkflows.map(workflow => (
                    <SelectItem key={workflow.id} value={workflow.id}>
                      {workflow.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Executions List */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading executions...</span>
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredExecutions.map((execution) => {
                    const StatusIcon = statusIcons[execution.status];
                    const duration = execution.finishedAt && execution.startedAt
                      ? new Date(execution.finishedAt).getTime() - new Date(execution.startedAt).getTime()
                      : null;
                    
                    return (
                      <Card key={execution.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <StatusIcon 
                                className={`h-5 w-5 ${
                                  execution.status === 'running' ? 'animate-spin' : ''
                                } ${
                                  execution.status === 'success' ? 'text-green-500' :
                                  execution.status === 'error' ? 'text-red-500' :
                                  execution.status === 'running' ? 'text-blue-500' :
                                  execution.status === 'waiting' ? 'text-yellow-500' :
                                  'text-gray-500'
                                }`} 
                              />
                              <div>
                                <h3 className="font-medium">{execution.workflowName}</h3>
                                <p className="text-sm text-muted-foreground">
                                  ID: {execution.id}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <Badge className={statusColors[execution.status]}>
                                  {execution.status}
                                </Badge>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {formatRelativeTime(execution.startedAt)}
                                </p>
                              </div>
                              
                              {duration && (
                                <div className="text-right">
                                  <p className="text-sm font-medium">{formatDuration(duration)}</p>
                                  <p className="text-xs text-muted-foreground">Duration</p>
                                </div>
                              )}
                              
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  Details
                                </Button>
                                {execution.status === 'running' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => stopExecution(execution.id)}
                                  >
                                    <Square className="h-4 w-4 mr-1" />
                                    Stop
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {execution.error && (
                            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                              <p className="text-sm text-red-700 dark:text-red-300">
                                <strong>Error:</strong> {execution.error}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            )}

            {!loading && filteredExecutions.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No executions found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 