import { Request, Response } from "express";
import {
  fetchAccounts,
  fetchTransactions,
  createNewTransaction,
  transferBetweenAccounts,
} from "../services/accountService";

export const getAccounts = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  try {
    const accounts = await fetchAccounts(userId);
    res.status(200).json({ accounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch accounts" });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  const { accountId } = req.params;

  try {
    const transactions = await fetchTransactions(Number(accountId));
    res.status(200).json({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch transactions" });
  }
};

// export const createTransaction = async (req: Request, res: Response) => {
//   const { accountId } = req.params;
//   const { type, amount } = req.body;

//   if (!["DEPOSIT", "WITHDRAWAL"].includes(type)) {
//     return res.status(400).json({ error: "Invalid transaction type" });
//   }

//   try {
//     const transaction = await createNewTransaction(
//       Number(accountId),
//       type,
//       amount
//     );
//     res.status(201).json({ transaction });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Unable to create transaction" });
//   }
// };

export const transferFunds = async (req: Request, res: Response) => {
  const { accountId } = req.params;
  const { targetAccountId, amount } = req.body;

  try {
    const transfer = await transferBetweenAccounts(
      Number(accountId),
      Number(targetAccountId),
      amount
    );
    res.status(201).json({ transfer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to perform transfer" });
  }
};
