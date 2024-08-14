// lib/generateHashtags.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateHashtags = async (eventname: string, description: string): Promise<string[]> => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API as string);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const promptText = `Generate 5 best Hashtags that can be shared on Social Media according to the given eventname and description. Some can be abbreviated hashtags and some can be normal. Event name is ${eventname} and description is ${description}`;
    const result = await model.generateContent(promptText);
    const response = result.response;
    const text = response.text();
    const hashtagsArray = text.match(/#\w+/g) || [];
    return hashtagsArray;
  } catch (error) {
    console.error("Error generating hashtags:", error);
    return [];
  }
};