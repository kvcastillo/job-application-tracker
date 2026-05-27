import { Router, type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

const VALID_STATUSES = [
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
  "ghosted",
  "didn't pursue",
];

const VALID_PRIORITIES = ["low", "medium", "high"];

router.get("/", async (req: Request, res: Response) => {
  console.log("Prisma : ", prisma);
  console.log("get route hit.");
  try {
    const applications = await prisma.application.findMany({
      orderBy: { appliedAt: "desc" },
    });
    res.status(200).json({ data: applications });
  } catch (e) {
    console.error("Failed to fetch applications:", e);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const application = await prisma.application.findUnique({ where: { id } });
    if (!application) {
      res.status(404).json({ message: "Application not found" });
      return;
    }
    res.status(200).json({ data: application });
  } catch (e) {
    console.error("Failed to fetch application:", e);
    res.status(500).json({ message: "Failed to fetch application" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { company, role, status, priority, notes } = req.body;

  if (!company || !role) {
    res.status(400).json({ message: "Company and role are required" });
    return;
  }

  if (status && !VALID_STATUSES.includes(status)) {
    res
      .status(400)
      .json({ message: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
    return;
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    res.status(400).json({
      message: `Priority must be one of: ${VALID_PRIORITIES.join(", ")}`,
    });
    return;
  }

  try {
    const application = await prisma.application.create({
      data: {
        company,
        role,
        status: status ?? "applied",
        priority: priority ?? "medium",
        notes,
      },
    });

    res.status(201).json({
      message: `Application to ${application.company} added`,
      data: application,
    });
  } catch (e) {
    console.error("Failed to create application:", e);
    res.status(500).json({ message: "Failed to create application" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  console.log("Request to update route ");
  console.log("Request Params : ", req.params);
  console.log("body : ", req.body);
  const { id } = req.params;

  const { company, role, status, priority, notes } = req.body;

  if (status && !VALID_STATUSES.includes(status)) {
    res
      .status(400)
      .json({ message: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
    return;
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    res.status(400).json({
      message: `Priority must be one of: ${VALID_PRIORITIES.join(", ")}`,
    });
    return;
  }

  try {
    const existing = await prisma.application.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        ...(company && { company }),
        ...(role && { role }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(notes !== undefined && { notes }),
      },
    });

    res.status(200).json({ message: `Application updated`, data: updated });
  } catch (e) {
    console.error("Failed to update application:", e);
    res.status(500).json({ message: "Failed to update application" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const existing = await prisma.application.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    const deleted = await prisma.application.delete({ where: { id } });
    res.status(200).json({
      message: `Deleted application at ${deleted.company}`,
      data: deleted,
    });
  } catch (e) {
    console.error("Failed to delete application:", e);
    res.status(500).json({ message: "Failed to delete application" });
  }
});

export default router;
