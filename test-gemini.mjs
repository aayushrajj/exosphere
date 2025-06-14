import { GoogleGenerativeAI } from "@google/generative-ai";

// Use the environment variable for the API key
const apiKey = process.env.GEMINI_API_KEY;

async function main() {
  try {
    console.log("Testing Gemini API connection...");
    console.log("API Key length:", apiKey ? apiKey.length : 0, "characters");
    console.log("API Key preview:", apiKey ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}` : "Not provided");
    
    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey);

    // Specify the model to use
    console.log("Initializing model: gemini-2.0-flash");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Start a new chat session
    console.log("Starting chat session...");
    const chat = model.startChat();

    // Send a user message and get the response
    const userMessage = "Hello, how are you?";
    console.log("Sending message:", userMessage);
    
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const responseText = response.text();

    console.log("\n--- RESULT ---");
    console.log("User:", userMessage);
    console.log("Gemini:", responseText);
  } catch (error) {
    console.error("ERROR DETAILS:", error.message);
    console.error("\nPlease check that:");
    console.error("1. Your API key is valid and active");
    console.error("2. You have access to the Gemini 2.0 Flash model");
    console.error("3. You have proper internet connectivity");
    console.error("\nVisit https://ai.google.dev/ to get a valid API key");
  }
}

main();
