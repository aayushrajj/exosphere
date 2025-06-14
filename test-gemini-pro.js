import { GoogleGenerativeAI } from "@google/generative-ai";

// Use the environment variable for the API key
const apiKey = process.env.GEMINI_API_KEY;

async function main() {
  try {
    console.log("Testing Gemini API connection...");
    console.log("API Key length:", apiKey ? apiKey.length : 0, "characters");
    
    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // List available models
    console.log("Fetching available models...");
    
    // Using a simpler model that should be available
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Simple text generation request
    console.log("Testing with model: gemini-pro");
    const prompt = "Hello! Please respond with a short greeting.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("\n--- RESULT ---");
    console.log("Prompt:", prompt);
    console.log("Gemini Response:", text);
    console.log("\nSuccess! Your API key is working correctly with the gemini-pro model.");
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
    
    console.error("\nTroubleshooting Tips:");
    console.error("1. Check that your API key is valid and active");
    console.error("2. Ensure you have access to the Gemini API");
    console.error("3. Verify your internet connection");
    console.error("4. The model name might be incorrect - try with 'gemini-pro'");
    console.error("\nVisit https://ai.google.dev/ to get a valid API key and check available models");
  }
}

main();
