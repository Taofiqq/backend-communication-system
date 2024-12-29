import pool from "@config/database";

export const fetchAccounts = async (userId: number) => {
  const query = `
    SELECT * FROM accounts
    WHERE customer_id = $1;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const fetchTransactions = async (accountId: number) => {
  const query = `
    SELECT * FROM transactions
    WHERE account_id = $1;
  `;
  const result = await pool.query(query, [accountId]);
  return result.rows;
};

export const createNewTransaction = async (
  accountId: number,
  type: string,
  amount: number
) => {
  const query = `
    INSERT INTO transactions (account_id, type, amount)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [accountId, type, amount]);

  const balanceUpdate = type === "DEPOSIT" ? amount : -amount;
  await pool.query(
    `
    UPDATE accounts
    SET balance = balance + $1
    WHERE id = $2;
  `,
    [balanceUpdate, accountId]
  );

  return result.rows[0];
};

export const transferBetweenAccounts = async (
  fromAccountId: number,
  toAccountId: number,
  amount: number
) => {
  await pool.query(
    `
    UPDATE accounts
    SET balance = balance - $1
    WHERE id = $2 AND balance >= $1;
  `,
    [amount, fromAccountId]
  );

  await pool.query(
    `
    UPDATE accounts
    SET balance = balance + $1
    WHERE id = $2;
  `,
    [amount, toAccountId]
  );

  const result = await pool.query(
    `
    INSERT INTO transactions (account_id, type, amount)
    VALUES 
      ($1, 'TRANSFER', $2),
      ($3, 'TRANSFER', $2)
    RETURNING *;
  `,
    [fromAccountId, amount, toAccountId]
  );

  return result.rows;
};
