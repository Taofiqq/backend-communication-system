import openai from "@config/openai";
import { categorizeUserIntent } from "@utils/categories";

export const generateAIResponse = async (userQuery: string) => {
  const intent = categorizeUserIntent(userQuery);

  let prompt = "";

  if (intent === "balance_inquiry") {
    prompt = `User asked: "${userQuery}". Provide a response about account balance.`;
  } else if (intent === "transaction_history") {
    prompt = `User asked: "${userQuery}". Provide a response about transaction history.`;
  } else {
    prompt = `User asked: "${userQuery}". Provide a general support response.`;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful banking assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150,
    });

    return {
      intent,
      response: response.choices[0].message.content?.trim(),
    };
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response");
  }
};
