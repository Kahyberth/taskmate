import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme | null>(null);

  // Cargar el tema guardado al iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches 
      ? "dark" 
      : "light";
    
    // Establecer el tema guardado o "system" si no hay nada guardado
    setTheme(savedTheme || "system");
    
    // Aplicar el tema inicial inmediatamente
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(savedTheme ? 
      (savedTheme === "system" ? systemTheme : savedTheme) 
      : systemTheme);
  }, []);

  // Efecto para aplicar cambios de tema
  useEffect(() => {
    if (theme === null) return;

    document.documentElement.classList.remove("light", "dark");

    let themeToApply: "light" | "dark";
    
    if (theme === "system") {
      themeToApply = window.matchMedia("(prefers-color-scheme: dark)").matches 
        ? "dark" 
        : "light";
    } else {
      themeToApply = theme;
    }

    document.documentElement.classList.add(themeToApply);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === null) return "light";
      return prev === "light" ? "dark" : "light";
    });
  };

  // No renderizar hasta tener el tema cargado
  if (theme === null) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);