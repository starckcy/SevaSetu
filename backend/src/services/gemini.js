export async function summarizeIssuesWithGemini(issues, volunteers = []) {
  const fallbackInsights = buildFallbackInsights(issues, volunteers);

  if (!process.env.GEMINI_API_KEY) {
    return fallbackInsights;
  }

  try {
    const prompt = `
You are analyzing NGO issue data.
Return a concise JSON object with this shape:
{
  "summary": "short paragraph",
  "urgentAreas": ["area 1", "area 2", "area 3"],
  "risingIssues": ["issue 1", "issue 2", "issue 3"],
  "volunteerGaps": ["gap 1", "gap 2", "gap 3"],
  "actionRecommendations": ["action 1", "action 2", "action 3"]
}

Issue dataset:
${JSON.stringify(issues, null, 2)}

Volunteer dataset:
${JSON.stringify(volunteers, null, 2)}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    );

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join("") ||
      "";
    const parsed = safeJsonParse(text);

    return {
      summary: parsed.summary,
      urgentAreas: parsed.urgentAreas || fallbackInsights.urgentAreas,
      risingIssues: parsed.risingIssues || fallbackInsights.risingIssues,
      volunteerGaps: parsed.volunteerGaps || fallbackInsights.volunteerGaps,
      actionRecommendations:
        parsed.actionRecommendations || fallbackInsights.actionRecommendations,
      source: "gemini",
    };
  } catch {
    return fallbackInsights;
  }
}

function safeJsonParse(text) {
  const cleaned = String(text || "").replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    }
    throw new Error("Unable to parse Gemini JSON output.");
  }
}

function buildFallbackInsights(issues, volunteers) {
  const total = issues.length;
  const highSeverity = issues.filter((issue) => issue.severity >= 3);

  const locationCount = issues.reduce((acc, issue) => {
    acc[issue.location] = (acc[issue.location] || 0) + 1;
    return acc;
  }, {});

  const topLocation =
    Object.entries(locationCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "key areas";

  const issueTypeCount = issues.reduce((acc, issue) => {
    acc[issue.issueType] = (acc[issue.issueType] || 0) + 1;
    return acc;
  }, {});

  const topIssue =
    Object.entries(issueTypeCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "community support needs";

  const volunteerSkillMap = volunteers.reduce((acc, volunteer) => {
    volunteer.skills.forEach((skill) => {
      const key = skill.toLowerCase();
      acc[key] = (acc[key] || 0) + 1;
    });
    return acc;
  }, {});

  const lowCoverageSkills = ["medical", "rescue", "logistics", "education", "counseling"]
    .sort((a, b) => (volunteerSkillMap[a] || 0) - (volunteerSkillMap[b] || 0))
    .slice(0, 3);

  const urgentAreas = highSeverity
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 3)
    .map((issue) => `${issue.location} - ${issue.issueType}`);

  return {
    summary: `${total} issues were processed. ${highSeverity.length} cases are high priority, with the strongest concentration around ${topLocation}. The most frequent issue category is ${topIssue}.`,
    urgentAreas:
      urgentAreas.length > 0
        ? urgentAreas
        : ["Delhi - Food shortage", "Lucknow - Flood rescue assistance", "Mumbai - Medical camp support"],
    risingIssues: [
      `${topIssue} is trending upward in field reports.`,
      `High severity alerts are clustering around ${topLocation}.`,
      "Emergency response demand is increasing faster than volunteer onboarding.",
    ],
    volunteerGaps: lowCoverageSkills.map(
      (skill) => `Low ${skill} volunteer coverage for current issue demand.`,
    ),
    actionRecommendations: [
      `Deploy local responders in ${topLocation} first to reduce travel lag.`,
      `Prioritize ${topIssue.toLowerCase()} response kits for the next field cycle.`,
      "Run a rapid volunteer call-up for under-covered skill groups before evening.",
    ],
    source: "mock",
  };
}
