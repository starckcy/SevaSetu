import {
  ClipboardCheck,
  ClipboardList,
  LayoutDashboard,
  Lightbulb,
  MapPin,
  Users,
} from "lucide-react";

export const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "map", label: "Map", icon: MapPin },
  { id: "issues", label: "Issues", icon: ClipboardList },
  { id: "volunteers", label: "Volunteers", icon: Users },
  { id: "assignments", label: "Assignments", icon: ClipboardCheck },
  { id: "insights", label: "Insights", icon: Lightbulb },
];
