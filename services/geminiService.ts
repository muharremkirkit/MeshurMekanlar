
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem, Testimonial } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getFoodRecommendation(userPrompt: string, menuItems: MenuItem[], restaurantName: string) {
  const menuContext = menuItems.map(item => `${item.name}: ${item.description} (${item.price} TL)`).join('\n');
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Sen "${restaurantName}" restoranının sanal garsonusun. Müşteri sana şunu sordu: "${userPrompt}". 
    Lütfen aşağıdaki menümüzden müşteriye en uygun önerileri yap. Menü:\n${menuContext}`,
  });

  return response.text;
}

export async function fetchGoogleReviews(googleMapsLink: string): Promise<Partial<Testimonial>[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Lütfen şu Google Maps linkindeki mekanın en güncel ve gerçekçi 5 müşteri yorumunu bul: ${googleMapsLink}. 
    Yorumlar samimi ve çeşitli olsun.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Müşterinin adı" },
            comment: { type: Type.STRING, description: "Yorum içeriği" },
            rating: { type: Type.NUMBER, description: "1-5 arası puan" },
            date: { type: Type.STRING, description: "Yorum tarihi (ör: 2 hafta önce)" }
          },
          required: ["name", "comment", "rating"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Yorum ayrıştırma hatası", e);
    return [];
  }
}
