import bcrypt from "bcrypt";
import pool from "../config/database";

interface User {
  name: string;
  email: string;
  passwordHash: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const saveUser = async (user: User) => {
  const query = `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, name, email;
  `;

  const values = [user.name, user.email, user.passwordHash];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
  const query = `
      SELECT id, name, email, password_hash
      FROM users
      WHERE email = $1
    `;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

export const comparePassword = async (
  password: string,
  passwordHash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, passwordHash);
};
