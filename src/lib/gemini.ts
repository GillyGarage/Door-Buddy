import { GoogleGenAI } from "@google/genai";
import { GILLYS_BRAIN_STRING } from "../services/gillysBrain";
import { DIAGNOSTIC_CHART, PILLARS_OF_THE_CALL, CODE_OF_CONDUCT } from "../services/gillyKnowledge";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const GILLY_SYSTEM_PROMPT = `You are "Gilly", a seasoned Senior Tech for Garage Up. You're talking to another tech in the field.
Personality: Direct, technical, and practical. You don't have time for long-winded explanations—you get straight to the fix.

CORE GUIDELINES:
1. **BE CONCISE:** Keep answers short. 2-4 sentences max unless it's a complex multi-step repair.
2. **BE HUMAN:** Talk like a pro in the trade. Use shorthand (e.g., "1/2HP", "IPPT", "Bible specs"). No formal greetings or generic preamble.
3. **SOLVE THE PROBLEM:** If you need more info (status light, wire size, drum type), ask for it immediately and specifically.
4. **SAFETY FIRST:** If it's a high-tension part (springs), give a quick safety reminder but keep it punchy.

STRICT PRICING POLICY: 
- Don't volunteer prices unless asked. If asked, refer to "IC Pricing" (2.0x Parts, 1.5x Labor).

Gilly's Knowledge:
${GILLYS_BRAIN_STRING}

Tone Example:
"Broken torsion spring. Looks like cycle exhaustion. Check the door weight—get a replacement from the Bible specs and re-tension. Mind the winding bars."`;


export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  image?: string;
}

function formatHistory(history: ChatMessage[]) {
  // Filter out system messages and format for Gemini SDK
  const filtered = history.filter(msg => msg.role !== 'system');
  
  // Gemini expects roles: 'user' and 'model'
  // If the dialogue hasn't started with a user message, we'll handle it in the caller
  const firstUserIdx = filtered.findIndex(m => m.role === 'user');
  if (firstUserIdx === -1) return [];

  return filtered.slice(firstUserIdx).map(msg => {
    const parts: any[] = [{ text: msg.content || (msg.image ? "Analyzie the door in this image." : "Show me the door.") }];
    if (msg.image) {
      const base64Data = msg.image.includes(',') ? msg.image.split(',')[1] : msg.image;
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        }
      });
    }
    return {
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts
    };
  });
}

export async function askGilly(history: ChatMessage[]) {
  const model = "gemini-3-flash-preview";
  
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const contents = formatHistory(history);
  if (contents.length === 0) return "Hey there! How can I help you in the field today?";

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: GILLY_SYSTEM_PROMPT
    }
  });

  return response.text || "I'm having a bit of trouble finding the words. Try asking again?";
}

export async function* askGillyStream(history: ChatMessage[]) {
  const model = "gemini-3-flash-preview";
  
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const contents = formatHistory(history);
  
  if (contents.length === 0) {
    yield "Hey there! How can I help you in the field today?";
    return;
  }

  const responseStream = await ai.models.generateContentStream({
    model,
    contents,
    config: {
      systemInstruction: GILLY_SYSTEM_PROMPT
    }
  });

  for await (const chunk of responseStream) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
}
