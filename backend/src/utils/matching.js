const locationHints = {
  delhi: { lat: 28.6139, lng: 77.209 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  pune: { lat: 18.5204, lng: 73.8567 },
  lucknow: { lat: 26.8467, lng: 80.9462 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
};

const skillKeywords = {
  medical: ["health", "medical", "medicine", "clinic"],
  logistics: ["food", "shelter", "transport", "supply"],
  education: ["education", "school", "child", "training"],
  rescue: ["flood", "disaster", "emergency", "evacuation"],
  counseling: ["mental", "support", "counseling", "women"],
};

function resolveCoords(location) {
  const key = String(location || "").toLowerCase();
  return (
    Object.entries(locationHints).find(([city]) => key.includes(city))?.[1] ||
    locationHints.delhi
  );
}

function haversineDistanceKm(pointA, pointB) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const deltaLat = toRad(pointB.lat - pointA.lat);
  const deltaLng = toRad(pointB.lng - pointA.lng);
  const lat1 = toRad(pointA.lat);
  const lat2 = toRad(pointB.lat);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function skillScore(skills, issueType) {
  const normalizedSkills = skills.map((skill) => skill.toLowerCase());
  const normalizedIssue = issueType.toLowerCase();
  const rawScore = normalizedSkills.reduce((score, skill) => {
    if (normalizedIssue.includes(skill)) {
      return score + 35;
    }

    const relatedKeywords = skillKeywords[skill] || [];
    const relatedMatch = relatedKeywords.some((keyword) =>
      normalizedIssue.includes(keyword),
    );

    return score + (relatedMatch ? 20 : 4);
  }, 0);

  return Math.min(100, Math.round((rawScore / Math.max(skills.length * 40, 40)) * 100));
}

function distanceScore(volunteerLocation, issue) {
  if (!volunteerLocation) {
    return 25;
  }

  const volunteerCoords = resolveCoords(volunteerLocation);
  const issueCoords = {
    lat: issue.lat || resolveCoords(issue.location).lat,
    lng: issue.lng || resolveCoords(issue.location).lng,
  };
  const distanceKm = haversineDistanceKm(volunteerCoords, issueCoords);

  if (distanceKm <= 15) return 100;
  if (distanceKm <= 80) return 85;
  if (distanceKm <= 250) return 65;
  if (distanceKm <= 600) return 45;
  return 20;
}

function urgencyScore(severity) {
  return Math.round((severity / 4) * 100);
}

export function matchVolunteerToIssues(volunteer, issues = []) {
  return issues
    .filter((issue) => !volunteer.acceptedTaskIds?.includes(issue.id))
    .map((issue) => {
      const skill = skillScore(volunteer.skills, issue.issueType);
      const distance = distanceScore(volunteer.location, issue);
      const urgency = urgencyScore(issue.severity);
      const score = Math.round(skill * 0.4 + distance * 0.3 + urgency * 0.3);

      return {
        issueId: issue.id,
        location: issue.location,
        issueType: issue.issueType,
        severity: issue.severityLabel,
        score,
        confidenceLabel:
          score >= 85 ? "High confidence" : score >= 65 ? "Good fit" : "Potential fit",
        breakdown: {
          skill,
          distance,
          urgency,
        },
        reason:
          score >= 80
            ? "Strong skill, distance, and urgency alignment"
            : score >= 60
              ? "Good fit with moderate urgency"
              : "Useful backup deployment option",
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
