import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/database";
import authRoutes from "./routes/authRoute";
import accountRoutes from "./routes/accountRoutes";
import aiRoutes from "./routes/aiRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/accounts", accountRoutes);
app.use("/ai", aiRoutes);

app.get("/health", (req, res) => {
  res.send(`Server is up and running on ${PORT}!`);
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res
      .status(200)
      .json({ message: "Database connected!", time: result.rows[0].now });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
