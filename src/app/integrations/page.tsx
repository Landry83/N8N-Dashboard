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
  ExternalLink, 
  Star, 
  Globe, 
  Database, 
  Cloud, 
  MessageSquare,
  Mail,
  Calendar,
  FileText,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
  Zap,
  Loader2,
  AlertCircle,
  CheckCircle,
  Building,
  Smartphone,
  Camera,
  Music,
  Video,
  Code,
  Briefcase,
  Heart,
  TrendingUp,
  Shield,
  Palette,
  Headphones,
  BookOpen,
  MapPin,
  Truck,
  CreditCard,
  Megaphone,
  GitBranch,
  Bot,
  Cpu,
  Workflow
} from "lucide-react";
import { MCPClient } from "@/lib/mcp-client";
import { useToast } from "@/hooks/use-toast";

interface Integration {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  icon?: string;
  color?: string;
  isPremium: boolean;
  isPopular: boolean;
  nodeCount: number;
  version: string;
  lastUpdated: string;
  documentation?: string;
  website?: string;
  tags: string[];
  rating?: number;
  usageCount?: number;
}

const categoryIcons = {
  'Communication': MessageSquare,
  'Database': Database,
  'Cloud Storage': Cloud,
  'Email': Mail,
  'Calendar': Calendar,
  'Document': FileText,
  'E-commerce': ShoppingCart,
  'Analytics': BarChart3,
  'CRM': Users,
  'Productivity': Settings,
  'Automation': Zap,
  'Social Media': Globe,
  'Finance': CreditCard,
  'Marketing': Megaphone,
  'Development': Code,
  'AI/ML': Bot,
  'Security': Shield,
  'Design': Palette,
  'Media': Camera,
  'Music': Music,
  'Video': Video,
  'Business': Briefcase,
  'Health': Heart,
  'Education': BookOpen,
  'Travel': MapPin,
  'Logistics': Truck,
  'Mobile': Smartphone,
  'Audio': Headphones,
  'Location': MapPin,
  'Version Control': GitBranch,
  'Infrastructure': Cpu,
  'Workflow': Workflow
};

const categoryColors = {
  'Communication': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Database': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Cloud Storage': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'Email': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'Calendar': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'Document': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'E-commerce': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  'Analytics': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  'CRM': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  'Productivity': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  'Automation': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
  'Social Media': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
  'Finance': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  'Marketing': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  'Development': 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300',
  'AI/ML': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  'Security': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'Design': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  'Media': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Music': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'Video': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'Business': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  'Health': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Education': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Travel': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  'Logistics': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'Mobile': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  'Audio': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
  'Location': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Version Control': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  'Infrastructure': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Workflow': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showPopularOnly, setShowPopularOnly] = useState(false);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const { toast } = useToast();

  const mcpClient = new MCPClient();

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const response = await mcpClient.listIntegrations();
      setIntegrations(response);
    } catch (error) {
      console.error('Error loading integrations:', error);
      toast({
        title: "Error",
        description: "Failed to load integrations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = !searchQuery || 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || integration.category === categoryFilter;
    const matchesPopular = !showPopularOnly || integration.isPopular;
    const matchesPremium = !showPremiumOnly || integration.isPremium;
    
    return matchesSearch && matchesCategory && matchesPopular && matchesPremium;
  });

  const sortedIntegrations = [...filteredIntegrations].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.displayName || '').localeCompare(b.displayName || '');
      case 'category':
        return (a.category || '').localeCompare(b.category || '');
      case 'popularity':
        return (b.usageCount || 0) - (a.usageCount || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'updated':
        return new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime();
      default:
        return 0;
    }
  });

  const categories = Array.from(new Set(integrations.map(i => i.category))).sort();
  const totalIntegrations = integrations.length;
  const popularIntegrations = integrations.filter(i => i.isPopular).length;
  const premiumIntegrations = integrations.filter(i => i.isPremium).length;

  const renderIntegrationCard = (integration: Integration) => {
    const CategoryIcon = categoryIcons[integration.category as keyof typeof categoryIcons] || Settings;
    const categoryColor = categoryColors[integration.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800';

    return (
      <Card key={integration.id} className="hover:shadow-lg transition-all duration-200 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${categoryColor}`}>
                <CategoryIcon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {integration.displayName}
                </CardTitle>
                <CardDescription className="text-sm">
                  {integration.category}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {integration.isPopular && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Star className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
              {integration.isPremium && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {integration.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span>{integration.nodeCount} nodes</span>
            <span>v{integration.version}</span>
            {integration.rating && (
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{integration.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {integration.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {integration.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{integration.tags.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {integration.documentation && (
                <Button variant="outline" size="sm" asChild>
                  <a href={integration.documentation} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-1" />
                    Docs
                  </a>
                </Button>
              )}
              {integration.website && (
                <Button variant="outline" size="sm" asChild>
                  <a href={integration.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Website
                  </a>
                </Button>
              )}
            </div>
            <Button size="sm">
              <Zap className="h-4 w-4 mr-1" />
              Use
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderIntegrationList = (integration: Integration) => {
    const CategoryIcon = categoryIcons[integration.category as keyof typeof categoryIcons] || Settings;
    const categoryColor = categoryColors[integration.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800';

    return (
      <Card key={integration.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${categoryColor}`}>
                <CategoryIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">{integration.displayName}</h3>
                <p className="text-sm text-muted-foreground">{integration.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className={categoryColor}>
                {integration.category}
              </Badge>
              
              <div className="text-right">
                <p className="text-sm font-medium">{integration.nodeCount} nodes</p>
                <p className="text-xs text-muted-foreground">v{integration.version}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                {integration.isPopular && (
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                )}
                {integration.isPremium && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Premium
                  </Badge>
                )}
              </div>
              
              <Button size="sm">
                <Zap className="h-4 w-4 mr-1" />
                Use
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

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
              <h1 className="text-3xl font-bold">Integration Catalog</h1>
              <p className="text-muted-foreground">
                Discover and connect with {totalIntegrations}+ integrations
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadIntegrations}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalIntegrations}</div>
                <p className="text-xs text-muted-foreground">
                  Available services
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Popular</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{popularIntegrations}</div>
                <p className="text-xs text-muted-foreground">
                  Most used
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{premiumIntegrations}</div>
                <p className="text-xs text-muted-foreground">
                  Enterprise features
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
                <p className="text-xs text-muted-foreground">
                  Different types
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]">
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

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="updated">Last Updated</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPopularOnly}
                    onChange={(e) => setShowPopularOnly(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Popular only</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPremiumOnly}
                    onChange={(e) => setShowPremiumOnly(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Premium only</span>
                </label>
              </div>

              <div className="flex items-center space-x-2 ml-auto">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
              </div>
            </div>
          </div>

          {/* Integrations */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading integrations...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedIntegrations.map(renderIntegrationCard)}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedIntegrations.map(renderIntegrationList)}
                  </div>
                )}
              </div>
            )}

            {!loading && sortedIntegrations.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No integrations found</h3>
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