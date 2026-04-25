"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ExternalLink, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Portfolio({ projects }: { projects?: any[] }) {
  const t = useTranslations("Portfolio");

  const defaultProjects = [
    {
      id: 1,
      title: "FinTech Dashboard",
      desc: "A high-end financial dashboard with real-time analytics.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      tags: ["Next.js", "Tailwind", "Recharts"],
    },
    {
      id: 2,
      title: "E-Commerce Mobile App",
      desc: "A luxurious cross-platform mobile shopping experience.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
      tags: ["React Native", "Expo", "Stripe"],
    },
    {
      id: 3,
      title: "Real Estate Platform",
      desc: "Premium real estate listing platform with 3D tours.",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
      tags: ["Next.js", "Prisma", "Three.js"],
    },
  ];

  const displayProjects = projects && projects.length > 0 ? projects : defaultProjects;

  return (
    <section id="portfolio" className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {t("title")}
            <span className="text-primary">.</span>
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full opacity-50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full bg-background overflow-hidden border-border/50 hover:border-primary/50 group">
                <div className="relative h-60 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500" />
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription>{project.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full bg-accent text-accent-foreground border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <ExternalLink className="w-4 h-4" />
                      {t("view_project")}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Code className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
