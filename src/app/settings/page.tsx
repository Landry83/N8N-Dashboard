import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function SettingsPage() {
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
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your N8N dashboard preferences and configuration</p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure general application preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <Toggle id="notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Toggle id="dark-mode" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-save">Auto-save Workflows</Label>
              <Toggle id="auto-save" defaultPressed />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>N8N Connection</CardTitle>
            <CardDescription>Configure your N8N server connection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="server-url">Server URL</Label>
              <Input id="server-url" placeholder="https://your-n8n-instance.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input id="api-key" type="password" placeholder="Enter your API key" />
            </div>
            <Button>Test Connection</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Workflow Settings</CardTitle>
            <CardDescription>Configure default workflow behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="error-notifications">Error Notifications</Label>
              <Toggle id="error-notifications" defaultPressed />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="execution-logging">Execution Logging</Label>
              <Toggle id="execution-logging" defaultPressed />
            </div>
          </CardContent>
        </Card>
        </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 