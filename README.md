# SevaSetu - NGO Intelligence & Volunteer Matching Platform

SevaSetu is a polished hackathon demo for NGOs: upload issue data, visualize hotspots on a live map, generate AI briefings, and match volunteers to the right tasks with live operational updates.

## What is new

- Modern dashboard shell with sidebar navigation and cleaner visual hierarchy
- Firebase Google Sign-In with role selection (`NGO admin` or `Volunteer`)
- Smarter volunteer scoring with weighted match confidence
- Clustered Google Maps view with severity-colored markers and issue detail popups
- Real-time-ready frontend hooks for Firestore-backed collections
- Dedicated AI Insights page with urgent areas, rising issues, volunteer gaps, and actions
- Demo mode with `Demo data` and `Simulate assignment` flows
- Recharts-based impact dashboard

## File structure

```text
SevaSetu/
  backend/
    src/
      services/
        demoData.js
        firestore.js
        gemini.js
      utils/
        csvParser.js
        matching.js
      server.js
    .env.example
    package.json
  frontend/
    src/
      components/
        common/
        dashboard/
        insights/
        layout/
        map/
        volunteers/
      data/
        navigation.js
      hooks/
        useAuth.js
        useDashboardData.js
        useRealtimeCollection.js
        useToast.js
      services/
        firebase.js
      api.js
      App.jsx
      index.css
      main.jsx
    .env.example
    package.json
    postcss.config.js
    tailwind.config.js
    vite.config.js
  sample-data/
    issues.csv
  package.json
  README.md
```

## Tech stack

- Frontend: React + Tailwind CSS + Vite
- Backend: Node.js + Express
- Database: Firebase Firestore with mock fallback
- Auth: Firebase Google Authentication
- Maps: Google Maps API
- AI: Google Gemini API
- Charts: Recharts

## Environment variables

### Backend: `backend/.env`

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
GEMINI_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

### Frontend: `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Local setup

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure env files

Create `backend/.env` from `backend/.env.example`.

Create `frontend/.env` from `frontend/.env.example`.

### 3. Start the app

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Optional root-level shortcuts:

```bash
npm run backend:dev
npm run frontend:dev
```

## Demo instructions

### Fast demo flow for judges

1. Open `http://localhost:5173`
2. Sign in with Google if Firebase Auth is configured
3. Choose `NGO admin`
4. Click `Demo data`
5. Show KPI cards and charts on the `Dashboard`
6. Open the `Map` page and click a clustered hotspot marker
7. Open `Insights` to show the Gemini-generated operational briefing
8. Open `Volunteers` to show weighted confidence scores
9. Click `Simulate assignment` and point out updated stats

### No API keys? Still demoable

- No Firestore config: the backend uses mock in-memory storage
- No Gemini config: the backend returns fallback AI-style insights
- No Google Maps key: the UI shows a graceful placeholder instead of breaking
- No Firebase Auth config: the app still loads in guest mode

## Main API endpoints

- `GET /api/bootstrap` - combined dashboard payload
- `POST /api/demo/load` - load story-ready demo data
- `POST /api/demo/simulate` - simulate live assignment updates
- `POST /api/issues/upload` - upload issue CSV
- `POST /api/volunteers` - create volunteer profile
- `POST /api/issues/:issueId/accept` - accept a task
- `POST /api/auth/profile` - save signed-in user role
- `GET /api/insights` - AI insights payload

## Deployment options

### Option 1: Vercel + Render

- Deploy `frontend/` to Vercel
- Deploy `backend/` to Render as a Node web service
- Set `VITE_API_BASE_URL` to the deployed backend URL
- Add backend env vars in Render and frontend env vars in Vercel

### Option 2: Firebase Hosting + Render

- Build frontend with `npm run build` in `frontend/`
- Deploy the built frontend to Firebase Hosting
- Deploy backend to Render
- Point frontend API base URL to the Render backend

## Notes

- Role gating is intentionally lightweight for hackathon speed and demo clarity.
- Firestore listeners are wired through the frontend Firebase service; if you connect the same project config for auth and data, live collection changes can stream into the UI.
- Matching logic is designed to be understandable in a demo: `skills 40%`, `distance 30%`, `urgency 30%`.
