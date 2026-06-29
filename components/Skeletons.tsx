export function ViewerSkeleton() {
  return (
    <div className="w-full aspect-video rounded-2xl bg-navy-100 animate-pulse flex items-center justify-center">
      <span className="text-navy-300 text-sm font-body">Memuat materi...</span>
    </div>
  );
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-navy-100 animate-pulse" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return <div className="h-40 rounded-2xl bg-navy-100 animate-pulse" />;
}
