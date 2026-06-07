import express from "express";
import authRouter from "./src/routes/auth.js";
import cors from "cors";
import applicationsRouter from "./src/routes/applications.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method}  ${req.url}`);
  next();
});
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/applications", applicationsRouter);

app.get("/", (req, res) => {
  res.json({ message: "API is alive : ", status: "ok" });
});

app.listen(PORT, () => {
  console.log(`listening on port : ${PORT}`);
});
