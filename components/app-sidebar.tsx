"use client"

import {
  IconDashboard,
  IconListDetails,
  IconTransfer,
  IconUser,
  IconBox,
  IconReport,
  IconCash,
  IconUsers,
  IconCar,
  IconScissors,
  IconBuildingStore
} from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { branches } from "@/data/branches"

const navItems = [
  {
    title: "Inicio",
    url: "/",
    icon: IconDashboard,
  },
  {
    title: "Productos por Venta",
    url: "/products",
    icon: IconListDetails,
  },
  {
    title: "Tickets por Venta",
    url: "/sales",
    icon: IconListDetails,
  },
  {
    title: "Cortes",
    url: "/sales/cortes",
    icon: IconScissors,
  },
  {
    title: "Catalogo de Productos",
    url: "/catalog",
    icon: IconBox,
  },
  {
    title: "Cobranza",
    url: "/cobranza",
    icon: IconCash,
  },
  {
    title: "Inventario Sucursales",
    url: "/inventory-branches",
    icon: IconBuildingStore,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const isActive = (url: string) => {
    if (url === "/") return pathname === "/"
    return pathname.startsWith(url)
  }

  return (
    <Sidebar collapsible="offcanvas" className="border-r-0" {...props}>
      <SidebarHeader className="border-b border-sidebar-border/50">
        <div className="flex flex-col gap-3 px-3 py-4">
          <div className="flex items-center gap-3 px-1">
            <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-lg">
              <img
                src="/logo.jpg"
                alt="Vaqueros, Arrachera y Algo Mas"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold tracking-tight">Vaqueros</span>
              <span className="text-xs text-muted-foreground">Reportes</span>
            </div>
          </div>
          <TeamSwitcher branches={branches} />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup className="p-0">
          <SidebarGroupContent className="flex flex-col gap-1">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.url)}
                  className={cn(
                    "h-10 px-3 transition-all duration-150",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive(item.url) && "bg-sidebar-primary/10 text-sidebar-primary font-medium"
                  )}
                >
                  <Link href={item.url}>
                    <item.icon className="size-[18px] shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto border-t border-sidebar-border/50 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Plataforma de Reportes</span>
        </div>
      </div>
    </Sidebar>
  )
}