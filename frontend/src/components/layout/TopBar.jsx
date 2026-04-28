import { LogOut } from "lucide-react";

export default function TopBar({
  firebaseConfigured,
  onGoogleLogin,
  onLogout,
  profile,
  statusText,
  user,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-slate-400">Status</p>
          <span
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs font-semibold text-slate-200"
            title="Running in local environment"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            System Status: Active
          </span>
        </div>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
          {statusText}
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {user ? (
          <>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
              <p className="text-sm font-semibold text-white">{profile?.name || user.displayName}</p>
              <p className="text-xs text-slate-400">{profile?.role || user.email}</p>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5"
              onClick={onLogout}
              type="button"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </>
        ) : (
          firebaseConfigured ? (
            <button
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              onClick={onGoogleLogin}
              type="button"
            >
              Continue with Google
            </button>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
              Sign-in is unavailable in this environment.
            </div>
          )
        )}
      </div>
    </div>
  );
}
