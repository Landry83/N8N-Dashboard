"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { 
  Search, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  BarChart3, 
  Workflow, 
  Database,
  Mail,
  MessageSquare,
  Brain,
  Globe,
  Users,
  Calendar,
  FileText,
  Zap
} from "lucide-react"

// Mock data structure for n8n workflows
interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  complexity: 'beginner' | 'intermediate' | 'advanced'
  nodes: number
  integrations: string[]
  active: boolean
  executions: number
  lastExecuted?: string
}

const mockWorkflows: WorkflowTemplate[] = [
  {
    id: "1",
    name: "AI-Powered Gmail Agent",
    description: "Automatically process and respond to emails using OpenAI",
    category: "AI/ML",
    complexity: "intermediate",
    nodes: 8,
    integrations: ["Gmail", "OpenAI", "Slack"],
    active: true,
    executions: 342,
    lastExecuted: "2025-01-09T10:30:00Z"
  },
  {
    id: "2", 
    name: "Slack Bot with Memory",
    description: "Intelligent Slack bot with long-term memory storage",
    category: "Communication",
    complexity: "advanced",
    nodes: 12,
    integrations: ["Slack", "DeepSeek", "Qdrant"],
    active: true,
    executions: 156,
    lastExecuted: "2025-01-09T08:15:00Z"
  },
  {
    id: "3",
    name: "Customer Support Automation",
    description: "Automated customer support with AI categorization",
    category: "Communication",
    complexity: "intermediate",
    nodes: 10,
    integrations: ["Telegram", "OpenAI", "Airtable"],
    active: false,
    executions: 89,
    lastExecuted: "2025-01-08T16:45:00Z"
  },
  {
    id: "4",
    name: "Document Processing Pipeline",
    description: "Extract insights from PDFs and documents using AI",
    category: "PDF_and_Document_Processing",
    complexity: "advanced",
    nodes: 15,
    integrations: ["PDF Parser", "OpenAI", "Notion"],
    active: true,
    executions: 234,
    lastExecuted: "2025-01-09T09:20:00Z"
  }
]

const categoryIcons = {
  "AI/ML": Brain,
  "Communication": MessageSquare,
  "Database_and_Storage": Database,
  "Gmail_and_Email_Automation": Mail,
  "PDF_and_Document_Processing": FileText,
  "Productivity": Calendar,
  "Social_Media": Globe,
  "Other": Zap
}

const categoryColors = {
  "AI/ML": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Communication": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Database_and_Storage": "bg-green-500/20 text-green-300 border-green-500/30",
  "Gmail_and_Email_Automation": "bg-red-500/20 text-red-300 border-red-500/30",
  "PDF_and_Document_Processing": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Productivity": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Social_Media": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "Other": "bg-gray-500/20 text-gray-300 border-gray-500/30"
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>(mockWorkflows)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedComplexity, setSelectedComplexity] = useState<string>("all")

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || workflow.category === selectedCategory
    const matchesComplexity = selectedComplexity === "all" || workflow.complexity === selectedComplexity
    
    return matchesSearch && matchesCategory && matchesComplexity
  })

  const categories = Array.from(new Set(workflows.map(w => w.category)))
  const totalWorkflows = workflows.length
  const activeWorkflows = workflows.filter(w => w.active).length
  const totalExecutions = workflows.reduce((sum, w) => sum + w.executions, 0)

  const toggleWorkflow = (id: string) => {
    setWorkflows(workflows.map(w => 
      w.id === id ? { ...w, active: !w.active } : w
    ))
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

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
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">n8n Workflow Manager</h1>
            <p className="text-muted-foreground">Manage your comprehensive automation library</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
              <Workflow className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWorkflows}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeWorkflows}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((activeWorkflows / totalWorkflows) * 100)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalExecutions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
              <p className="text-xs text-muted-foreground">
                Across all templates
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
            <CardDescription>Find workflows by name, description, or category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workflows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Workflows Table */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Templates ({filteredWorkflows.length})</CardTitle>
            <CardDescription>Manage your n8n workflow library</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Complexity</TableHead>
                  <TableHead>Nodes</TableHead>
                  <TableHead>Integrations</TableHead>
                  <TableHead>Executions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkflows.map((workflow) => {
                  const CategoryIcon = categoryIcons[workflow.category as keyof typeof categoryIcons] || Zap
                  
                  return (
                    <TableRow key={workflow.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{workflow.name}</div>
                          <div className="text-sm text-muted-foreground">{workflow.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={categoryColors[workflow.category as keyof typeof categoryColors]}>
                          <CategoryIcon className="w-3 h-3 mr-1" />
                          {workflow.category.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getComplexityColor(workflow.complexity)}>
                          {workflow.complexity}
                        </Badge>
                      </TableCell>
                      <TableCell>{workflow.nodes}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {workflow.integrations.slice(0, 2).map(integration => (
                            <Badge key={integration} variant="secondary" className="text-xs">
                              {integration}
                            </Badge>
                          ))}
                          {workflow.integrations.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{workflow.integrations.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{workflow.executions}</TableCell>
                      <TableCell>
                        <Badge variant={workflow.active ? "default" : "secondary"}>
                          {workflow.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleWorkflow(workflow.id)}
                          >
                            {workflow.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 