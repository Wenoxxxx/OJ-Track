import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title = "Dashboard" }: DashboardHeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="h-14 border-b px-4 flex items-center justify-between gap-4 sticky top-0 bg-background z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-1.5 hover:bg-muted transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={16} />
        </button>
        <h2 className="font-semibold text-sm">{title}</h2>
      </div>

      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs">OJ</AvatarFallback>
      </Avatar>
    </header>
  );
}