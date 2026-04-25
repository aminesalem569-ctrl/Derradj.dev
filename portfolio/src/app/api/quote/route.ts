import { NextResponse, type NextRequest } from "next/server";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, type, budget, details, website } = data;

    if (website) {
       return NextResponse.json({ success: true }); // Dummy success to confuse bot
    }

    // AI Analysis Prompt
    const prompt = `You are a professional project manager. Analyze this project request and provide a short summary (3 sentences max) with estimated complexity and suggested tech stack.
    Client: ${name}
    Project Type: ${type}
    Budget: ${budget}
    Details: ${details}`;

    // Generate AI analysis using Groq (reusing our logic)
    const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    
    const aiData = await aiResponse.json();
    const analysis = aiData.choices?.[0]?.message?.content || "AI analysis unavailable.";

    // Prepare Telegram message
    const telegramMsg = `🚀 *New Custom Project Request*\n\n` +
      `👤 *Client:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `📁 *Type:* ${type}\n` +
      `💰 *Budget:* ${budget}\n\n` +
      `📝 *Details:* ${details}\n\n` +
      `🤖 *AI Analysis:* \n${analysis}`;

    await sendTelegramNotification(telegramMsg);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quote API Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
