import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Card from "../common/Card";

const pieColors = ["#38bdf8", "#a78bfa", "#f59e0b", "#34d399", "#fb7185"];

export default function ChartsPanel({ chartData }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <h3 className="text-lg font-semibold text-white">Issues by Type</h3>
        <p className="mt-1 text-sm text-slate-400">
          A quick overview for judges to understand demand concentration.
        </p>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.issuesByType}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
              >
                {chartData.issuesByType.map((entry, index) => (
                  <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-white">Volunteers Deployed Over Time</h3>
        <p className="mt-1 text-sm text-slate-400">
          Simple momentum chart for the live assignment story.
        </p>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.volunteersOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="deployed" fill="#22d3ee" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
