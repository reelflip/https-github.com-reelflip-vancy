
import { GoogleGenAI, Type } from "@google/genai";

// Lazy initialization of the AI client to prevent top-level crashes
let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    // Note: process.env.API_KEY is assumed to be provided by the environment
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
};

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a compelling, professional e-commerce product description for a "${productName}" in the "${category}" category. Focus on lifestyle, quality, and fashion-forward details. Keep it under 100 words.`,
  });
  return response.text || "No description generated.";
};

export const getShoppingAdvice = async (query: string, availableProducts: any[]): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a helpful personal stylist and shopping assistant for NexusCommerce. 
    User query: "${query}"
    Available products in our catalog: ${JSON.stringify(availableProducts.map(p => ({ name: p.name, price: p.price, brand: p.brand, category: p.category })))}
    Provide a concise, stylish, and helpful recommendation. Recommend specific items from the list if they match.`,
  });
  return response.text || "I'm sorry, I couldn't find a recommendation right now.";
};
