import express from "express";
import { authenticate } from "@middlewares/authMiddleware";
import {
  getAccounts,
  getTransactions,
  //   createTransaction,
  transferFunds,
} from "@controllers/accountController";

const router = express.Router();

// router.use(authenticate);

router.get("/", getAccounts);
router.get("/:accountId/transactions", getTransactions);
// router.post("/:accountId/transactions", createTransaction);
router.post("/:accountId/transfer", transferFunds);

export default router;
