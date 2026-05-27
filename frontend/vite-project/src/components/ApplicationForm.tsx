import { useState } from "react";
import type {
  Application,
  ApplicationStatus,
  ApplicationPriority,
  CreateApplicationPayload,
} from "../src/api.js";

type Props = {
  initial?: Application;
  onSubmit: (payload: CreateApplicationPayload) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
};

const STATUSES: ApplicationStatus[] = [
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
  "ghosted",
  "didn't pursue",
];
const PRIORITIES: ApplicationPriority[] = ["low", "medium", "high"];

export default function ApplicationForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: Props) {
  const [company, setCompany] = useState(initial?.company ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [status, setStatus] = useState<ApplicationStatus>(
    initial?.status ?? "applied",
  );
  const [priority, setPriority] = useState<ApplicationPriority>(
    initial?.priority ?? "medium",
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({
      company,
      role,
      status,
      priority,
      notes: notes || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Company
        </label>
        <input
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
          placeholder="e.g. Accenture"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Role
        </label>
        <input
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
          placeholder="e.g. Junior React Developer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Status
          </label>
          <select
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
            value={status}
            onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Priority
          </label>
          <select
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
            value={priority}
            onChange={(e) => setPriority(e.target.value as ApplicationPriority)}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Notes
        </label>
        <textarea
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors resize-none"
          placeholder="Recruiter name, referral, anything useful..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 text-sm font-bold py-2.5 rounded-lg transition-colors"
        >
          {loading ? "Saving..." : initial ? "Save Changes" : "Add Application"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
