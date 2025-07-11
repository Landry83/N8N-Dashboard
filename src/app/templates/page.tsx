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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Filter, 
  Download, 
  Play, 
  Star, 
  Eye, 
  Clock, 
  Users, 
  Zap, 
  Brain, 
  Mail, 
  Database, 
  MessageSquare, 
  BarChart3,
  FileText,
  Calendar,
  Settings,
  Globe,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { MCPClient } from "@/lib/mcp-client";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  tags?: string[];
  node_count?: number;
  nodes?: number;
  integrations: string[];
  trigger_type: string;
  complexity: "low" | "medium" | "high";
  usage_count?: number;
  executions?: number;
  success_rate?: number;
  author?: string;
  thumbnail_url?: string;
  thumbnail?: string;
  created_at?: string;
  lastExecuted?: string;
  active?: boolean;
}
interface TemplateStats {
  total_templates: number;
  avg_nodes_per_template: number;
  total_categories: number;
  unique_integrations: number;
  low_complexity: number;
  medium_complexity: number;
  high_complexity: number;
  manual_triggers: number;
  webhook_triggers: number;
  scheduled_triggers: number;
  complex_triggers: number;
  total_deployments: number;
  avg_success_rate: number;
}

const categoryIcons = {
  'AI/ML': Brain,
  'Communication': MessageSquare,
  'Database': Database,
  'Email': Mail,
  'Social Media': Users,
  'Productivity': Calendar,
  'Analytics': BarChart3,
  'Documentation': FileText,
  'Integration': Zap,
  'Automation': Settings,
  'Web': Globe,
  'Other': Star
};

const complexityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

const triggerTypeColors = {
  manual: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  webhook: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  scheduled: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  complex: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [stats, setStats] = useState<TemplateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedComplexity, setSelectedComplexity] = useState<string>("all");
  const [selectedTriggerType, setSelectedTriggerType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [deployingTemplate, setDeployingTemplate] = useState<string | null>(null);
  const { toast } = useToast();

  const mcpClient = new MCPClient();

  useEffect(() => {
    loadTemplates();
    loadStats();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await mcpClient.listTemplates();
      setTemplates(response);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error",
        description: "Failed to load templates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await mcpClient.getTemplateStats();
      setStats(response);
    } catch (error) {
      console.error('Error loading template stats:', error);
      // Don't show error toast for stats as it's not critical
    }
  };

  const searchTemplates = async (query: string) => {
    if (!query.trim()) {
      loadTemplates();
      return;
    }

    try {
      setLoading(true);
      const response = await mcpClient.searchTemplates(query, selectedCategory !== 'all' ? selectedCategory : undefined);
      setTemplates(response);
    } catch (error) {
      console.error('Error searching templates:', error);
      toast({
        title: "Error",
        description: "Failed to search templates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deployTemplate = async (templateId: string) => {
    try {
      setDeployingTemplate(templateId);
      const response = await mcpClient.deployTemplate(templateId);
      
      toast({
        title: "Success",
        description: `Template deployed successfully! Workflow ID: ${response.workflowId}`,
      });
      
      // Refresh templates to update usage count
      loadTemplates();
    } catch (error) {
      console.error('Error deploying template:', error);
      toast({
        title: "Error",
        description: "Failed to deploy template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeployingTemplate(null);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (template.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesComplexity = selectedComplexity === 'all' || template.complexity === selectedComplexity;
    const matchesTriggerType = selectedTriggerType === 'all' || template.trigger_type === selectedTriggerType;
    
    return matchesSearch && matchesCategory && matchesComplexity && matchesTriggerType;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return (b.usage_count || b.executions || 0) - (a.usage_count || a.executions || 0);
      case 'success_rate':
        return (b.success_rate || 85) - (a.success_rate || 85);
      case 'newest':
        return new Date(b.created_at || b.lastExecuted || "1970-01-01").getTime() - new Date(a.created_at || a.lastExecuted || "1970-01-01").getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      case 'complexity':
        const complexityOrder = { low: 1, medium: 2, high: 3 };
        return complexityOrder[a.complexity] - complexityOrder[b.complexity];
      default:
        return 0;
    }
  });

  const categories = Array.from(new Set(templates.map(t => t.category))).sort();

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
              <h1 className="text-3xl font-bold">Template Library</h1>
              <p className="text-muted-foreground">
                Discover and deploy from {templates.length} workflow templates
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                {stats?.total_templates || 0} Templates
              </Badge>
              <Badge variant="outline" className="text-sm">
                {stats?.total_categories || 0} Categories
              </Badge>
            </div>
          </div>

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_templates}</div>
                  <p className="text-xs text-muted-foreground">
                    Avg {Math.round(stats.avg_nodes_per_template)} nodes each
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Deployments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_deployments}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(stats.avg_success_rate)}% success rate
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Integrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.unique_integrations}</div>
                  <p className="text-xs text-muted-foreground">
                    Available services
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_categories}</div>
                  <p className="text-xs text-muted-foreground">
                    Template categories
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchTemplates(searchQuery)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => searchTemplates(searchQuery)} className="sm:w-auto">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Complexity</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedTriggerType} onValueChange={setSelectedTriggerType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trigger Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Triggers</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="complex">Complex</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="success_rate">Success Rate</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="complexity">Complexity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading templates...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedTemplates.map((template) => {
                  const CategoryIcon = categoryIcons[template.category as keyof typeof categoryIcons] || Star;
                  
                  return (
                    <Card key={template.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                              <CardDescription className="text-sm">
                                {template.category}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={complexityColors[template.complexity as keyof typeof complexityColors] || "bg-gray-100 text-gray-800"}>
                            {template.complexity}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Settings className="h-4 w-4" />
                              <span>{(template.node_count || template.nodes || 0)} nodes</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{(template.usage_count || template.executions || 0)}</span>
                            </div>
                          </div>
                          <Badge className={triggerTypeColors[template.trigger_type as keyof typeof triggerTypeColors] || "bg-gray-100 text-gray-800"}>
                            {template.trigger_type}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {template.integrations.slice(0, 3).map(integration => (
                            <Badge key={integration} variant="secondary" className="text-xs">
                              {integration}
                            </Badge>
                          ))}
                          {template.integrations.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{template.integrations.length - 3} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{Math.round((template.success_rate || 85))}%</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedTemplate(template)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>{template.name}</DialogTitle>
                                  <DialogDescription>
                                    {template.description}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-medium mb-2">Template Details</h4>
                                      <div className="space-y-2 text-sm">
                                        <div>Category: {template.category}</div>
                                        <div>Complexity: {template.complexity}</div>
                                        <div>Trigger: {template.trigger_type}</div>
                                        <div>Nodes: {(template.node_count || template.nodes || 0)}</div>
                                        <div>Success Rate: {Math.round((template.success_rate || 85))}%</div>
                                        <div>Used: {(template.usage_count || template.executions || 0)} times</div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium mb-2">Integrations</h4>
                                      <div className="flex flex-wrap gap-1">
                                        {template.integrations.map(integration => (
                                          <Badge key={integration} variant="secondary" className="text-xs">
                                            {integration}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Tags</h4>
                                    <div className="flex flex-wrap gap-1">
                                      {(template.tags || []).map(tag => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              onClick={() => deployTemplate(template.id)}
                              disabled={deployingTemplate === template.id}
                            >
                              {deployingTemplate === template.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              ) : (
                                <Download className="h-4 w-4 mr-1" />
                              )}
                              Deploy
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {!loading && sortedTemplates.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No templates found</h3>
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