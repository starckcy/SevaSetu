import Card from "../common/Card";

export default function RoleModal({ open, onSelect }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/75 px-4">
      <Card className="w-full max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
          Choose role
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white">Personalize your demo access</h3>
        <p className="mt-2 text-sm text-slate-400">
          Pick the role that fits your judging flow. NGO admins can upload issues and run
          demo simulation, while volunteers can browse and accept recommended tasks.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {["NGO admin", "Volunteer"].map((role) => (
            <button
              key={role}
              className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-left transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
              onClick={() => onSelect(role)}
              type="button"
            >
              <p className="text-lg font-semibold text-white">{role}</p>
              <p className="mt-2 text-sm text-slate-400">
                {role === "NGO admin"
                  ? "Full access to uploads, simulation, insights, and operational metrics."
                  : "Focused view for recommendations, assignments, and impact tracking."}
              </p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
