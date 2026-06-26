export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted/40 rounded ${className}`} />;
}