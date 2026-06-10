import type { Application } from "../src/api.js";

type Props = {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
  deleting: boolean;
};

const STATUS_STYLES: Record<string, string> = {
  applied: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  screening: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  interview: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  offer: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  rejected: "bg-red-500/15 text-red-400 border-red-500/30",
  ghosted: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

const PRIORITY_DOT: Record<string, string> = {
  low: "bg-zinc-500",
  medium: "bg-amber-400",
  high: "bg-red-400",
};

export default function ApplicationCard({
  application,
  onEdit,
  onDelete,
  deleting,
}: Props) {
  const appliedDate = new Date(application.appliedAt).toLocaleDateString(
    "en-PH",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <div className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 sm:p-5 flex flex-col gap-3 transition-all duration-200">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-white font-semibold text-base leading-snug break-words">
            {application.company}
          </p>

          <p className="text-zinc-400 text-sm break-words">
            {application.role}
          </p>
        </div>

        <span
          className={`w-fit shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[application.status]}`}
        >
          {application.status.charAt(0).toUpperCase() +
            application.status.slice(1)}
        </span>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${PRIORITY_DOT[application.priority]}`}
          />
          <span className="text-xs text-zinc-500 capitalize">
            {application.priority} priority
          </span>
        </div>

        <span className="text-zinc-700 text-xs hidden sm:inline">•</span>

        <span className="text-xs text-zinc-500">{appliedDate}</span>
      </div>

      {/* Notes */}
      {application.notes && (
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 border-t border-zinc-800 pt-3 break-words">
          {application.notes}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={() => onEdit(application)}
          className="flex-1 h-11 text-sm font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(application.id)}
          disabled={deleting}
          className="flex-1 h-11 text-sm font-medium rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 disabled:opacity-50 transition-colors"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
