import { parse } from "csv-parse/sync";
import { nanoid } from "nanoid";

const severityMap = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

const geocodeHints = {
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

function fallbackCoords(location, index) {
  const key = String(location || "").toLowerCase();
  const hint =
    Object.entries(geocodeHints).find(([city]) => key.includes(city))?.[1] ||
    geocodeHints.delhi;

  return {
    lat: hint.lat + index * 0.01,
    lng: hint.lng + index * 0.01,
  };
}

export function parseIssueCsv(csvText) {
  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return records.map((record, index) => {
    const severityLabel = String(record.severity || "medium").toLowerCase();
    const severity = severityMap[severityLabel] || 2;
    const coords = fallbackCoords(record.location, index);

    return {
      id: `issue-${nanoid(8)}-${index}`,
      location: record.location || "Unknown",
      issueType: record.issue_type || "General assistance",
      severity,
      severityLabel:
        severityLabel.charAt(0).toUpperCase() + severityLabel.slice(1),
      lat: Number(record.lat) || coords.lat,
      lng: Number(record.lng) || coords.lng,
      status: severity >= 3 ? "Open - urgent" : "Open",
      createdAt: new Date().toISOString(),
      trend: severity >= 3 ? "rising" : "stable",
    };
  });
}

export function getLocationHints() {
  return geocodeHints;
}
