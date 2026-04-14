"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/MagneticButton";

const navLinks = [
  { name: "ABOUT", href: "#about" },
  { name: "EXPERIENCE", href: "#experience" },
  { name: "PROJECTS", href: "#projects" },
  { name: "AUTOMATION", href: "#automation" },
  { name: "CONTACT", href: "#contact" },
  { name: "AI AGENT", href: "/agent" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[9999] transition-all duration-300",
        scrolled ? "glass-nav py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tighter shrink-0">
          <span className="text-gradient">Growth</span>
          <span>.</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <MagneticButton key={link.name}>
              <Link
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-white transition-colors tracking-wide"
              >
                {link.name}
              </Link>
            </MagneticButton>
          ))}

          <MagneticButton>
            <Link
              href="#contact"
              className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              WORK WITH ME
            </Link>
          </MagneticButton>
        </nav>
      </div>
    </motion.header>
  );
}
