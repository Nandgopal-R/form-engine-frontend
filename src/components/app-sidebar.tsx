'use client'
import * as React from 'react'
import {
  BarChart3,
  ClipboardList,
  FileEdit,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
} from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import { NavMain } from '@/components/nav-main'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Editor',
      url: '/editor',
      icon: FileEdit,
    },
    {
      title: 'My Responses',
      url: '/my-responses',
      icon: ClipboardList,
    },
    {
      title: 'Analytics',
      url: '/analytics',
      icon: BarChart3,
      items: [
        {
          title: 'Overview',
          url: '/analytics',
        },
        {
          title: 'Responses',
          url: '/analytics/responses',
        },
        {
          title: 'Reports',
          url: '/analytics/reports',
        },
      ],
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()

  const userName = session?.user.name || session?.user.email || 'User'
  const userInitial = userName.charAt(0).toUpperCase()

  const handleLogout = async () => {
    await authClient.signOut()
    navigate({ to: '/signin' })
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Plus className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Form Builder</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {/* User Info */}
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="cursor-default hover:bg-transparent">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userName}</span>
                {session?.user.email && session.user.name && (
                  <span className="truncate text-xs text-muted-foreground">{session.user.email}</span>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* Logout Button */}
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="size-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
