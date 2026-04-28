import { navigationItems } from "../../data/navigation";

export default function Sidebar({ activePage, onNavigate, profile }) {
  return (
    <aside className="flex h-full flex-col rounded-3xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
          SevaSetu
        </p>
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-white">
          Operations Dashboard
        </h1>
      </div>

      <nav className="mt-8 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = item.id === activePage;

          return (
            <button
              key={item.id}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
                active
                  ? "bg-indigo-500/15 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Access</p>
        <p className="mt-2 text-sm font-semibold text-white">
          {profile?.role || "Guest"}
        </p>
      </div>
    </aside>
  );
}
