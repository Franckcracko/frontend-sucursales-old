"use client"

import * as React from "react"
import { ChevronsUpDown, Check } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useBranchSelected } from "@/store/use-branch-store"
import { cn } from "@/lib/utils"

export function TeamSwitcher({
  branches,
}: {
  branches: string[]
}) {
  const { isMobile } = useSidebar()

  const branch = useBranchSelected(state => state.branch)
  const setBranch = useBranchSelected(state => state.setBranch)

  if (!branch) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="sm"
              className="w-full h-9 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all duration-150 hover:bg-sidebar-accent/80"
            >
              <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <span className="text-[10px] font-bold">{branch.charAt(0)}</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{branch}</span>
                <span className="truncate text-xs text-muted-foreground">
                  Cambiar sucursal
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg shadow-md"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={8}
          >
            <DropdownMenuLabel className="text-muted-foreground text-[10px] uppercase tracking-wider">
              Sucursales
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {branches.map((b) => (
              <DropdownMenuItem
                key={b}
                onClick={() => setBranch(b)}
                className={cn(
                  "gap-2 p-2 cursor-pointer",
                  b === branch && "bg-sidebar-accent"
                )}
              >
                <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-muted">
                  <span className="text-[10px] font-bold">{b.charAt(0)}</span>
                </div>
                <span className="flex-1">{b}</span>
                {b === branch && <Check className="size-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}