"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function About({ settings }: { settings?: any }) {
  const t = useTranslations("About");

  return (
    <section id="about" className="py-24 bg-card/30 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              {t("title")}
              <span className="text-primary">.</span>
            </h2>
            <p className="text-xl text-primary font-medium">{t("subtitle")}</p>
          </div>

          <div className="relative p-8 md:p-12 rounded-2xl bg-background/50 border border-border backdrop-blur-sm shadow-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {settings?.about || t("content")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
