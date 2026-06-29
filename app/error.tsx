"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-paper">
      <div className="max-w-md w-full rounded-2xl border border-navy-100 bg-white shadow-panel p-6 text-center space-y-3">
        <p className="font-display font-bold text-navy-900">Ada yang error</p>
        <p className="text-xs text-navy-500 break-words bg-navy-50 rounded-lg p-3 text-left">
          {error.message || "Unknown error"}
        </p>
        <button
          onClick={() => reset()}
          className="w-full rounded-xl bg-navy-900 text-white font-semibold py-2.5 text-sm"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}
