import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

export default function SearchPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-muted-foreground">Search across workflows, templates, and integrations</p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Search Everything</CardTitle>
            <CardDescription>Find workflows, templates, executions, and more</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search workflows, templates, integrations..." className="pl-10" />
              </div>
              <Button>Search</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Filters</CardTitle>
            <CardDescription>Filter your search by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">All</Badge>
              <Badge variant="outline">Workflows</Badge>
              <Badge variant="outline">Templates</Badge>
              <Badge variant="outline">Integrations</Badge>
              <Badge variant="outline">Executions</Badge>
              <Badge variant="outline">AI/ML</Badge>
              <Badge variant="outline">Communication</Badge>
              <Badge variant="outline">Database</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Searches</CardTitle>
            <CardDescription>Your recently searched items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded hover:bg-accent">
                <span className="text-sm">OpenAI workflows</span>
                <Badge variant="secondary">Template</Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded hover:bg-accent">
                <span className="text-sm">Slack integration</span>
                <Badge variant="secondary">Integration</Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded hover:bg-accent">
                <span className="text-sm">Failed executions</span>
                <Badge variant="secondary">Execution</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 