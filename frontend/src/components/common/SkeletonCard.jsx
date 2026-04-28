export default function SkeletonCard({ className = "h-32" }) {
  return (
    <div
      className={`animate-pulse rounded-3xl border border-white/10 bg-slate-900/70 ${className}`}
    />
  );
}
