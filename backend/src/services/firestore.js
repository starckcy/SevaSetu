import admin from "firebase-admin";
import { demoAssignments, demoIssues, demoVolunteers } from "./demoData.js";

let db = null;
let firebaseReady = false;

const mockStore = {
  issues: [...demoIssues],
  volunteers: [...demoVolunteers],
  assignments: [...demoAssignments],
  users: [],
};

function initializeFirebase() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return;
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  db = admin.firestore();
  firebaseReady = true;
}

initializeFirebase();

export function isFirebaseReady() {
  return firebaseReady;
}

async function replaceCollection(collectionName, records) {
  const collection = db.collection(collectionName);
  const batch = db.batch();
  const existing = await collection.get();

  existing.docs.forEach((doc) => batch.delete(doc.ref));
  records.forEach((record) => {
    batch.set(collection.doc(record.id), record);
  });

  await batch.commit();
}

export async function saveIssues(issues) {
  if (!firebaseReady) {
    mockStore.issues = issues;
    return issues;
  }

  await replaceCollection("issues", issues);
  return issues;
}

export async function getIssues() {
  if (!firebaseReady) {
    return mockStore.issues;
  }

  const snapshot = await db.collection("issues").get();
  return snapshot.docs.map((doc) => doc.data());
}

export async function saveVolunteer(volunteer) {
  if (!firebaseReady) {
    mockStore.volunteers = [
      ...mockStore.volunteers.filter((item) => item.id !== volunteer.id),
      volunteer,
    ];
    return volunteer;
  }

  await db.collection("volunteers").doc(volunteer.id).set(volunteer);
  return volunteer;
}

export async function getVolunteers() {
  if (!firebaseReady) {
    return mockStore.volunteers;
  }

  const snapshot = await db.collection("volunteers").get();
  return snapshot.docs.map((doc) => doc.data());
}

export async function saveUserProfile(profile) {
  if (!firebaseReady) {
    mockStore.users = [
      ...mockStore.users.filter((item) => item.id !== profile.id),
      profile,
    ];
    return profile;
  }

  await db.collection("users").doc(profile.id).set(profile, { merge: true });
  return profile;
}

export async function getUserProfile(id) {
  if (!id) {
    return null;
  }

  if (!firebaseReady) {
    return mockStore.users.find((item) => item.id === id) || null;
  }

  const snapshot = await db.collection("users").doc(id).get();
  return snapshot.exists ? snapshot.data() : null;
}

export async function saveAssignments(assignments) {
  if (!firebaseReady) {
    mockStore.assignments = assignments;
    return assignments;
  }

  await replaceCollection("assignments", assignments);
  return assignments;
}

export async function getAssignments() {
  if (!firebaseReady) {
    return mockStore.assignments;
  }

  const snapshot = await db.collection("assignments").get();
  return snapshot.docs.map((doc) => doc.data());
}

export async function saveDemoDataset({ issues, volunteers, assignments = [] }) {
  if (!firebaseReady) {
    mockStore.issues = issues;
    mockStore.volunteers = volunteers;
    mockStore.assignments = assignments;
    return { issues, volunteers, assignments };
  }

  await Promise.all([
    replaceCollection("issues", issues),
    replaceCollection("volunteers", volunteers),
    replaceCollection("assignments", assignments),
  ]);

  return { issues, volunteers, assignments };
}
