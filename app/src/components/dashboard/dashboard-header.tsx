import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title = "Dashboard" }: DashboardHeaderProps) {
  const { toggleSidebar, open } = useSidebar();

  return (
    <header className="h-14 border-b px-4 pr-10 flex items-center justify-between gap-4 sticky top-0 bg-background z-[110] pb-10">
      <div className="flex items-center gap-3 pt-10">
        <button
          onClick={toggleSidebar}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-md"
          aria-label="Toggle sidebar"
        >
          {/* Crossfade between close and open icons based on sidebar state */}
          <span className="relative flex items-center justify-center w-5 h-5">
            <PanelLeftClose
              size={20}
              className={`absolute transition-all duration-300 ${open ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            />
            <PanelLeftOpen
              size={20}
              className={`absolute transition-all duration-300 ${open ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}
            />
          </span>
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