"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Brain,
  FileText,
  BarChart3,
  Globe,
  Home,
  Workflow,
  Zap,
  Play,
  Shield,
  Settings,
  Search,
  Plus,
  Upload,
  RefreshCw,
  Sun,
  Bot,
  MessageSquare,
  X,
  Activity,
  Code,
  HelpCircle,
  ChevronRight,
  Hash,
  Clock,
  Database,
  Mail,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command"

interface CommandPaletteProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const router = useRouter()
  const [input, setInput] = React.useState("")

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, setOpen])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [setOpen])

  const categories = [
    {
      name: "Navigation",
      items: [
        {
          name: "Home",
          description: "Go to the home page",
          icon: Home,
          shortcut: "⌘H",
          onSelect: () => runCommand(() => router.push("/")),
        },
        {
          name: "Dashboard",
          description: "Main dashboard with analytics and overview",
          icon: BarChart3,
          shortcut: "⌘D",
          onSelect: () => runCommand(() => router.push("/dashboard")),
        },
        {
          name: "Workflows",
          description: "Manage your n8n workflows",
          icon: Workflow,
          shortcut: "⌘W",
          onSelect: () => runCommand(() => router.push("/workflows")),
        },
        {
          name: "Templates",
          description: "Browse and deploy 3,807+ workflow templates",
          icon: FileText,
          shortcut: "⌘T",
          onSelect: () => runCommand(() => router.push("/templates")),
        },
        {
          name: "Integrations",
          description: "View available integrations and services",
          icon: Zap,
          shortcut: "⌘I",
          onSelect: () => runCommand(() => router.push("/integrations")),
        },
        {
          name: "Executions",
          description: "Monitor workflow executions and history",
          icon: Play,
          shortcut: "⌘E",
          onSelect: () => runCommand(() => router.push("/executions")),
        },
        {
          name: "Credentials",
          description: "Manage your API credentials and connections",
          icon: Shield,
          shortcut: "⌘C",
          onSelect: () => runCommand(() => router.push("/credentials")),
        },
        {
          name: "Search",
          description: "Search across workflows, templates, and integrations",
          icon: Search,
          shortcut: "⌘S",
          onSelect: () => runCommand(() => router.push("/search")),
        },
        {
          name: "Documentation",
          description: "Learn how to use n8n and manage workflows",
          icon: FileText,
          shortcut: "⌘?",
          onSelect: () => runCommand(() => router.push("/docs")),
        },
        {
          name: "System Health",
          description: "Monitor system status and performance",
          icon: Activity,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/system")),
        },
      ],
    },
    {
      name: "Quick Actions",
      items: [
        {
          name: "Create New Workflow",
          description: "Start building a new automation workflow",
          icon: Plus,
          shortcut: "⌘N",
          onSelect: () => runCommand(() => router.push("/workflows?action=new")),
        },
        {
          name: "Deploy Template",
          description: "Deploy a template to your n8n instance",
          icon: Upload,
          shortcut: "⌘⇧D",
          onSelect: () => runCommand(() => router.push("/templates")),
        },
        {
          name: "Test Connection",
          description: "Test connection to n8n API",
          icon: Globe,
          shortcut: "⌘⇧T",
          onSelect: () => runCommand(() => {
            // Call the test API endpoint
            fetch('/api/test-mcp')
              .then(response => response.json())
              .then(data => {
                if (data.success) {
                  alert('Connection successful!')
                } else {
                  alert('Connection failed: ' + data.error)
                }
              })
              .catch(error => {
                alert('Connection test failed: ' + error.message)
              })
          }),
        },
        {
          name: "Refresh Data",
          description: "Refresh all data and reload the page",
          icon: RefreshCw,
          shortcut: "⌘R",
          onSelect: () => runCommand(() => window.location.reload()),
        },
        {
          name: "Toggle Theme",
          description: "Switch between light and dark theme",
          icon: Sun,
          shortcut: "⌘⇧L",
          onSelect: () => runCommand(() => {
            document.documentElement.classList.toggle("dark")
          }),
        },
      ],
    },
    {
      name: "Workflow Management",
      items: [
        {
          name: "List All Workflows",
          description: "View all workflows in your n8n instance",
          icon: Workflow,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/workflows")),
        },
        {
          name: "Active Workflows Only",
          description: "Filter to show only active workflows",
          icon: Play,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/workflows?filter=active")),
        },
        {
          name: "Recent Executions",
          description: "View recent workflow executions",
          icon: Clock,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/executions?time=recent")),
        },
        {
          name: "Failed Executions",
          description: "View failed workflow executions",
          icon: X,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/executions?status=error")),
        },
      ],
    },
    {
      name: "Template Categories",
      items: [
        {
          name: "AI/ML Templates",
          description: "1,996+ AI and machine learning workflows",
          icon: Brain,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/templates?category=AI/ML")),
        },
        {
          name: "Communication Templates",
          description: "562+ communication and messaging workflows",
          icon: MessageSquare,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/templates?category=Communication")),
        },
        {
          name: "Database Templates",
          description: "183+ database and storage workflows",
          icon: Database,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/templates?category=Database")),
        },
        {
          name: "Email Templates",
          description: "Gmail automation and email workflows",
          icon: Mail,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/templates?category=Email")),
        },
      ],
    },
    {
      name: "Popular Searches",
      items: [
        {
          name: "OpenAI Workflows",
          description: "AI-powered workflows using OpenAI",
          icon: Bot,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/templates?search=openai")),
        },
        {
          name: "Slack Integration",
          description: "Slack messaging and bot workflows",
          icon: MessageSquare,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/integrations?search=slack")),
        },
        {
          name: "Gmail Automation",
          description: "Email automation and processing",
          icon: Mail,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/templates?search=gmail")),
        },
        {
          name: "Discord Bots",
          description: "Discord bot and automation workflows",
          icon: Bot,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/templates?search=discord")),
        },
      ],
    },
    {
      name: "System & Admin",
      items: [
        {
          name: "System Health Check",
          description: "Check n8n system status and connectivity",
          icon: Activity,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/system")),
        },
        {
          name: "API Documentation",
          description: "View API documentation and usage",
          icon: Code,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/docs")),
        },
        {
          name: "Credential Management",
          description: "Manage API keys and authentication",
          icon: Shield,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/credentials")),
        },
        {
          name: "Integration Catalog",
          description: "Browse 365+ available integrations",
          icon: Globe,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/integrations")),
        },
      ],
    },
  ]

  const filteredCategories = React.useMemo(() => {
    if (!input.trim()) return categories

    return categories.map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.name.toLowerCase().includes(input.toLowerCase()) ||
        item.description.toLowerCase().includes(input.toLowerCase())
      )
    })).filter(category => category.items.length > 0)
  }, [input])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search for commands, pages, and more..."
        value={input}
        onValueChange={setInput}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {filteredCategories.map((category, index) => (
          <React.Fragment key={category.name}>
            <CommandGroup heading={category.name}>
              {category.items.map((item) => (
                <CommandItem key={item.name} onSelect={item.onSelect}>
                  <item.icon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                  {item.shortcut && (
                    <CommandShortcut>{item.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            {index < filteredCategories.length - 1 && <CommandSeparator />}
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  )
}

export default function CommandPaletteWrapper() {
  const [open, setOpen] = React.useState(false)

  return <CommandPalette open={open} setOpen={setOpen} />
}

export function useCommandPalette() {
  const [open, setOpen] = React.useState(false)

  return {
    open,
    setOpen,
    CommandPalette: () => <CommandPalette open={open} setOpen={setOpen} />,
  }
} 