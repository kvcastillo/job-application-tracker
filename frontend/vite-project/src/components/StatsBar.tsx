import type { Application } from "../src/api.js";

type Props = {
  applications: Application[];
};

const STAT_ITEMS = [
  { label: "Total", key: "total", color: "text-white" },
  { label: "Applied", key: "applied", color: "text-blue-400" },
  { label: "Interview", key: "interview", color: "text-amber-400" },
  { label: "Offer", key: "offer", color: "text-emerald-400" },
  { label: "Rejected", key: "rejected", color: "text-red-400" },
];

export default function StatsBar({ applications }: Props) {
  const counts: Record<string, number> = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "applied").length,
    interview: applications.filter((a) => a.status === "interview").length,
    offer: applications.filter((a) => a.status === "offer").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="grid grid-cols-5 gap-3">
      {STAT_ITEMS.map(({ label, key, color }) => (
        <div
          key={key}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-1"
        >
          <span className={`text-2xl font-bold tabular-nums ${color}`}>
            {counts[key]}
          </span>
          <span className="text-xs text-zinc-500 font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}
