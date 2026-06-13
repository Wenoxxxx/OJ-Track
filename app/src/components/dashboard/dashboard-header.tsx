import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export function DashboardHeader() {
  return (
    <header className="h-16 border-b px-6 flex items-center justify-between">
      <Input
        placeholder="Search..."
        className="max-w-sm"
      />

      <Avatar>
        <AvatarFallback>
          PR
        </AvatarFallback>
      </Avatar>
    </header>
  );
}