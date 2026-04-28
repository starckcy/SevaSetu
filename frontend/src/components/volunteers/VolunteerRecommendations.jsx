import Card from "../common/Card";

export default function VolunteerRecommendations({
  canAccept,
  onAccept,
  recommendations,
  volunteerDirectory,
}) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-white">Smart Matching Recommendations</h3>
      <p className="mt-1 text-sm text-slate-400">
        Weighted scoring uses skill match (40%), distance (30%), and urgency (30%).
      </p>

      <div className="mt-5 space-y-4">
        {recommendations.map((recommendation) => {
          const volunteer = volunteerDirectory.find(
            (item) => item.id === recommendation.volunteerId,
          );

          return (
            <div
              key={recommendation.volunteerId}
              className="rounded-2xl border border-white/10 bg-slate-950/50 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{recommendation.volunteerName}</p>
                  <p className="text-sm text-slate-400">
                    {volunteer?.location} • {(volunteer?.skills || []).join(", ")}
                  </p>
                </div>
                <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-100">
                  Top 3 tasks
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {recommendation.matches.map((match) => (
                  <div
                    key={match.issueId}
                    className="rounded-2xl border border-white/10 px-4 py-3"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="font-medium text-white">{match.issueType}</p>
                        <p className="text-sm text-slate-400">
                          {match.location} • {match.severity}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-lg font-semibold text-cyan-100">{match.score}%</p>
                          <p className="text-xs text-slate-500">{match.confidenceLabel}</p>
                        </div>
                        {canAccept ? (
                          <button
                            className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
                            onClick={() => onAccept(match.issueId, recommendation.volunteerId)}
                            type="button"
                          >
                            Accept task
                          </button>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-slate-400 md:grid-cols-3">
                      <div>Skill: {match.breakdown.skill}%</div>
                      <div>Distance: {match.breakdown.distance}%</div>
                      <div>Urgency: {match.breakdown.urgency}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
