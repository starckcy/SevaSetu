import { useMemo, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Users } from "lucide-react";

import SkeletonCard from "./components/common/SkeletonCard";
import SectionHeader from "./components/common/SectionHeader";
import ToastStack from "./components/common/ToastStack";
import AssignmentsTable from "./components/assignments/AssignmentsTable";
import ChartsPanel from "./components/dashboard/ChartsPanel";
import DemoActions from "./components/dashboard/DemoActions";
import IssueTable from "./components/dashboard/IssueTable";
import KpiCard from "./components/dashboard/KpiCard";
import InsightsPanel from "./components/insights/InsightsPanel";
import RoleModal from "./components/layout/RoleModal";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import MapExperience from "./components/map/MapExperience";
import VolunteerForm from "./components/volunteers/VolunteerForm";
import VolunteerRecommendations from "./components/volunteers/VolunteerRecommendations";
import { useAuth } from "./hooks/useAuth";
import { useDashboardData } from "./hooks/useDashboardData";
import { useToast } from "./hooks/useToast";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [busy, setBusy] = useState(false);
  const { toasts, showToast } = useToast();
  const { data, loading, uploadCsv, createVolunteer, loadDemoData, simulateAssignments, acceptTask } =
    useDashboardData(showToast);
  const auth = useAuth(showToast);

  const canManage = auth.profile?.role === "NGO admin";
  const canAccept = auth.profile?.role === "Volunteer" || canManage;

  const kpis = useMemo(
    () => [
      {
        label: "Total active issues",
        value: data.stats.totalIssues,
        helper: "Currently open and in progress",
        trendText: "+12% this week",
        icon: Activity,
      },
      {
        label: "Resolved cases",
        value: data.stats.resolvedCases,
        helper: "Closed in the last 30 days",
        trendText: "+4% this week",
        icon: CheckCircle2,
      },
      {
        label: "Volunteers deployed",
        value: data.stats.volunteersDeployed,
        helper: "Active responders assigned",
        trendText: "+7% this week",
        icon: Users,
      },
      {
        label: "High priority issues",
        value: data.stats.highSeverityIssues,
        helper: "High and critical severity",
        trendText: "-2% this week",
        icon: AlertTriangle,
      },
    ],
    [data.stats],
  );

  async function runAction(action, successTitle, successMessage) {
    try {
      setBusy(true);
      await action();
      showToast({
        tone: "success",
        title: successTitle,
        message: successMessage,
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Action failed",
        message: error.message,
      });
    } finally {
      setBusy(false);
    }
  }

  const pageContent = {
    dashboard: (
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Operations"
          title="Operations Overview"
          description="Monitor field issues, deployments, and response activity in real time."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} className="h-36" />
              ))
            : kpis.map((item) => <KpiCard key={item.label} {...item} />)}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <IssueTable issues={data.issues} />
          <DemoActions
            canManage={canManage}
            loading={busy}
            onDemoLoad={() =>
              runAction(loadDemoData, "Sample data loaded", "Issue and volunteer records updated.")
            }
            onFileUpload={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              runAction(
                () => uploadCsv(file),
                "CSV uploaded",
                "Issue records updated.",
              );
            }}
            onSimulate={() =>
              runAction(
                simulateAssignments,
                "Update complete",
                "Assignments and totals updated.",
              )
            }
          />
        </div>
        <ChartsPanel chartData={data.chartData} />
      </div>
    ),
    map: (
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Map"
          title="Coverage Map"
          description="View reported issues by location and severity."
        />
        <MapExperience issues={data.issues} />
      </div>
    ),
    issues: (
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Issues"
          title="Active Issues"
          description="Review issue details and current status."
        />
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <IssueTable issues={data.issues} />
          <DemoActions
            canManage={canManage}
            loading={busy}
            onDemoLoad={() =>
              runAction(loadDemoData, "Sample data loaded", "Issue and volunteer records updated.")
            }
            onFileUpload={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              runAction(() => uploadCsv(file), "Upload complete", "Issue records updated.");
            }}
            onSimulate={() =>
              runAction(simulateAssignments, "Update complete", "Assignments and totals updated.")
            }
          />
        </div>
      </div>
    ),
    volunteers: (
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Volunteers"
          title="Volunteer Matching"
          description="Match volunteers to issues based on skills, proximity, and urgency."
        />
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <VolunteerForm
            canCreate={canManage}
            onSubmit={(payload) =>
              runAction(
                () => createVolunteer(payload),
                "Volunteer created",
                `${payload.name} is now available for matching.`,
              )
            }
            saving={busy}
          />
          <VolunteerRecommendations
            canAccept={canAccept}
            onAccept={(issueId, volunteerId) =>
              runAction(
                () => acceptTask(issueId, volunteerId),
                "Task accepted",
                "The assignment and KPI cards were updated.",
              )
            }
            recommendations={data.recommendations}
            volunteerDirectory={data.volunteers}
          />
        </div>
      </div>
    ),
    assignments: (
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Assignments"
          title="Assignments"
          description="Track which volunteers are assigned to active issues."
        />
        <AssignmentsTable assignments={data.assignments} />
      </div>
    ),
    insights: (
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Insights"
          title="Operational Insights"
          description="Key trends and recommendations based on current issue and volunteer data."
        />
        <InsightsPanel insights={data.insights} />
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0f172a_0%,#020617_55%)] px-4 py-4 text-slate-100 md:px-6">
      <ToastStack toasts={toasts} />
      <RoleModal open={auth.rolePromptOpen} onSelect={auth.completeProfile} />
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Sidebar activePage={activePage} onNavigate={setActivePage} profile={auth.profile} />
        <div className="space-y-4">
          <TopBar
            firebaseConfigured={auth.firebaseConfigured}
            onGoogleLogin={auth.signIn}
            onLogout={auth.signOut}
            profile={auth.profile}
            statusText={
              loading || auth.authLoading ? "Loading workspace…" : "Operations Dashboard"
            }
            user={auth.user}
          />
          <main className="rounded-3xl border border-white/10 bg-slate-950/30 p-6 md:p-7">
            {pageContent[activePage]}
          </main>
        </div>
      </div>
    </div>
  );
}
