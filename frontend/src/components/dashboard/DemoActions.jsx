import { PlayCircle, Sparkles, Upload } from "lucide-react";

import Card from "../common/Card";

export default function DemoActions({
  canManage,
  loading,
  onDemoLoad,
  onFileUpload,
  onSimulate,
}) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-white">Data Management</h3>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canManage || loading}
          onClick={onDemoLoad}
          type="button"
        >
          <Sparkles size={16} />
          Load Sample Data
        </button>
        <label
          className={`inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200 transition ${
            canManage ? "hover:bg-white/5" : "cursor-not-allowed opacity-50"
          }`}
        >
          <Upload size={16} />
          Upload Data
          <input
            accept=".csv"
            className="hidden"
            disabled={!canManage || loading}
            type="file"
            onChange={onFileUpload}
          />
        </label>
        <button
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canManage || loading}
          onClick={onSimulate}
          type="button"
        >
          <PlayCircle size={16} />
          Simulate Update
        </button>
      </div>
      {!canManage ? (
        <p className="mt-4 text-xs text-slate-500">
          Sign in with an admin role to upload data and manage updates.
        </p>
      ) : null}
    </Card>
  );
}
