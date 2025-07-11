"use client";
import React from "react";import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Plus, 
  RefreshCw, 
  Key, 
  Shield, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Loader2,
  Settings,
  Cloud,
  Database,
  Mail,
  MessageSquare,
  Globe,
  Bot,
  CreditCard,
  Calendar,
  FileText,
  Users,
  Lock,
  Zap
} from "lucide-react";
import { MCPClient } from "@/lib/mcp-client";
import { useToast } from "@/hooks/use-toast";

interface Credential {
  id: string;
  name: string;
  type: string;
  nodeType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  usedByWorkflows: number;
  description?: string;
  data?: any;
  isValid?: boolean;
}

interface CredentialTemplate {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  icon: string;
  fields: Array<{
    name: string;
    displayName: string;
    type: 'string' | 'password' | 'number' | 'boolean' | 'json';
    required: boolean;
    description?: string;
    placeholder?: string;
    default?: any;
  }>;
  documentation?: string;
  setupGuide?: string;
}

const credentialTypeIcons = {
  'OAuth2': Shield,
  'API Key': Key,
  'Basic Auth': Lock,
  'JWT': Settings,
  'Database': Database,
  'Email': Mail,
  'Cloud': Cloud,
  'Social': Globe,
  'AI': Bot,
  'Payment': CreditCard,
  'Calendar': Calendar,
  'Document': FileText,
  'CRM': Users,
  'Communication': MessageSquare,
  'Automation': Zap
};

