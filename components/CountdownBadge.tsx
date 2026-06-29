import { cn, formatCountdown } from "@/lib/utils";

export default function CountdownBadge({
  seconds,
  urgent,
}: {
  seconds: number;
  urgent?: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-3 py-1.5",
        urgent
          ? "border-brass bg-brass/10 animate-pulse-ring"
          : "border-navy-300/40 bg-navy-900"
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          urgent ? "bg-brass" : "bg-emerald-400"
        )}
      />
      <span
        className={cn(
          "font-mono text-lg tabular-nums tracking-widest",
          urgent ? "text-brass-dark" : "text-white"
        )}
      >
        {formatCountdown(seconds)}
      </span>
    </div>
  );
}
