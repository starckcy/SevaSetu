import { useState } from "react";

import Card from "../common/Card";

const skills = ["Medical", "Logistics", "Education", "Rescue", "Counseling"];

export default function VolunteerForm({ canCreate, onSubmit, saving }) {
  const [form, setForm] = useState({
    name: "",
    location: "",
    availability: "Immediate",
    skills: ["Logistics"],
  });

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canCreate) {
      return;
    }
    await onSubmit(form);
    setForm({
      name: "",
      location: "",
      availability: "Immediate",
      skills: ["Logistics"],
    });
  }

  function toggleSkill(skill) {
    setForm((current) => ({
      ...current,
      skills: current.skills.includes(skill)
        ? current.skills.filter((item) => item !== skill)
        : [...current.skills, skill],
    }));
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white">Create Volunteer Profile</h3>
      <p className="mt-1 text-sm text-slate-400">
        Useful for demoing task recommendations and deployment readiness.
      </p>
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-300/40"
          placeholder="Volunteer name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <input
          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-300/40"
          placeholder="Location"
          value={form.location}
          onChange={(event) => setForm({ ...form, location: event.target.value })}
        />
        <select
          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
          value={form.availability}
          onChange={(event) => setForm({ ...form, availability: event.target.value })}
        >
          <option>Immediate</option>
          <option>This week</option>
          <option>Weekend</option>
        </select>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <button
              key={skill}
              className={`rounded-full px-3 py-2 text-sm ${
                form.skills.includes(skill)
                  ? "bg-cyan-400/20 text-cyan-100"
                  : "bg-slate-950/60 text-slate-400"
              }`}
              type="button"
              onClick={() => toggleSkill(skill)}
            >
              {skill}
            </button>
          ))}
        </div>
        <button
          className="w-full rounded-2xl bg-white px-4 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canCreate || saving}
          type="submit"
        >
          {saving ? "Saving..." : "Create volunteer"}
        </button>
      </form>
    </Card>
  );
}
