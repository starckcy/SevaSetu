import { useCallback, useEffect, useMemo, useState } from "react";

import { api } from "../api";
import { useRealtimeCollection } from "./useRealtimeCollection";

const emptyState = {
  meta: {
    storage: "mock-memory",
    gemini: "fallback",
  },
  issues: [],
  volunteers: [],
  assignments: [],
  recommendations: [],
  chartData: {
    issuesByType: [],
    volunteersOverTime: [],
  },
  stats: {
    totalIssues: 0,
    resolvedCases: 0,
    volunteersDeployed: 0,
    highSeverityIssues: 0,
    activeAssignments: 0,
  },
  insights: {
    summary: "Upload data or load demo mode to generate AI insights.",
    urgentAreas: [],
    risingIssues: [],
    volunteerGaps: [],
    actionRecommendations: [],
    source: "mock",
  },
};

export function useDashboardData(showToast) {
  const [data, setData] = useState(emptyState);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const payload = await api.getBootstrap();
    setData({ ...emptyState, ...payload });
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh().catch((error) => {
      setLoading(false);
      showToast({
        tone: "error",
        title: "Unable to load dashboard",
        message: error.message,
      });
    });
  }, [refresh, showToast]);

  useRealtimeCollection(true, "issues", (issues) => {
    setData((current) => ({ ...current, issues }));
  });
  useRealtimeCollection(true, "volunteers", (volunteers) => {
    setData((current) => ({ ...current, volunteers }));
  });
  useRealtimeCollection(true, "assignments", (assignments) => {
    setData((current) => ({ ...current, assignments }));
  });

  const actions = useMemo(
    () => ({
      async uploadCsv(file) {
        await api.uploadCsv(file);
        await refresh();
      },
      async createVolunteer(payload) {
        await api.createVolunteer(payload);
        await refresh();
      },
      async loadDemoData() {
        await api.loadDemoData();
        await refresh();
      },
      async simulateAssignments() {
        const response = await api.simulateAssignments();
        await refresh();
        return response;
      },
      async acceptTask(issueId, volunteerId) {
        await api.acceptTask(issueId, volunteerId);
        await refresh();
      },
    }),
    [refresh],
  );

  return {
    data,
    loading,
    refresh,
    ...actions,
  };
}
