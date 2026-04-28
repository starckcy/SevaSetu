import Card from "../common/Card";

export default function KpiCard({ icon: Icon, label, value, helper, trendText }) {
  return (
    <Card className="p-5 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-slate-900/80">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-sm text-slate-500">{helper}</p>
            {trendText ? (
              <span className="rounded-full bg-slate-950/60 px-2.5 py-1 text-xs font-semibold text-slate-300">
                {trendText}
              </span>
            ) : null}
          </div>
        </div>
        <div className="rounded-2xl bg-indigo-500/15 p-3 text-indigo-200">
          <Icon size={18} />
        </div>
      </div>
    </Card>
  );
}
