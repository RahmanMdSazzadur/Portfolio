"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ElasticSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-[84px]" />;
  }

  const isDark = theme === "dark" || theme === "system"; // System usually maps to dark in this portfolio

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={toggleTheme}
        className={`relative h-10 w-[84px] rounded-full p-1 transition-colors duration-300 border border-white/10 shadow-inner ${
          isDark ? "bg-[#111113]" : "bg-gray-200"
        }`}
      >
        <div className="absolute inset-0 flex justify-between items-center px-[10px] pointer-events-none">
          <Sun className={`w-4 h-4 ${isDark ? "text-white/30" : "text-amber-500"} transition-colors`} />
          <Moon className={`w-4 h-4 ${isDark ? "text-[#C1E8FF]" : "text-black/30"} transition-colors`} />
        </div>

        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30,
          }}
          className={`h-8 w-8 rounded-full shadow-md z-10 relative flex items-center justify-center ${
            isDark ? "ml-auto bg-white" : "bg-white"
          }`}
        />
      </button>
    </div>
  );
}
