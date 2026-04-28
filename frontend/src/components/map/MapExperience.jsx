import { useMemo, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  MarkerClusterer,
  useJsApiLoader,
} from "@react-google-maps/api";

import Card from "../common/Card";

const containerStyle = {
  width: "100%",
  height: "520px",
};

const markerIcons = {
  low: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
  medium: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  high: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
  critical: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
};

function severityKey(severityLabel) {
  return String(severityLabel || "medium").toLowerCase();
}

export default function MapExperience({ issues }) {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({
    id: "sevasetu-map",
    googleMapsApiKey: apiKey || "",
  });

  const center = useMemo(() => {
    if (!issues.length) {
      return { lat: 22.9734, lng: 78.6569 };
    }
    return { lat: issues[0].lat, lng: issues[0].lng };
  }, [issues]);

  if (!apiKey) {
    return (
      <Card className="p-0 overflow-hidden">
        <div className="border-b border-white/10 px-5 py-4">
          <h3 className="text-lg font-semibold text-white">Hotspot Map (Demo)</h3>
          <p className="text-sm text-slate-400">
            Demo mode is active. Configure Google Maps to enable live clusters and interactive markers.
          </p>
        </div>
        <div className="grid gap-3 p-5 md:grid-cols-2">
          {issues.slice(0, 6).map((issue) => (
            <div
              key={issue.id}
              className="rounded-2xl border border-white/10 bg-slate-950/50 p-4"
            >
              <p className="font-semibold text-white">{issue.issueType}</p>
              <p className="mt-1 text-sm text-slate-400">
                {issue.location} • {issue.severityLabel} • {issue.status}
              </p>
            </div>
          ))}
          {!issues.length ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-4 text-sm text-slate-400">
              Load demo data or upload a CSV to populate issue hotspots.
            </div>
          ) : null}
        </div>
      </Card>
    );
  }

  if (!isLoaded) {
    return <Card className="min-h-[520px] animate-pulse" />;
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="text-lg font-semibold text-white">Hotspot Map</h3>
        <p className="text-sm text-slate-400">
          Clustered issue markers with severity-based color coding and field details.
        </p>
      </div>
      <GoogleMap center={center} mapContainerStyle={containerStyle} zoom={5}>
        <MarkerClusterer>
          {(clusterer) => (
            <>
              {issues.map((issue) => (
                <Marker
                  key={issue.id}
                  clusterer={clusterer}
                  icon={markerIcons[severityKey(issue.severityLabel)]}
                  position={{ lat: issue.lat, lng: issue.lng }}
                  onClick={() => setSelectedIssue(issue)}
                />
              ))}
            </>
          )}
        </MarkerClusterer>
        {selectedIssue ? (
          <InfoWindow
            position={{ lat: selectedIssue.lat, lng: selectedIssue.lng }}
            onCloseClick={() => setSelectedIssue(null)}
          >
            <div className="max-w-xs p-1 text-slate-900">
              <p className="font-semibold">{selectedIssue.issueType}</p>
              <p className="text-sm">{selectedIssue.location}</p>
              <p className="mt-1 text-sm">Severity: {selectedIssue.severityLabel}</p>
              <p className="text-sm">Status: {selectedIssue.status}</p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </Card>
  );
}
