"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Use a cleaner approach for hydration
  return (
    <NextThemesProvider 
      {...props} 
      enableSystem={false} // Disabling system to see if it clears the script error
      attribute="class"
    >
      <div style={{ visibility: mounted ? "visible" : "hidden" }}>
        {children}
      </div>
    </NextThemesProvider>
  );
}
