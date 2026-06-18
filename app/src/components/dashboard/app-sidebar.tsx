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
  User,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/reports", label: "Reports", icon: FileBarChart2 },
  { to: "/profile", label: "Profile", icon: User }, // 👈 Profile stays with main nav
];

export function AppSidebar() {
  const handleSignOut = () => {
    // Replace with your auth logic
    console.log("Signing out...");
  };

  return (
    <Sidebar>
      <SidebarHeader className="h-14 border-b flex items-center pl-6">
        <span className="font-bold text-lg tracking-tight text-primary">
          OJ-Track
        </span>
      </SidebarHeader>

      <SidebarContent className="px-4 pt-4 flex flex-col h-full">
        {/* Main nav items */}
        <SidebarMenu className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <SidebarMenuItem key={to}>
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
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

        {/* Sign Out at bottom (no bullet) */}
        <div className="mt-auto pb-5">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-rose-100 hover:text-rose-700 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
