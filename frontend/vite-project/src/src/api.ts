const BASE_URL = "https://job-application-tracker-wiqx.onrender.com/api/v1";

function getToken() {
  return localStorage.getItem("token");
}

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.message || "API request failed");
  }

  return json;
}

/* ---------------- TYPES ---------------- */

export type ApplicationStatus =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "ghosted"
  | "didn't pursue";

export type ApplicationPriority = "low" | "medium" | "high";

export type Application = {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  priority: ApplicationPriority;
  notes: string | null;
  appliedAt: string;
  updatedAt: string;
};

export type CreateApplicationPayload = {
  company: string;
  role: string;
  status: ApplicationStatus;
  priority: ApplicationPriority;
  notes?: string;
};

export type UpdateApplicationPayload = Partial<CreateApplicationPayload>;

/* ---------------- API ---------------- */

export async function getApplications(): Promise<Application[]> {
  const json = await apiFetch("/applications");
  return json.data;
}

export async function createApplication(
  payload: CreateApplicationPayload,
): Promise<Application> {
  const json = await apiFetch("/applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return json.data;
}

export async function updateApplication(
  id: string,
  payload: UpdateApplicationPayload,
): Promise<Application> {
  const json = await apiFetch(`/applications/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  console.log("json from updateApplication:", json);

  return json.data;
}

export async function deleteApplication(id: string): Promise<void> {
  await apiFetch(`/applications/${id}`, {
    method: "DELETE",
  });
}
