import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import DashboardLayout from "@/layouts/dashboard-layout";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function ProfilePage() {
  return (
        <DashboardLayout>
          <DashboardHeader title="Dashboard" />
    
          <main className="p-6 pr-10 space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-sm">OJ</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-primary">Owen M. Jerusalem</h1>
                <p className="text-sm text-muted-foreground">Graphic Designer</p>
              </div>
            </div>
          </main>
        </DashboardLayout>
  );
}
