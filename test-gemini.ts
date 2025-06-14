import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your actual API key - using environment variable is safer
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDrIbnRV8PGYsEdp6J5nsFQ7A5vG8W-xAY";

async function main() {
  // Initialize the Gemini API client
  const genAI = new GoogleGenerativeAI(apiKey);

  // Specify the model to use
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  // Start a new chat session
  const chat = model.startChat();

  // Send a user message and get the response
  const userMessage = "Hello, how are you?";
  const result = await chat.sendMessage(userMessage);
  const response = await result.response;
  const responseText = response.text();

  console.log("User:", userMessage);
  console.log("Gemini:", responseText);
}

main().catch(console.error);
