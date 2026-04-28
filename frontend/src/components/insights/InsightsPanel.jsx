import Card from "../common/Card";

function InsightList({ title, items }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
            <p className="text-sm text-slate-200">{item}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function InsightsPanel({ insights }) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-cyan-500/15 via-slate-900/70 to-violet-500/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
              AI insight engine
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              Actionable briefing for field leads
            </h3>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
            {insights.source}
          </span>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">{insights.summary}</p>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <InsightList title="Top 3 urgent areas" items={insights.urgentAreas} />
        <InsightList title="Rising issues" items={insights.risingIssues} />
        <InsightList title="Volunteer gaps" items={insights.volunteerGaps} />
        <InsightList
          title="Action recommendations"
          items={insights.actionRecommendations}
        />
      </div>
    </div>
  );
}
