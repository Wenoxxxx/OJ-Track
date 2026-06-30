interface ClientsErrorBannerProps {
  message: string;
}

export function ClientsErrorBanner({ message }: ClientsErrorBannerProps) {
  return (
    <div className="border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600">
      {message}
    </div>
  );
}