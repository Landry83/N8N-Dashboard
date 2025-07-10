"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "N8N Admin",
    email: "admin@n8n.local",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Workflows",
      url: "/workflows",
      icon: IconListDetails,
    },
    {
      title: "Templates",
      url: "/templates",
      icon: IconFileAi,
    },
    {
      title: "Executions",
      url: "/executions",
      icon: IconChartBar,
    },
    {
      title: "Integrations",
      url: "/integrations",
      icon: IconDatabase,
    },
  ],
  navClouds: [
    {
      title: "AI/ML",
      icon: IconFileAi,
      isActive: true,
      url: "/templates?category=AI/ML",
      items: [
        {
          title: "OpenAI Workflows",
          url: "/templates?category=AI/ML&tag=openai",
        },
        {
          title: "AI Agents",
          url: "/templates?category=AI/ML&tag=agent",
        },
      ],
    },
    {
      title: "Communication",
      icon: IconUsers,
      url: "/templates?category=Communication",
      items: [
        {
          title: "Slack Integration",
          url: "/templates?category=Communication&tag=slack",
        },
        {
          title: "Email Automation",
          url: "/templates?category=Communication&tag=email",
        },
      ],
    },
    {
      title: "Database",
      icon: IconDatabase,
      url: "/templates?category=Database",
      items: [
        {
          title: "Data Sync",
          url: "/templates?category=Database&tag=sync",
        },
        {
          title: "Analytics",
          url: "/templates?category=Database&tag=analytics",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Credentials",
      url: "/credentials",
      icon: IconSettings,
    },
    {
      name: "System Health",
      url: "/system",
      icon: IconReport,
    },
    {
      name: "Documentation",
      url: "/docs",
      icon: IconFileDescription,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">N8N Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
