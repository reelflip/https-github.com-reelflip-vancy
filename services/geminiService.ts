
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Always use the apiKey parameter and process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  // Fix: Use the correctly initialized 'ai' instance.
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a compelling, professional e-commerce product description for a "${productName}" in the "${category}" category. Keep it under 100 words.`,
  });
  // Fix: Use response.text property directly as it returns the string.
  return response.text || "No description generated.";
};

export const getShoppingAdvice = async (query: string, availableProducts: any[]): Promise<string> => {
  // Fix: Use the correctly initialized 'ai' instance.
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a helpful shopping assistant for NexusCommerce. 
    User query: "${query}"
    Available products: ${JSON.stringify(availableProducts.map(p => ({ name: p.name, price: p.price, category: p.category })))}
    Provide a concise recommendation.`,
  });
  // Fix: Use response.text property directly.
  return response.text || "I'm sorry, I couldn't find a recommendation right now.";
};
