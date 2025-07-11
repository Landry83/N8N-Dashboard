import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconMenu2, 
  IconX,
  IconDashboard,
  IconListDetails,
  IconFileAi,
  IconChartBar,
  IconDatabase
} from "@tabler/icons-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function SidebarDemoPage() {
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sidebar Demo</h1>
        <p className="text-muted-foreground">Interactive demonstration of the sidebar navigation component</p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconMenu2 className="h-5 w-5" />
              Sidebar Features
            </CardTitle>
            <CardDescription>
              Our sidebar component provides a comprehensive navigation experience with multiple sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Navigation Sections</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Main Navigation</Badge>
                  <Badge variant="secondary">Documents</Badge>
                  <Badge variant="secondary">Secondary Actions</Badge>
                  <Badge variant="secondary">User Profile</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Interactive Elements</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Collapsible</Badge>
                  <Badge variant="outline">Responsive</Badge>
                  <Badge variant="outline">Keyboard Navigation</Badge>
                  <Badge variant="outline">Tooltips</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconListDetails className="h-5 w-5" />
              Navigation Structure
            </CardTitle>
            <CardDescription>
              Complete breakdown of the sidebar navigation hierarchy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <IconDashboard className="h-4 w-4" />
                  Main Navigation
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded bg-accent/50">
                      <IconDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-accent/50">
                      <IconListDetails className="h-4 w-4" />
                      <span>Workflows</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-accent/50">
                      <IconFileAi className="h-4 w-4" />
                      <span>Templates</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded bg-accent/50">
                      <IconChartBar className="h-4 w-4" />
                      <span>Executions</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-accent/50">
                      <IconDatabase className="h-4 w-4" />
                      <span>Integrations</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Documents Section</h4>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    • Credentials - Manage authentication credentials
                  </div>
                  <div className="text-sm text-muted-foreground">
                    • System Health - Monitor system status
                  </div>
                  <div className="text-sm text-muted-foreground">
                    • Documentation - Access help and guides
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Secondary Actions</h4>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    • Settings - Configure application preferences
                  </div>
                  <div className="text-sm text-muted-foreground">
                    • Get Help - Access documentation and support
                  </div>
                  <div className="text-sm text-muted-foreground">
                    • Search - Find workflows, templates, and more
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sidebar Interactions</CardTitle>
            <CardDescription>
              Try these sidebar features while navigating the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Desktop Features</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <IconChevronLeft className="h-4 w-4" />
                    <span>Collapse sidebar</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <IconChevronRight className="h-4 w-4" />
                    <span>Expand sidebar</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    • Hover to show tooltips when collapsed
                  </div>
                  <div className="text-sm text-muted-foreground">
                    • Keyboard navigation support
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Mobile Features</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <IconMenu2 className="h-4 w-4" />
                    <span>Open sidebar overlay</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <IconX className="h-4 w-4" />
                    <span>Close sidebar overlay</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    • Touch-friendly navigation
                  </div>
                  <div className="text-sm text-muted-foreground">
                    • Swipe gestures supported
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Test the sidebar navigation by visiting different sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">Go to Dashboard</Button>
              <Button variant="outline" size="sm">View Workflows</Button>
              <Button variant="outline" size="sm">Browse Templates</Button>
              <Button variant="outline" size="sm">Check Executions</Button>
              <Button variant="outline" size="sm">Manage Settings</Button>
            </div>
          </CardContent>
        </Card>
        </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 