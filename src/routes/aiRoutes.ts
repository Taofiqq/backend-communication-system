import express from "express";
import { handleUserQuery } from "@controllers/aiController";

const router = express.Router();

router.post("/query", handleUserQuery);

export default router;
