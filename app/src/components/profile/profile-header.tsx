import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { UserProfile } from "@/hooks/useProfile";

interface ProfileHeaderProps {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16">
        {profile.avatarUrl
          ? <img src={profile.avatarUrl} alt={profile.fullName} className="h-full w-full object-cover rounded-full" />
          : <AvatarFallback className="text-sm">{profile.initials || "OJ"}</AvatarFallback>
        }
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          {profile.fullName}
        </h1>
        <p className="text-sm text-muted-foreground">{profile.profession}</p>
        <p className="text-xs text-muted-foreground/70 mt-0.5">{profile.email}</p>
      </div>
    </div>
  );
}