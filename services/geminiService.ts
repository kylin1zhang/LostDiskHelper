import { GoogleGenAI } from "@google/genai";
import { OwnerInfo } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Converts Lat/Long to a friendly location message
export const generateLocationMessage = async (lat: number, lng: number): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "位置信息已获取 (API Key 缺失)";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Translate these coordinates into a friendly, concise Chinese location description (e.g., 'Near [Street Name], [City]'). Do not give technical data, just the place name. Coordinates: ${lat}, ${lng}`,
    });
    return response.text || "未知位置";
  } catch (error) {
    console.error("Location generation error:", error);
    return `经度: ${lng.toFixed(4)}, 纬度: ${lat.toFixed(4)}`;
  }
};

// Simulates the Owner replying to the Finder
export const generateOwnerReply = async (
  ownerInfo: OwnerInfo,
  chatHistory: string,
  userMessage: string
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "自动回复：谢谢你捡到我的U盘，请拨打我的电话联系我。";

  const prompt = `
    You are roleplaying as the owner of a lost USB drive.
    Owner Name: ${ownerInfo.name}
    Owner Phone: ${ownerInfo.phone}
    Owner Email: ${ownerInfo.email}
    Owner WeChat: ${ownerInfo.wechat}
    Owner's Preset Message: "${ownerInfo.message}"
    
    Current Scenario: A stranger (the finder) has found your USB drive and is chatting with you via this program.
    You are VERY grateful. You want to arrange a time to get it back.
    
    Instructions:
    1. Respond in Chinese.
    2. Be polite, friendly, and thankful.
    3. If they ask where to meet, suggest a public place or ask them what works.
    4. Keep responses short (under 50 words).
    5. You can mention that they can email you at ${ownerInfo.email} if they prefer.
    6. Do not reveal sensitive personal info other than phone/wechat/email provided.
    
    Chat History:
    ${chatHistory}
    
    Finder said: "${userMessage}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "谢谢你！请加我微信或发邮件联系。";
  } catch (error) {
    console.error("Chat generation error:", error);
    return "系统繁忙，请直接拨打我的电话或发送邮件。";
  }
};