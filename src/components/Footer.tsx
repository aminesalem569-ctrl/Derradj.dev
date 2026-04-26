"use client";

import { useTranslations } from "next-intl";

export function Footer({ settings }: { settings?: any }) {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border bg-background">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p className="text-sm">
          &copy; {year} DERRADJ. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
