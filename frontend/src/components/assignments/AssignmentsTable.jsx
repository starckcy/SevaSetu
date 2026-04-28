import Card from "../common/Card";

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

const statusBadge = {
  Assigned: "border-sky-400/20 bg-sky-500/10 text-sky-100",
  Resolved: "border-emerald-400/20 bg-emerald-500/10 text-emerald-100",
};

export default function AssignmentsTable({ assignments }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="text-lg font-semibold text-white">Assignments</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-950/50 text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">Issue Type</th>
              <th className="px-5 py-3 font-medium">Location</th>
              <th className="px-5 py-3 font-medium">Volunteer</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length ? (
              assignments.map((assignment) => (
                <tr
                  key={assignment.id}
                  className="border-t border-white/10 text-slate-200 transition hover:bg-white/5"
                >
                  <td className="px-5 py-3">{assignment.issueType}</td>
                  <td className="px-5 py-3">{assignment.location}</td>
                  <td className="px-5 py-3">{assignment.volunteerName}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        statusBadge[assignment.status] || "border-white/10 bg-slate-950/60 text-slate-200"
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {formatDate(assignment.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-5 py-6 text-slate-400" colSpan={5}>
                  No assignments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

