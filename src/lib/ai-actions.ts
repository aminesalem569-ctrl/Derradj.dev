"use server";

export async function generateAIReply(customerName: string, customerMessage: string) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return { success: false, error: "GROQ_API_KEY is missing." };
    }

    const prompt = `
      You are a professional business assistant for a full-stack developer portfolio.
      A customer named "${customerName}" sent this message:
      "${customerMessage}"
      
      Write a professional, friendly, and concise reply in the SAME language as the customer's message (Arabic or English).
      The reply should acknowledge their message and offer further discussion.
      Only return the text of the reply.
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a professional assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Groq API Error:", data);
      return { success: false, error: `خطأ من Groq: ${data.error?.message || "فشل الاتصال"}` };
    }

    const reply = data.choices?.[0]?.message?.content;
    if (!reply) throw new Error("No reply text in response");

    return { success: true, reply };
  } catch (error: any) {
    console.error("AI Generation error:", error);
    return { success: false, error: "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي." };
  }
}
