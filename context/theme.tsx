"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme | null;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (theme === null && storedTheme !== null) {
      setTheme(storedTheme as Theme);
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== null && typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => useContext(ThemeContext);
