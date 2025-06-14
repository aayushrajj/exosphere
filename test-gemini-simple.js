import { GoogleGenerativeAI } from "@google/generative-ai";

// Use the environment variable for the API key
const apiKey = process.env.GEMINI_API_KEY;

async function main() {
  try {
    console.log("Testing Gemini API connection...");
    console.log("API Key length:", apiKey ? apiKey.length : 0, "characters");
    
    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey);

    // Try with a different model that might be more widely available
    console.log("Initializing model: gemini-1.0-pro");
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

    // Use a simple text generation instead of chat
    const prompt = "Write a short greeting message";
    console.log("Sending prompt:", prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("\n--- RESULT ---");
    console.log("Prompt:", prompt);
    console.log("Gemini Response:", text);
    console.log("\nSuccess! Your API key is working correctly.");
  } catch (error) {
    console.error("ERROR DETAILS:", error.message);
    
    // More detailed error information if available
    if (error.statusText) {
      console.error(`Status: ${error.status} (${error.statusText})`);
    }
    
    if (error.errorDetails && error.errorDetails.length > 0) {
      console.error("\nError details from Google API:");
      error.errorDetails.forEach(detail => {
        if (detail.message) {
          console.error(`- ${detail.message}`);
        }
      });
    }
    
    console.error("\nPlease check that:");
    console.error("1. Your API key is valid and active");
    console.error("2. You have proper internet connectivity");
    console.error("\nVisit https://ai.google.dev/ to get a valid API key");
  }
}

main();
