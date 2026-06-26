export function ProfileHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4 animate-pulse">
      <div className="h-16 w-16 rounded-full bg-muted/40" />
      <div className="space-y-2">
        <div className="h-5 w-48 bg-muted/40 rounded" />
        <div className="h-3 w-28 bg-muted/40 rounded" />
      </div>
    </div>
  );
}