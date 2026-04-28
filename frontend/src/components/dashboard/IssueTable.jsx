import Card from "../common/Card";

const severityClasses = {
  Low: "bg-emerald-500/15 text-emerald-200 border-emerald-400/20",
  Medium: "bg-amber-500/15 text-amber-200 border-amber-400/20",
  High: "bg-orange-500/15 text-orange-100 border-orange-400/20",
  Critical: "bg-rose-500/15 text-rose-100 border-rose-400/20",
};

function formatLastUpdated(issue) {
  const dateValue = issue.updatedAt || issue.createdAt;
  if (!dateValue) return "—";
  try {
    return new Date(dateValue).toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export default function IssueTable({ issues }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="text-lg font-semibold text-white">Active Issues</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-950/50 text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">Location</th>
              <th className="px-5 py-3 font-medium">Issue Type</th>
              <th className="px-5 py-3 font-medium">Severity</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr
                key={issue.id}
                className="border-t border-white/10 text-slate-200 transition hover:bg-white/5"
              >
                <td className="px-5 py-3">{issue.location}</td>
                <td className="px-5 py-3">{issue.issueType}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      severityClasses[issue.severityLabel] || severityClasses.Medium
                    }`}
                  >
                    {issue.severityLabel}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-300">{issue.status}</td>
                <td className="px-5 py-3 text-slate-400">{formatLastUpdated(issue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
