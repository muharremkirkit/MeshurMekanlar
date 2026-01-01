
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem, Testimonial } from "../types";

/**
 * ÖNEMLİ: Bu platformda her zaman process.env.API_KEY kullanılır.
 * import.meta.env kullanmanıza gerek yoktur.
 */
const getAiInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "YOUR_API_KEY") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export async function getFoodRecommendation(userPrompt: string, menuItems: MenuItem[], restaurantName: string) {
  const ai = getAiInstance();
  if (!ai) return "Yapay zeka asistanı şu an yapılandırılmamış. Lütfen yönetici panelinden API anahtarını kontrol edin.";

  const menuContext = menuItems.map(item => `${item.name}: ${item.description} (${item.price} TL)`).join('\n');
  
  try {
    // KURAL: Modeli önceden tanımlamıyoruz, direkt generateContent içinde çağırıyoruz.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Sen "${restaurantName}" restoranının sanal garsonusun. Müşteri sana şunu sordu: "${userPrompt}". 
      Lütfen aşağıdaki menümüzden müşteriye en uygun önerileri yap. Samimi, iştah açıcı ve kısa bir dil kullan. 
      Menü:\n${menuContext}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Hatası:", error);
    return "Şu an küçük bir teknik aksaklık yaşıyorum, garson arkadaşlarımız size hemen yardımcı olacaktır.";
  }
}

export async function fetchGoogleReviews(googleMapsLink: string): Promise<Partial<Testimonial>[]> {
  const ai = getAiInstance();
  if (!ai) return [];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Lütfen şu Google Maps linkindeki mekanın en güncel ve gerçekçi 5 müşteri yorumunu bul: ${googleMapsLink}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              comment: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              date: { type: Type.STRING }
            },
            required: ["name", "comment", "rating"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Yorum çekme hatası:", e);
    return [];
  }
}
