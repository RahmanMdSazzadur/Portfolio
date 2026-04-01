"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Global GSAP defaults mapping to premium animation standards
    gsap.defaults({
      ease: "power3.out",
      duration: 0.8,
    });
  }, []);

  return <>{children}</>;
}
