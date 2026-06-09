import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Application | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    async function loadApplications() {
      setFetching(true);

      try {
        const data = await getApplications();

        setApplications(data);
      } catch (e) {
        console.error("Something went wrong with loading applications:", e);
      } finally {
        setFetching(false);
      }
    }

    loadApplications();
  }, []);

  /* ---------------- SEARCH DEBOUNCE ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  /* ---------------- CRUD ---------------- */
  async function handleCreate(payload: CreateApplicationPayload) {
    setSubmitting(true);
    try {
      const created = await createApplication(payload);
      setApplications((prev) => [created, ...prev]);
      setShowAddModal(false);
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
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);

    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  /* ---------------- FILTERED DATA ---------------- */
  const filtered = useMemo(() => {
    return applications.filter((a) => {
      const matchesFilter = filter === "all" || a.status === filter;

      const matchesSearch =
        a.company.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        a.role.toLowerCase().includes(debouncedSearch.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [applications, filter, debouncedSearch]);

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Tracker</h1>
            <p className="text-zinc-500 text-sm mt-1">
              Keep tabs on every application.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-bold px-5 py-2.5 rounded-lg"
          >
            + Add Application
          </button>
        </div>

        <StatsBar applications={applications} />

        {/* SEARCH + FILTER */}
        <div className="flex gap-3 flex-wrap items-center">
          <input
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm"
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {FILTER_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`text-xs px-3 py-1.5 rounded-lg border ${
                filter === value
                  ? "bg-amber-500 text-black"
                  : "bg-zinc-900 text-zinc-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {fetching ? (
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-zinc-900 h-32 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-zinc-500 text-center py-20">
            No applications found
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {filtered.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onEdit={setEditTarget}
                onDelete={handleDelete}
                deleting={deletingId === app.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
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
