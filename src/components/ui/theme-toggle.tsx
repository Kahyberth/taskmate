import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Detectar clic fuera del menú
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Resolver el tema real
  useEffect(() => {
    if (!theme) return;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setResolvedTheme(theme === "system" ? (prefersDark ? "dark" : "light") : theme);

    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        setResolvedTheme(e.matches ? "dark" : "light");
      }
    };

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  const handleSelect = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    setShowMenu(false);
  };

  // Mostrar placeholder mientras carga
  if (!theme) {
    return (
      <div className="p-2">
        <div className="w-4 h-4" />
      </div>
    );
  }

  const icon = resolvedTheme === "dark" ? (
    <Moon className="w-4 h-4" />
  ) : (
    <Sun className="w-4 h-4" />
  );

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle theme"
      >
        {icon}
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-32 bg-violet-400 dark:bg-violet-900 border border-gray-200 dark:border-gray-400 rounded-lg shadow-lg z-50 overflow-hidden">
          <button
            onClick={() => handleSelect("light")}
            className={`w-full px-3 py-2 text-left hover:bg-violet-500/40 dark:hover:bg-violet-700 ${
              theme === "light" ? "bg-violet-500/30 dark:bg-violet-800" : ""
            }`}
          >
            Light
          </button>
          <button
            onClick={() => handleSelect("dark")}
            className={`w-full px-3 py-2 text-left hover:bg-violet-500/40 dark:hover:bg-violet-700 ${
              theme === "dark" ? "bg-violet-500/30 dark:bg-violet-800" : ""
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => handleSelect("system")}
            className={`w-full px-3 py-2 text-left hover:bg-violet-500/40 dark:hover:bg-violet-700 ${
              theme === "system" ? "bg-violet-500/30 dark:bg-violet-800" : ""
            }`}
          >
            System
          </button>
        </div>
      )}
    </div>
  );
}