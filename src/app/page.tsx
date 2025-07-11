import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto p-8 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">shadcn/ui Demo</h1>
            <p className="text-muted-foreground">
              A collection of beautiful, accessible components built with Radix UI and Tailwind CSS.
            </p>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🎯</span>
                Command Palette
              </CardTitle>
              <CardDescription>
                Press <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded">⌘ K</kbd> (Mac) or <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded">Ctrl K</kbd> (Windows/Linux) to open the command palette
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  The command palette lets you quickly navigate between pages, trigger actions, and search through all content. Try it now!
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => {
                    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
                    document.dispatchEvent(event);
                  }}>
                    Open Command Palette
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Button Components</CardTitle>
              <CardDescription>
                Various button styles and variants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Components</CardTitle>
              <CardDescription>
                Input fields and form elements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" />
              </div>
              <Button className="w-full">Sign In</Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                How to use shadcn/ui components in your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">n8n Workflow Manager:</h3>
                  <p className="text-sm mb-3">Manage your comprehensive workflow library with visual controls and statistics.</p>
                  <Button asChild>
                    <a href="/workflows">Open Workflow Dashboard</a>
                  </Button>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Dashboard Features:</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Browse 3,807+ workflow templates</li>
                    <li>• Search and filter by category</li>
                    <li>• Deploy workflows to n8n</li>
                    <li>• Track execution statistics</li>
                    <li>• Abyss theme for dark mode</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
    </div>
  )
}
