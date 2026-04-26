"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QuoteModal } from "./QuoteModal";
import { Rocket } from "lucide-react";
import { Magnetic, Reveal } from "./Animations";

export function Hero({ settings }: { settings?: { name: string } }) {
  const t = useTranslations("Hero");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradients and glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] -z-10" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <Reveal>
          <div className="space-y-6 max-w-4xl mx-auto">
          <motion.h2 
            className="text-primary font-medium tracking-wide uppercase text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {t("greeting")}
          </motion.h2>
          
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
          >
            {settings?.name || t("name")}
            <span className="text-primary">.</span>
          </motion.h1>
          
          <motion.h3 
            className="text-2xl md:text-4xl text-muted-foreground font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {t("role")}
          </motion.h3>

          <motion.p 
            className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto pt-4 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {t("description")}
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <Magnetic>
              <Button size="lg" className="w-full sm:w-auto glow-gold text-base h-12 px-8" asChild>
                 <a href="#services">{t("cta_services")}</a>
              </Button>
            </Magnetic>
            
            <Magnetic>
              <QuoteModal>
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-black font-bold h-12 px-8 gap-2">
                  <Rocket className="w-5 h-5" />
                  {t("cta_quote")}
                </Button>
              </QuoteModal>
            </Magnetic>

            <Magnetic>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-8" asChild>
                 <a href="#contact">{t("cta_contact")}</a>
              </Button>
            </Magnetic>
          </motion.div>
        </div>
      </Reveal>
    </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent block" />
      </motion.div>
    </section>
  );
}
