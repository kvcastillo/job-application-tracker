import express from "express";
import cors from "cors";

import authRouter from "./src/routes/auth.js";
import applicationsRouter from "./src/routes/applications.js";

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- LOGGING (MOVE UP!) ---------------- */
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/* ---------------- ROUTES ---------------- */
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/applications", applicationsRouter);

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.json({ message: "API alive", status: "ok" });
});

/* ---------------- START ---------------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
