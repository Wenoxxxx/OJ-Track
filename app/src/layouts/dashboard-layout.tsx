import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { CustomScrollbar } from "@/components/ui/custom-scrollbar";

export default function DashboardLayout() {
  return (
    <TooltipProvider delayDuration={0}>
      {/* Make the whole layout a "group" so we can target collapse state */}
      <SidebarProvider className="group">
        {/* Sidebar with animated width */}
        <AppSidebar className="transition-[width] duration-300 ease-in-out" />

        {/* Inset content with animated margin/padding */}
        <SidebarInset
          className="
            h-screen overflow-y-auto overflow-x-hidden
            transition-[margin,padding] duration-300 ease-in-out
            group-data-[collapsible=icon]:ml-16
            group-data-[collapsible=expanded]:ml-64
          "
        >
          <Outlet />
        </SidebarInset>

        <CustomScrollbar />
      </SidebarProvider>
    </TooltipProvider>
  );
}
