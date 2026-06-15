import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { CustomScrollbar } from "@/components/ui/custom-scrollbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />

      {/* Make SidebarInset a fixed-height scrollable pane so the custom scrollbar works */}
      <SidebarInset className="h-screen overflow-y-auto overflow-x-hidden">
        {children}
      </SidebarInset>

      <CustomScrollbar />
    </SidebarProvider>
  );
}