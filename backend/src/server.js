import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import { nanoid } from "nanoid";

import {
  saveAssignments,
  saveDemoDataset,
  saveIssues,
  getAssignments,
  getIssues,
  getUserProfile,
  getVolunteers,
  isFirebaseReady,
  saveUserProfile,
  saveVolunteer,
} from "./services/firestore.js";
import { demoIssues, demoVolunteers } from "./services/demoData.js";
import { summarizeIssuesWithGemini } from "./services/gemini.js";
import { parseIssueCsv } from "./utils/csvParser.js";
import { matchVolunteerToIssues } from "./utils/matching.js";

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    storage: isFirebaseReady() ? "firestore" : "mock-memory",
    gemini: Boolean(process.env.GEMINI_API_KEY) ? "enabled" : "fallback",
  });
});

app.get("/api/issues", async (_req, res) => {
  const issues = await getIssues();
  res.json(issues);
});

app.get("/api/bootstrap", async (_req, res) => {
  const [issues, volunteers, assignments] = await Promise.all([
    getIssues(),
    getVolunteers(),
    getAssignments(),
  ]);

  const stats = buildStats(issues, volunteers, assignments);
  const chartData = buildChartData(issues, volunteers, assignments);
  const insights = await summarizeIssuesWithGemini(issues, volunteers);
  const recommendations = volunteers.map((volunteer) => ({
    volunteerId: volunteer.id,
    volunteerName: volunteer.name,
    matches: matchVolunteerToIssues(volunteer, issues),
  }));

  res.json({
    meta: {
      storage: isFirebaseReady() ? "firestore" : "mock-memory",
      gemini: Boolean(process.env.GEMINI_API_KEY) ? "enabled" : "fallback",
    },
    issues,
    volunteers,
    assignments,
    stats,
    chartData,
    insights,
    recommendations,
  });
});

app.post("/api/issues/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "CSV file is required." });
  }

  try {
    const csvText = req.file.buffer.toString("utf-8");
    const issues = parseIssueCsv(csvText);
    await saveIssues(issues);
    return res.json(issues);
  } catch (error) {
    return res.status(400).json({
      message: "Unable to parse CSV file.",
      details: error.message,
    });
  }
});

app.post("/api/issues/seed", async (_req, res) => {
  await saveIssues(demoIssues);
  res.json(demoIssues);
});

app.post("/api/demo/load", async (_req, res) => {
  const assignments = [];
  await saveDemoDataset({
    issues: demoIssues,
    volunteers: demoVolunteers,
    assignments,
  });

  res.json({
    message: "Demo data loaded successfully.",
    issues: demoIssues,
    volunteers: demoVolunteers,
    assignments,
  });
});

app.post("/api/volunteers", async (req, res) => {
  const { name, location, skills = [], availability = "Immediate" } = req.body;

  if (!name || !location || !skills.length) {
    return res.status(400).json({
      message: "Volunteer name, location, and at least one skill are required.",
    });
  }

  const volunteer = {
    id: `vol-${nanoid(8)}`,
    name,
    location,
    skills,
    availability,
    createdAt: new Date().toISOString(),
    acceptedTaskIds: [],
  };

  await saveVolunteer(volunteer);
  return res.status(201).json(volunteer);
});

app.get("/api/volunteers", async (_req, res) => {
  const volunteers = await getVolunteers();
  res.json(volunteers);
});

app.get("/api/recommendations", async (_req, res) => {
  const [issues, volunteers] = await Promise.all([getIssues(), getVolunteers()]);

  const recommendations = volunteers.map((volunteer) => ({
    volunteerId: volunteer.id,
    volunteerName: volunteer.name,
    matches: matchVolunteerToIssues(volunteer, issues),
  }));

  res.json(recommendations);
});

app.get("/api/insights", async (_req, res) => {
  const [issues, volunteers] = await Promise.all([getIssues(), getVolunteers()]);
  const insights = await summarizeIssuesWithGemini(issues, volunteers);
  res.json(insights);
});

app.get("/api/stats", async (_req, res) => {
  const [issues, volunteers, assignments] = await Promise.all([
    getIssues(),
    getVolunteers(),
    getAssignments(),
  ]);

  res.json(buildStats(issues, volunteers, assignments));
});

app.get("/api/charts", async (_req, res) => {
  const [issues, volunteers, assignments] = await Promise.all([
    getIssues(),
    getVolunteers(),
    getAssignments(),
  ]);

  res.json(buildChartData(issues, volunteers, assignments));
});

app.post("/api/auth/profile", async (req, res) => {
  const { id, name, email, photoURL, role } = req.body;

  if (!id || !email || !role) {
    return res.status(400).json({ message: "User id, email, and role are required." });
  }

  const profile = {
    id,
    name: name || email,
    email,
    photoURL: photoURL || "",
    role,
    updatedAt: new Date().toISOString(),
  };

  await saveUserProfile(profile);
  res.json(profile);
});

