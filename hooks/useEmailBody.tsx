// lib/generateEmailContent.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateEmailContent = async (eventName: string, description: string): Promise<{ emailSubject: string, emailBody: string }> => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API as string);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const promptText = `Generate an email title and body for inviting someone to an event. The event name is "${eventName}" and the description is "${description}". The email title should be: "We are inviting you to meet us at ${eventName}". The email body should be: "Hi, we will be going to ${eventName} and you are invited to meet with us. Here are some details about the event: ${description}. We look forward to seeing you there!"`;
    const result = await model.generateContent(promptText);
    const response = result.response;
    const text = response.text();
    // Extract the title and body from the response
    const titleMatch = text.match(/Email Title:\s*(.*)/);
    const bodyMatch = text.match(/Email Body:\s*([\s\S]*)/);

    const emailSubject = titleMatch ? titleMatch[1].trim() : `We are inviting you to meet us at ${eventName}`;
    const emailBody = bodyMatch ? bodyMatch[1].trim() : `Hi, we will be going to ${eventName} and you are invited to meet with us. Here are some details about the event: ${description}. We look forward to seeing you there!`;

    return { emailSubject, emailBody };
  } catch (error) {
    console.error("Error generating email content:", error);
    return {
        emailSubject: `We are inviting you to meet us at ${eventName}`,
        emailBody: `Hi, we will be going to ${eventName} and you are invited to meet with us. Here are some details about the event: ${description}. We look forward to seeing you there!`
    };
  }
};
