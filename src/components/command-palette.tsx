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
      name: "Selecting Models",
      items: [
        {
          name: "Thinking models",
          description: "or want the model to act more independently. Thinking models are",
          icon: Brain,
          shortcut: "#",
          onSelect: () => runCommand(() => router.push("/models/thinking")),
        },
      ],
    },
    {
      name: "Working with Documentation",
      items: [
        {
          name: "Accessing internal docs with MCP",
          description: "and systems into Cursor. MCP acts as a thin layer",
          icon: FileText,
          shortcut: "#",
          onSelect: () => runCommand(() => router.push("/docs/mcp")),
        },
      ],
    },
    {
      name: "Documentation",
      items: [
        {
          name: "Dashboard",
          description: "The dashboard lets you access billing, set up usage-based pricing, and manage your Team.",
          icon: BarChart3,
          shortcut: "#",
          onSelect: () => runCommand(() => router.push("/dashboard")),
        },
      ],
    },
    {
      name: "Tools",
      items: [
        {
          name: "Web",
          description: "Generate search queries and perform web searches.",
          icon: Globe,
          shortcut: "#",
          onSelect: () => runCommand(() => router.push("/tools/web")),
        },
      ],
    },
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
          name: "Workflows",
          description: "Manage your n8n workflows",
          icon: Workflow,
          shortcut: "⌘W",
          onSelect: () => runCommand(() => router.push("/workflows")),
        },
        {
          name: "Templates",
          description: "Browse workflow templates",
          icon: FileText,
          shortcut: "⌘T",
          onSelect: () => runCommand(() => router.push("/templates")),
        },
        {
          name: "Integrations",
          description: "View available integrations",
          icon: Zap,
          shortcut: "⌘I",
          onSelect: () => runCommand(() => router.push("/integrations")),
        },
        {
          name: "Executions",
          description: "View workflow executions",
          icon: Play,
          shortcut: "⌘E",
          onSelect: () => runCommand(() => router.push("/executions")),
        },
        {
          name: "Credentials",
          description: "Manage your credentials",
          icon: Shield,
          shortcut: "⌘C",
          onSelect: () => runCommand(() => router.push("/credentials")),
        },
        {
          name: "Settings",
          description: "Application settings",
          icon: Settings,
          shortcut: "⌘,",
          onSelect: () => runCommand(() => router.push("/settings")),
        },
        {
          name: "Search",
          description: "Search everything",
          icon: Search,
          shortcut: "⌘K",
          onSelect: () => runCommand(() => router.push("/search")),
        },
      ],
    },
    {
      name: "Actions",
      items: [
        {
          name: "Create New Workflow",
          description: "Create a new workflow from scratch",
          icon: Plus,
          shortcut: "⌘N",
          onSelect: () => runCommand(() => router.push("/workflows/new")),
        },
        {
          name: "Deploy Template",
          description: "Deploy a template to your n8n instance",
          icon: Upload,
          shortcut: "⌘D",
          onSelect: () => runCommand(() => router.push("/templates")),
        },
        {
          name: "Refresh Data",
          description: "Refresh all data",
          icon: RefreshCw,
          shortcut: "⌘R",
          onSelect: () => runCommand(() => window.location.reload()),
        },
        {
          name: "Toggle Theme",
          description: "Switch between light and dark theme",
          icon: Sun,
          shortcut: "⌘⇧T",
          onSelect: () => runCommand(() => {
            const theme = document.documentElement.classList.contains("dark") ? "light" : "dark"
            document.documentElement.classList.toggle("dark")
          }),
        },
      ],
    },
    {
      name: "Recent",
      items: [
        {
          name: "OpenAI Workflows",
          description: "Recently searched",
          icon: Bot,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/templates?search=openai")),
        },
        {
          name: "Slack Integration",
          description: "Recently viewed",
          icon: MessageSquare,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/integrations?search=slack")),
        },
        {
          name: "Failed Executions",
          description: "Recently filtered",
          icon: X,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/executions?status=failed")),
        },
      ],
    },
    {
      name: "System",
      items: [
        {
          name: "System Status",
          description: "View system health",
          icon: Activity,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/system")),
        },
        {
          name: "API Documentation",
          description: "View API docs",
          icon: Code,
          shortcut: "",
          onSelect: () => runCommand(() => router.push("/docs")),
        },
        {
          name: "Help & Support",
          description: "Get help",
          icon: HelpCircle,
          shortcut: "⌘?",
          onSelect: () => runCommand(() => router.push("/help")),
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