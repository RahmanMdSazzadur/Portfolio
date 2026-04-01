"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  highlightColor?: string;
}

export function GlassCard({ children, className, delay = 0, highlightColor = "rgba(255,255,255,0.1)" }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={cn(
        "glass rounded-3xl p-8 relative overflow-hidden group transition-all duration-300 border-white/5",
        className
      )}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" 
        style={{ background: `radial-gradient(circle at top right, ${highlightColor}, transparent 70%)` }}
      />
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}
