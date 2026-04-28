const toneClasses = {
  success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
  error: "border-rose-400/30 bg-rose-500/10 text-rose-100",
  info: "border-sky-400/30 bg-sky-500/10 text-sky-100",
};

export default function ToastStack({ toasts }) {
  return (
    <div className="fixed right-4 top-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`w-80 rounded-2xl border px-4 py-3 shadow-lg ${toneClasses[toast.tone]}`}
        >
          <p className="font-semibold">{toast.title}</p>
          <p className="mt-1 text-sm opacity-90">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
