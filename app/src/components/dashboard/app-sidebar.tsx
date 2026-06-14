import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Users,
  FileBarChart2,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/reports", label: "Reports", icon: FileBarChart2 },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="h-16 border-b flex items-center px-6">
        <span className="font-bold text-lg tracking-tight">OJ-Track</span>
      </SidebarHeader>

      <SidebarContent className="px-4 pt-6">
        <SidebarMenu className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <SidebarMenuItem key={to}>
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  ].join(" ")
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}