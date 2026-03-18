"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function useAdminTheme() {
  return useContext(ThemeContext);
}

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin_theme") as Theme | null;
    if (stored === "light" || stored === "dark") setTheme(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("admin_theme", theme);
  }, [theme, mounted]);

  const toggle = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div className={`admin-layout ${theme === "light" ? "admin-light" : ""}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