const credentialTypeColors = {
  'OAuth2': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'API Key': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Basic Auth': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'JWT': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'Database': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  'Email': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'Cloud': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  'Social': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  'AI': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
  'Payment': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  'Calendar': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'Document': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  'CRM': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  'Communication': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
  'Automation': 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300'
};

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [credentialTemplates, setCredentialTemplates] = useState<CredentialTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CredentialTemplate | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  const mcpClient = new MCPClient();

  useEffect(() => {
    loadCredentials();
    loadCredentialTemplates();
  }, []);

  const loadCredentials = async () => {
    try {
      setLoading(true);
      // Mock data for now - in real implementation, this would call the MCP server
      const mockCredentials: Credential[] = [
        {
          id: '1',
          name: 'Gmail OAuth2',
          type: 'OAuth2',
          nodeType: 'Gmail',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          usedByWorkflows: 3,
          description: 'Gmail OAuth2 credentials for email automation',
          isValid: true
        },
        {
          id: '2',
          name: 'OpenAI API Key',
          type: 'API Key',
          nodeType: 'OpenAI',
          isActive: true,
          createdAt: '2024-01-10T14:20:00Z',
          updatedAt: '2024-01-10T14:20:00Z',
          usedByWorkflows: 8,
          description: 'OpenAI API key for AI-powered workflows',
          isValid: true
        },
        {
          id: '3',
          name: 'Slack Bot Token',
          type: 'API Key',
          nodeType: 'Slack',
          isActive: false,
          createdAt: '2024-01-08T09:15:00Z',
          updatedAt: '2024-01-08T09:15:00Z',
          usedByWorkflows: 1,
          description: 'Slack bot token for workspace integration',
          isValid: false
        }
      ];
      setCredentials(mockCredentials);
    } catch (error) {
      console.error('Error loading credentials:', error);
      toast({
        title: "Error",
        description: "Failed to load credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCredentialTemplates = async () => {
    try {
      // Mock credential templates
      const mockTemplates: CredentialTemplate[] = [
        {
          id: 'gmail-oauth2',
          name: 'gmail-oauth2',
          displayName: 'Gmail OAuth2',
          description: 'OAuth2 credentials for Gmail integration',
          category: 'Email',
          icon: 'Mail',
          fields: [
            { name: 'clientId', displayName: 'Client ID', type: 'string', required: true, description: 'OAuth2 Client ID from Google Console' },
            { name: 'clientSecret', displayName: 'Client Secret', type: 'password', required: true, description: 'OAuth2 Client Secret from Google Console' },
            { name: 'refreshToken', displayName: 'Refresh Token', type: 'password', required: true, description: 'OAuth2 Refresh Token' }
          ],
          documentation: 'https://docs.n8n.io/integrations/builtin/credentials/gmail/',
          setupGuide: 'https://docs.n8n.io/integrations/builtin/credentials/gmail/#setup'
        },
        {
          id: 'openai-api',
          name: 'openai-api',
          displayName: 'OpenAI API',
          description: 'API key for OpenAI services',
          category: 'AI',
          icon: 'Bot',
          fields: [
            { name: 'apiKey', displayName: 'API Key', type: 'password', required: true, description: 'Your OpenAI API key', placeholder: 'sk-...' },
            { name: 'organization', displayName: 'Organization ID', type: 'string', required: false, description: 'Optional organization ID' }
          ],
          documentation: 'https://docs.n8n.io/integrations/builtin/credentials/openai/',
          setupGuide: 'https://platform.openai.com/api-keys'
        },
        {
          id: 'slack-oauth2',
          name: 'slack-oauth2',
          displayName: 'Slack OAuth2',
          description: 'OAuth2 credentials for Slack integration',
          category: 'Communication',
          icon: 'MessageSquare',
          fields: [
            { name: 'clientId', displayName: 'Client ID', type: 'string', required: true, description: 'Slack App Client ID' },
            { name: 'clientSecret', displayName: 'Client Secret', type: 'password', required: true, description: 'Slack App Client Secret' },
            { name: 'accessToken', displayName: 'Access Token', type: 'password', required: true, description: 'OAuth Access Token' }
          ],
          documentation: 'https://docs.n8n.io/integrations/builtin/credentials/slack/',
          setupGuide: 'https://api.slack.com/apps'
        }
      ];
      setCredentialTemplates(mockTemplates);
    } catch (error) {
      console.error('Error loading credential templates:', error);
    }
  };

  const createCredential = async () => {
    try {
      // Mock implementation
      const newCredential: Credential = {
        id: Date.now().toString(),
        name: formData.name,
        type: selectedTemplate?.category || 'API Key',
        nodeType: selectedTemplate?.displayName || 'Custom',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usedByWorkflows: 0,
        description: formData.description,
        isValid: true
      };
      
      setCredentials([...credentials, newCredential]);
      setShowCreateDialog(false);
      setFormData({});
      setSelectedTemplate(null);
      
      toast({
        title: "Success",
        description: "Credential created successfully",
      });
    } catch (error) {
      console.error('Error creating credential:', error);
      toast({
        title: "Error",
        description: "Failed to create credential. Please try again.",
        variant: "destructive",
      });
    }
  };

  const testCredential = async (credential: Credential) => {
    try {
      // Mock test implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update credential validity
      setCredentials(credentials.map(c => 
        c.id === credential.id ? { ...c, isValid: true } : c
      ));
      
      toast({
        title: "Success",
        description: "Credential test passed",
      });
    } catch (error) {
      console.error('Error testing credential:', error);
      toast({
        title: "Error",
        description: "Credential test failed. Please check your configuration.",
        variant: "destructive",
      });
    }
  };

  const deleteCredential = async (credentialId: string) => {
    try {
      setCredentials(credentials.filter(c => c.id !== credentialId));
      setShowDeleteDialog(false);
      setSelectedCredential(null);
      
      toast({
        title: "Success",
        description: "Credential deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting credential:', error);
      toast({
        title: "Error",
        description: "Failed to delete credential. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredCredentials = credentials.filter(credential => {
    const matchesSearch = !searchQuery || 
      credential.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      credential.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      credential.nodeType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || credential.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && credential.isActive) ||
      (statusFilter === 'inactive' && !credential.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const credentialTypes = Array.from(new Set(credentials.map(c => c.type))).sort();
  const totalCredentials = credentials.length;
  const activeCredentials = credentials.filter(c => c.isActive).length;
  const validCredentials = credentials.filter(c => c.isValid).length;

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const renderCredentialForm = (template: CredentialTemplate) => {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Credential Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={`My ${template.displayName}`}
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description of this credential"
          />
        </div>

        {template.fields.map((field) => (
          <div key={field.name}>
            <Label htmlFor={field.name}>
              {field.displayName}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="relative">
              <Input
                id={field.name}
                type={field.type === 'password' && !showPasswords[field.name] ? 'password' : 'text'}
                value={formData[field.name] || ''}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                placeholder={field.placeholder}
                required={field.required}
              />
              {field.type === 'password' && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => togglePasswordVisibility(field.name)}
                >
                  {showPasswords[field.name] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              )}
            </div>
            {field.description && (
              <p className="text-sm text-muted-foreground mt-1">{field.description}</p>
            )}
          </div>
        ))}

        {template.setupGuide && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm">
              Need help setting up? Check out the{' '}
              <a 
                href={template.setupGuide} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                setup guide
              </a>
            </p>
          </div>
        )}
      </div>
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
              <h1 className="text-3xl font-bold">Credentials</h1>
              <p className="text-muted-foreground">
                Manage your API keys, OAuth tokens, and other credentials
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadCredentials}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Credential
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Credential</DialogTitle>
                    <DialogDescription>
                      {selectedTemplate ? `Configure your ${selectedTemplate.displayName} credential` : 'Select a credential type to get started'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  {!selectedTemplate ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search credential types..."
                          className="pl-10"
                        />
                      </div>
                      
                      <ScrollArea className="h-96">
                        <div className="grid grid-cols-1 gap-3">
                          {credentialTemplates.map((template) => {
                            const Icon = credentialTypeIcons[template.category as keyof typeof credentialTypeIcons] || Settings;
                            const colorClass = credentialTypeColors[template.category as keyof typeof credentialTypeColors] || 'bg-gray-100 text-gray-800';
                            
                            return (
                              <Card 
                                key={template.id} 
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => setSelectedTemplate(template)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${colorClass}`}>
                                      <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium">{template.displayName}</h3>
                                      <p className="text-sm text-muted-foreground">{template.description}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${credentialTypeColors[selectedTemplate.category as keyof typeof credentialTypeColors] || 'bg-gray-100 text-gray-800'}`}>
                            {React.createElement(credentialTypeIcons[selectedTemplate.category as keyof typeof credentialTypeIcons] || Settings, { className: 'h-5 w-5' })}
                          </div>
                          <div>
                            <h3 className="font-medium">{selectedTemplate.displayName}</h3>
                            <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedTemplate(null)}>
                          Back
                        </Button>
                      </div>
                      
                      {renderCredentialForm(selectedTemplate)}
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={createCredential}>
                          Create Credential
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Credentials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCredentials}</div>
                <p className="text-xs text-muted-foreground">
                  Configured
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{activeCredentials}</div>
                <p className="text-xs text-muted-foreground">
                  In use
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Valid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{validCredentials}</div>
                <p className="text-xs text-muted-foreground">
                  Tested & working
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{credentialTypes.length}</div>
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
                  placeholder="Search credentials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {credentialTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Credentials List */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading credentials...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCredentials.map((credential) => {
                  const TypeIcon = credentialTypeIcons[credential.type as keyof typeof credentialTypeIcons] || Key;
                  const typeColor = credentialTypeColors[credential.type as keyof typeof credentialTypeColors] || 'bg-gray-100 text-gray-800';
                  
                  return (
                    <Card key={credential.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-lg ${typeColor}`}>
                              <TypeIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium">{credential.name}</h3>
                                {credential.isValid ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {credential.nodeType} • {credential.type}
                              </p>
                              {credential.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {credential.description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <Badge variant={credential.isActive ? "default" : "secondary"}>
                                {credential.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-1">
                                Used by {credential.usedByWorkflows} workflows
                              </p>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => testCredential(credential)}
                              >
                                <Shield className="h-4 w-4 mr-1" />
                                Test
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedCredential(credential);
                                  setShowEditDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedCredential(credential);
                                  setShowDeleteDialog(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {!loading && filteredCredentials.length === 0 && (
              <div className="text-center py-12">
                <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No credentials found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or create a new credential.
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Credential
                </Button>
              </div>
            )}
          </div>

          {/* Delete Confirmation Dialog */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Credential</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{selectedCredential?.name}"? This action cannot be undone.
                  {selectedCredential?.usedByWorkflows && selectedCredential.usedByWorkflows > 0 && (
                    <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        <strong>Warning:</strong> This credential is used by {selectedCredential.usedByWorkflows} workflow(s). 
                        Deleting it may cause those workflows to fail.
                      </p>
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => selectedCredential && deleteCredential(selectedCredential.id)}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 