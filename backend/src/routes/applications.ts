import { Router, type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

const getUserId = (req: Request) => (req as any).user.userId;

/* ---------------- GET ALL  ---------------- */
router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const applications = await prisma.application.findMany({
      where: { userId },
      orderBy: { appliedAt: "desc" },
    });

    return res.status(200).json({ data: applications });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed to fetch applications" });
  }
});

/* ---------------- CREATE ---------------- */
router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { company, role, status, priority, notes } = req.body;

    const application = await prisma.application.create({
      data: {
        company,
        role,
        status: status ?? "applied",
        priority: priority ?? "medium",
        notes,
        userId,
      },
    });

    return res.status(201).json({ data: application });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed to create application" });
  }
});

/* ---------------- UPDATE ---------------- */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const { company, role, status, priority, notes } = req.body;

    console.log(`id is : ${id}`);
    const updated = await prisma.application.updateMany({
      where: { id, userId },
      data: { company, role, status, priority, notes },
    });

    if (updated.count === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json({ message: "Updated" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed to update" });
  }
});

/* ---------------- DELETE ---------------- */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const deleted = await prisma.application.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed to delete" });
  }
});

export default router;
