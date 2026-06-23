import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Users,
  FileBarChart2,
  User,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/reports", label: "Reports", icon: FileBarChart2 },
  { to: "/profile", label: "Profile", icon: User },
];

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const handleSignOut = () => {
    console.log("Signing out...");
  };

  return (
    <Sidebar
      collapsible="icon"
      className={`transition-[width] duration-300 ease-in-out ${className ?? ""}`}
    >
      {/* Header with dynamic padding */}
      <SidebarHeader
        className="
          h-14 border-b flex items-center
          transition-[padding] duration-300 ease-in-out
          group-data-[collapsible=icon]:pl-2 group-data-[collapsible=expanded]:pl-6
          group-data-[collapsible=icon]:pr-1 group-data-[collapsible=expanded]:pr-2
        "
      >
        <div className="relative h-8 w-8 shrink-0">
          {/* Full logo when expanded */}
          <img
            src="/oj-track.png"
            alt="OJ-Track Logo"
            className="
              absolute inset-y-0 -left-17 h-8 w-auto max-w-none object-contain mt-2
              transition-opacity duration-300 ease-in-out
              opacity-100
              group-data-[collapsible=icon]:opacity-0 
            "
          />

          {/* Compact icon when collapsed */}
          <img
            src="/oj-icon.png"
            alt="OJ-Track Icon"
            className="
              absolute inset-0 h-8 w-8 object-contain
              transition-opacity duration-300 ease-in-out mt-1
              opacity-0
              group-data-[collapsible=icon]:opacity-100
            "
          />
        </div>
      </SidebarHeader>

      {/* Content with dynamic padding */}
      <SidebarContent
        className="
          px-4 pt-4 flex flex-col h-full
          transition-[padding] duration-300 ease-in-out
          group-data-[collapsible=icon]:px-2   /* collapsed content padding */
          group-data-[collapsible=expanded]:px-6 /* expanded content padding */
        "
      >
        <SidebarMenu className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <SidebarMenuItem key={to}>
              <SidebarMenuButton asChild tooltip={label}>
                <NavLink
                  to={to}
                  end
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ease-in-out",
                      // Expanded: full width, normal padding
                      "group-data-[collapsible=expanded]:w-full group-data-[collapsible=expanded]:px-6",
                      // Collapsed: fixed adjustable width via CSS var, centered, no padding/gap needed
                      "group-data-[collapsible=icon]:w-[var(--sidebar-icon-bg-width)] group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    ].join(" ")
                  }
                >
                  <Icon size={16} />
                  <span
                    className="
                      transition-all duration-300 ease-in-out overflow-hidden
                      group-data-[collapsible=icon]:opacity-0
                      group-data-[collapsible=icon]:w-0
                    "
                  >
                    {label}
                  </span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {/* Sign Out button with dynamic padding */}
        <div className="mt-auto pb-5 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <SidebarMenuButton
            onClick={handleSignOut}
            tooltip="Sign Out"
            className="
              text-muted-foreground hover:bg-rose-100 hover:text-rose-700
              transition-all duration-300 ease-in-out
              group-data-[collapsible=expanded]:w-full group-data-[collapsible=expanded]:px-6
              group-data-[collapsible=icon]:w-[var(--sidebar-icon-bg-width)] group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0
            "
          >
            <LogOut size={16} />
            <span
              className="
                transition-all duration-300 ease-in-out overflow-hidden
                group-data-[collapsible=icon]:opacity-0
                group-data-[collapsible=icon]:w-0
              "
            >
              Sign Out
            </span>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}