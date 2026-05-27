const BASE_URL =
  "https://job-application-tracker-wiqx.onrender.com/api/v1/applications";

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

export async function getApplications(): Promise<Application[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch applications");
  const json = await res.json();
  return json.data;
}

export async function createApplication(
  payload: CreateApplicationPayload,
): Promise<Application> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create application");
  const json = await res.json();
  return json.data;
}

export async function updateApplication(
  id: string,
  payload: UpdateApplicationPayload,
): Promise<Application> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update application");
  const json = await res.json();
  return json.data;
}

export async function deleteApplication(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete application");
}
