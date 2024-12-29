import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
console.log("===> PORT <===", PORT);

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.send(`Server is up and running on ${PORT}!`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
