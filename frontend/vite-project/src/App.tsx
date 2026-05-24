import { useState, useEffect, useMemo } from "react";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "./src/api.js";
import type {
  Application,
  ApplicationStatus,
  CreateApplicationPayload,
} from "./src/api.js";
import ApplicationCard from "./components/ApplicationCard";
import ApplicationForm from "./components/ApplicationForm";
import StatsBar from "./components/StatsBar";
import Modal from "./components/Modal";

const FILTER_OPTIONS: { label: string; value: ApplicationStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Applied", value: "applied" },
  { label: "Screening", value: "screening" },
  { label: "Interview", value: "interview" },
  { label: "Offer", value: "offer" },
  { label: "Rejected", value: "rejected" },
  { label: "Ghosted", value: "ghosted" },
];

export default function App() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Application | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadApplications();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  async function loadApplications() {
    setFetching(true);
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  }

  async function handleCreate(payload: CreateApplicationPayload) {
    setSubmitting(true);
    try {
      const created = await createApplication(payload);
      setApplications((prev) => [created, ...prev]);
      setShowAddModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(payload: CreateApplicationPayload) {
    if (!editTarget) return;
    setSubmitting(true);
    try {
      const updated = await updateApplication(editTarget.id, payload);
      setApplications((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a)),
      );
      setEditTarget(null);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = useMemo(
    () =>
      applications.filter((a) => {
        const matchesFilter = filter === "all" || a.status === filter;
        const matchesSearch =
          a.company.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          a.role.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchesFilter && matchesSearch;
      }),
    [applications, filter, debouncedSearch],
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Tracker</h1>
            <p className="text-zinc-500 text-sm mt-1">
              Keep tabs on every application.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
          >
            + Add Application
          </button>
        </div>

        <StatsBar applications={applications} />

        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-center flex-wrap">
            <input
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors w-64"
              placeholder="Search company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-2 flex-wrap">
              {FILTER_OPTIONS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                    filter === value
                      ? "bg-amber-500 border-amber-500 text-zinc-950"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {fetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 h-36 animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
              <p className="text-zinc-400 font-medium">No applications found</p>
              <p className="text-zinc-600 text-sm">
                Try a different filter or add a new one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onEdit={setEditTarget}
                  onDelete={handleDelete}
                  deleting={deletingId === application.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <Modal title="New Application" onClose={() => setShowAddModal(false)}>
          <ApplicationForm
            onSubmit={handleCreate}
            onCancel={() => setShowAddModal(false)}
            loading={submitting}
          />
        </Modal>
      )}

      {editTarget && (
        <Modal title="Edit Application" onClose={() => setEditTarget(null)}>
          <ApplicationForm
            initial={editTarget}
            onSubmit={handleUpdate}
            onCancel={() => setEditTarget(null)}
            loading={submitting}
          />
        </Modal>
      )}
    </div>
  );
}
