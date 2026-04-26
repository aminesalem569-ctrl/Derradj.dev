"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import { submitContact } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, MessageCircle, Send as Telegram, Loader2, Globe, Video, Camera, Music, Hash, ExternalLink } from "lucide-react";
import { generateAIReply } from "@/lib/ai-actions";

export function Contact({ settings }: { settings?: any }) {
  const t = useTranslations("Contact");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [aiAutoReply, setAiAutoReply] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("message", data.message);

    const result = await submitContact(formData);

    if (result.success) {
      setStatus("success");
      // Generate AI auto-reply for the user
      const aiResponse = await generateAIReply(data.name, data.message);
      if (aiResponse.success) {
        setAiAutoReply(aiResponse.reply || "");
      }
      reset();
      // Keep success state longer if there is an AI reply
      setTimeout(() => {
        setStatus("idle");
        setAiAutoReply("");
      }, 15000);
    } else {
      setStatus("error");
      setErrorMessage(result.error || t("error"));
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 bg-card/10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {t("title")}
            <span className="text-primary">.</span>
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full opacity-50" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-background border border-border/50 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Honeypot field - Hidden from users */}
            <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Input
                  {...register("name")}
                  placeholder={t("name")}
                  className={`bg-card/50 border-border/50 h-12 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Input
                  {...register("email")}
                  placeholder={t("email")}
                  className={`bg-card/50 border-border/50 h-12 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Textarea
                {...register("message")}
                placeholder={t("message")}
                className={`bg-card/50 border-border/50 min-h-[150px] ${errors.message ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full h-12 glow-gold text-base"
            >
              {status === "loading" ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : status === "success" ? (
                <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> {t("success")}</span>
              ) : status === "error" ? (
                <span className="flex items-center gap-2"><AlertCircle className="w-5 h-5" /> {errorMessage}</span>
              ) : (
                <span className="flex items-center gap-2"><Send className="w-5 h-5" /> {t("send")}</span>
              )}
            </Button>
          </form>
          {aiAutoReply && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl relative overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-2 text-primary font-bold">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                رد آلي ذكي:
              </div>
              <p className="text-gray-300 italic leading-relaxed whitespace-pre-wrap">{aiAutoReply}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Social Links Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 flex flex-wrap justify-center gap-6 md:gap-10"
        >
          {[
            { icon: MessageCircle, color: "hover:text-green-500", label: "WhatsApp", url: settings?.socials?.whatsapp ? `https://wa.me/${settings.socials.whatsapp}` : "#" },
            { icon: Telegram, color: "hover:text-blue-400", label: "Telegram", url: settings?.socials?.telegram ? `https://t.me/${settings.socials.telegram}` : "#" },
            { icon: Globe, color: "hover:text-blue-600", label: "Facebook", url: settings?.socials?.facebook || "#" },
            { icon: Video, color: "hover:text-red-500", label: "YouTube", url: settings?.socials?.youtube || "#" },
            { icon: Camera, color: "hover:text-pink-500", label: "Instagram", url: settings?.socials?.instagram || "#" },
            { icon: Music, color: "hover:text-white", label: "TikTok", url: settings?.socials?.tiktok || "#" },
          ].map((social, i) => (
            <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" 
               className={`group flex flex-col items-center gap-2 transition-all duration-300 ${social.color}`}>
              <div className="p-4 bg-card/50 border border-border/50 rounded-full group-hover:scale-110 group-hover:border-current transition-all">
                <social.icon className="w-6 h-6" />
              </div>
              <span className="text-xs text-gray-500 group-hover:text-current">{social.label}</span>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