app.get("/api/auth/profile/:id", async (req, res) => {
  const profile = await getUserProfile(req.params.id);
  if (!profile) {
    return res.status(404).json({ message: "User profile not found." });
  }
  return res.json(profile);
});

app.post("/api/issues/:issueId/accept", async (req, res) => {
  const { volunteerId } = req.body;
  const { issueId } = req.params;

  const [issues, volunteers, assignments] = await Promise.all([
    getIssues(),
    getVolunteers(),
    getAssignments(),
  ]);

  const issue = issues.find((item) => item.id === issueId);
  const volunteer = volunteers.find((item) => item.id === volunteerId);

  if (!issue || !volunteer) {
    return res.status(404).json({ message: "Issue or volunteer not found." });
  }

  const updatedIssues = issues.map((item) =>
    item.id === issueId
      ? { ...item, status: "Assigned", assignedVolunteerId: volunteerId }
      : item,
  );
  const updatedVolunteers = volunteers.map((item) =>
    item.id === volunteerId
      ? {
          ...item,
          acceptedTaskIds: [...new Set([...(item.acceptedTaskIds || []), issueId])],
        }
      : item,
  );
  const assignment = {
    id: `assign-${nanoid(8)}`,
    issueId,
    volunteerId,
    issueType: issue.issueType,
    volunteerName: volunteer.name,
    location: issue.location,
    createdAt: new Date().toISOString(),
    status: "Assigned",
  };
  const updatedAssignments = [...assignments, assignment];

  await Promise.all([
    saveIssues(updatedIssues),
    saveAssignments(updatedAssignments),
    ...updatedVolunteers.map((item) => saveVolunteer(item)),
  ]);

  return res.json({ message: "Task accepted.", assignment });
});

app.post("/api/demo/simulate", async (_req, res) => {
  const [issues, volunteers, assignments] = await Promise.all([
    getIssues(),
    getVolunteers(),
    getAssignments(),
  ]);

  const newAssignments = [];
  const availableIssues = [...issues];
  const updatedVolunteers = [...volunteers];

  updatedVolunteers.slice(0, 3).forEach((volunteer, index) => {
    const topMatch = matchVolunteerToIssues(volunteer, availableIssues)[0];
    if (!topMatch) {
      return;
    }

    const issueIndex = availableIssues.findIndex((item) => item.id === topMatch.issueId);
    if (issueIndex === -1) {
      return;
    }

    const issue = availableIssues[issueIndex];
    availableIssues[issueIndex] = {
      ...issue,
      status: index % 2 === 0 ? "Resolved" : "Assigned",
      assignedVolunteerId: volunteer.id,
    };

    volunteer.acceptedTaskIds = [...new Set([...(volunteer.acceptedTaskIds || []), issue.id])];
    newAssignments.push({
      id: `assign-${nanoid(8)}`,
      issueId: issue.id,
      volunteerId: volunteer.id,
      issueType: issue.issueType,
      volunteerName: volunteer.name,
      location: issue.location,
      createdAt: new Date().toISOString(),
      status: index % 2 === 0 ? "Resolved" : "Assigned",
    });
  });

  const mergedAssignments = [...assignments, ...newAssignments];

  await Promise.all([
    saveIssues(availableIssues),
    saveAssignments(mergedAssignments),
    ...updatedVolunteers.map((item) => saveVolunteer(item)),
  ]);

  res.json({
    message: "Live assignment simulation completed.",
    assignments: newAssignments,
    stats: buildStats(availableIssues, updatedVolunteers, mergedAssignments),
  });
});

app.listen(port, () => {
  console.log(`SevaSetu backend running on port ${port}`);
});

function buildStats(issues, volunteers, assignments) {
  const resolvedCases = issues.filter((issue) => issue.status === "Resolved").length;
  const volunteersDeployed = volunteers.filter(
    (volunteer) => (volunteer.acceptedTaskIds || []).length > 0,
  ).length;

  return {
    totalIssues: issues.length,
    resolvedCases,
    volunteersDeployed,
    highSeverityIssues: issues.filter((issue) => issue.severity >= 3).length,
    activeAssignments: assignments.filter((assignment) => assignment.status === "Assigned")
      .length,
  };
}

function buildChartData(issues, volunteers, assignments) {
  const issuesByTypeMap = issues.reduce((acc, issue) => {
    acc[issue.issueType] = (acc[issue.issueType] || 0) + 1;
    return acc;
  }, {});

  const issuesByType = Object.entries(issuesByTypeMap).map(([name, value]) => ({
    name,
    value,
  }));

  const volunteersOverTime = ["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => ({
    day,
    deployed: Math.min(volunteers.length, index + 1 + assignments.length),
  }));

  return {
    issuesByType,
    volunteersOverTime,
  };
}
