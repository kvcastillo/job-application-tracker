import express from "express";
import cors from "cors";
import applicationsRouter from "./src/routes/applications.js";

const app = express();
const PORT = 3000;

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method}  ${req.url}`);
  next();
});

app.use("/api/v1/applications", applicationsRouter);
console.log("Router registered:", applicationsRouter);

app.listen(PORT, () => {
  console.log(`listening on port : ${PORT}`);
});
