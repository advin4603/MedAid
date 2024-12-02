import OpenAI from "openai";

export const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
  baseURL: "https://api.groq.com/openai/v1",
});
