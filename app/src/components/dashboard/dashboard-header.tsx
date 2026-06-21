import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title = "Dashboard" }: DashboardHeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="h-14 border-b px-4 pr-10 flex items-center justify-between gap-4 sticky top-0 bg-background z-[110] pb-10">
      <div className="flex items-center gap-3 pt-10">
        <button
          onClick={toggleSidebar}
          className="p-1.5 hover:bg-muted transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <h2 className="font-bold text-m text-primary">{title}</h2>
      </div>

      <Link to="/profile">      
        <Avatar className="h-8 w-8 mt-10">
          <AvatarFallback className="text-xs">OJ</AvatarFallback>
        </Avatar>
      </Link>
    </header>
  );
}