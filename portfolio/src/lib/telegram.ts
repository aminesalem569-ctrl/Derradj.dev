"use server";

export async function sendTelegramNotification(name: string, email: string, message: string) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn("Telegram notification skipped: Token or ChatID missing.");
      return;
    }

    const text = `
🔔 *رسالة جديدة من موقعك!*

👤 *الاسم:* ${name}
📧 *الإيميل:* ${email}
📝 *الرسالة:*
${message}
    `;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
      }),
    });
  } catch (error) {
    console.error("Telegram notification failed:", error);
  }
}
