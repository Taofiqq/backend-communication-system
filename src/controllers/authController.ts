import { Request, Response } from "express";
import {
  hashPassword,
  saveUser,
  comparePassword,
  findUserByEmail,
} from "../services/authService";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password are required" });
    return;
  }

  try {
    const passwordHash = await hashPassword(password);
    const user = await saveUser({ name, email, passwordHash });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error: any) {
    if (error.code === "23505") {
      res.status(400).json({ error: "Email already exists" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
