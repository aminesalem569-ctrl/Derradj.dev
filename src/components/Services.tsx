"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code2, Paintbrush, Smartphone } from "lucide-react";

export function Services({ services }: { services?: any[] }) {
  const t = useTranslations("Services");

  const iconMap: Record<string, any> = {
    Code2,
    Paintbrush,
    Smartphone,
  };

  const defaultServices = [
    {
      id: "web_dev",
      icon: Code2,
      title: t("web_dev.title"),
      desc: t("web_dev.desc"),
    },
    {
      id: "ui_design",
      icon: Paintbrush,
      title: t("ui_design.title"),
      desc: t("ui_design.desc"),
    },
    {
      id: "mobile_dev",
      icon: Smartphone,
      title: t("mobile_dev.title"),
      desc: t("mobile_dev.desc"),
    },
  ];
  const displayServices = services && services.length > 0 ? services : defaultServices;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {t("title")}
            <span className="text-secondary">.</span>
          </h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full opacity-50" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {displayServices.map((service) => {
            const Icon = typeof service.icon === 'string' ? iconMap[service.icon] || Code2 : service.icon;
            return (
              <motion.div key={service.id} variants={itemVariants}>
                <Card className="h-full bg-background border-border/50 hover:border-secondary hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all duration-500 group">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 group-hover:scale-110 transition-all duration-500">
                      <Icon className="w-7 h-7 text-secondary" />
                    </div>
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {service.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
