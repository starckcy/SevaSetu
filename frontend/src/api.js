const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Request failed.",
    }));
    throw new Error(error.message || "Request failed.");
  }

  return response.json();
}

export const api = {
  getBootstrap: () => request("/api/bootstrap"),
  getStats: () => request("/api/stats"),
  getIssues: () => request("/api/issues"),
  getInsights: () => request("/api/insights"),
  getRecommendations: () => request("/api/recommendations"),
  getCharts: () => request("/api/charts"),
  getUserProfile: (id) => request(`/api/auth/profile/${id}`),
  seedMockData: () =>
    request("/api/issues/seed", {
      method: "POST",
    }),
  loadDemoData: () =>
    request("/api/demo/load", {
      method: "POST",
    }),
  simulateAssignments: () =>
    request("/api/demo/simulate", {
      method: "POST",
    }),
  uploadCsv: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return request("/api/issues/upload", {
      method: "POST",
      body: formData,
    });
  },
  createVolunteer: (payload) =>
    request("/api/volunteers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  saveUserProfile: (payload) =>
    request("/api/auth/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  acceptTask: (issueId, volunteerId) =>
    request(`/api/issues/${issueId}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ volunteerId }),
    }),
};
