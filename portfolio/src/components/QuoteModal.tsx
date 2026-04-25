"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Loader2, CheckCircle2, Rocket } from "lucide-react";

export function QuoteModal({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Quote");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      type: formData.get("type"),
      budget: formData.get("budget"),
      details: formData.get("details"),
    };

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (res.ok) setSuccess(true);
    } catch (err) {
      alert("Error sending request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if(!o) setSuccess(false); }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-[#0B0F19]/90 backdrop-blur-2xl border-[#2A3441] text-white max-w-lg rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Rocket className="text-primary w-6 h-6" /> {t("title")}
          </DialogTitle>
          <p className="text-gray-400 text-sm">{t("subtitle")}</p>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-4"
            >
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold">تم استلام طلبك بنجاح!</h3>
              <p className="text-gray-400">سيقوم الذكاء الاصطناعي بتحليل مشروعك وسأتواصل معك قريباً جداً.</p>
              <Button onClick={() => setOpen(false)} className="mt-4">إغلاق</Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Honeypot field - Hidden from users */}
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="grid grid-cols-2 gap-4">
                <Input name="name" placeholder="اسمك الكريم" required className="bg-white/5 border-white/10" />
                <Input name="email" type="email" placeholder="بريدك الإلكتروني" required className="bg-white/5 border-white/10" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <select name="type" className="w-full h-10 rounded-md bg-white/5 border border-white/10 px-3 text-sm" required>
                  <option value="" disabled selected>{t("type")}</option>
                  <option value="web">{t("web")}</option>
                  <option value="mobile">{t("mobile")}</option>
                  <option value="game">{t("game")}</option>
                  <option value="design">{t("design")}</option>
                </select>
                <Input name="budget" placeholder={t("budget")} className="bg-white/5 border-white/10" />
              </div>

              <Textarea name="details" placeholder={t("details")} className="min-h-[120px] bg-white/5 border-white/10" required />

              <Button type="submit" disabled={loading} className="w-full h-12 bg-primary hover:bg-primary/80 font-bold gap-2 text-lg rounded-xl">
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                {t("send")}
              </Button>
            </form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
