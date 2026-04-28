export default function Card({ className = "", children }) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.75)] backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}
