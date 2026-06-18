import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { CustomScrollbar } from "@/components/ui/custom-scrollbar";

export default function DashboardLayout() {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="h-screen overflow-y-auto overflow-x-hidden">
          <Outlet />
        </SidebarInset>
        <CustomScrollbar />
      </SidebarProvider>
    </TooltipProvider>
  );
}