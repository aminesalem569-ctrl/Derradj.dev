"use server";

import { contactSchema } from "./validations";
import { headers } from "next/headers";
import { sendTelegramNotification } from "./telegram";

export async function submitContact(formData: FormData) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    console.log("Submitting contact to project:", projectId);
    
    if (!projectId) {
      console.error("CRITICAL: NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing in environment variables!");
      return { success: false, error: "إعدادات السيرفر ناقصة." };
    }

    const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
    const headerStore = await headers();
    const ip = headerStore.get("x-forwarded-for") || "unknown-ip";

    // Honeypot check
    const honeypot = formData.get("website");
    if (honeypot) {
      console.warn("Spam detected via honeypot!");
      return { success: true }; // Return true but do nothing to fool the bot
    }

    /* Rate limit disabled for testing */

    // Validate
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };
    const validatedData = contactSchema.parse(rawData);

    // Save message to Firestore (public write allowed for /messages collection)
    const response = await fetch(`${FIRESTORE_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          name: { stringValue: validatedData.name },
          email: { stringValue: validatedData.email },
          message: { stringValue: validatedData.message },
          read: { booleanValue: false },
          timestamp: { timestampValue: new Date().toISOString() },
          ip: { stringValue: ip },
        },
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      console.error("Firestore POST failed:", response.status, errJson);
      throw new Error(`Firestore error: ${response.status}`);
    }

    // Send Telegram notification
    const telegramMsg = `🔔 *رسالة جديدة من الموقع!*\n\n👤 *الاسم:* ${validatedData.name}\n📧 *الإيميل:* ${validatedData.email}\n📝 *الرسالة:*\n${validatedData.message}`;
    await sendTelegramNotification(telegramMsg);

    // Also send email if Resend key is configured
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Portfolio <onboarding@resend.dev>",
        to: process.env.CONTACT_EMAIL || "contact@derradj.dev",
        subject: `رسالة جديدة من ${validatedData.name}`,
        text: `الاسم: ${validatedData.name}\nالإيميل: ${validatedData.email}\nالرسالة:\n${validatedData.message}`,
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Submission error:", error);
    return { success: false, error: "حدث خطأ. يرجى المحاولة مجدداً." };
  }
}
