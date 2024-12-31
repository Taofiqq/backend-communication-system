import { Request, Response } from "express";
import { generateAIResponse } from "../services/aiService";
export const handleUserQuery = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { query } = req.body;

  if (!query) {
    res.status(400).json({ error: "Query is required" });
    return;
  }

  try {
    const aiResponse = await generateAIResponse(query);
    res.status(200).json({
      message: "AI response generated successfully",
      intent: aiResponse.intent,
      response: aiResponse.response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
};
