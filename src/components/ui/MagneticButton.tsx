"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function MagneticButton({ 
  children, 
  className,
  ...props 
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!ref.current || window.matchMedia("(hover: none)").matches) return;

    // Utilize GSAP elastic easing for a heavily tactile feel
    const xTo = gsap.quickTo(ref.current, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(ref.current, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouse = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = ref.current!.getBoundingClientRect();
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      xTo(middleX * 0.4);
      yTo(middleY * 0.4);
    };

    const reset = () => {
      xTo(0);
      yTo(0);
    };

    const element = ref.current;
    element.addEventListener("mousemove", handleMouse);
    element.addEventListener("mouseleave", reset);

    return () => {
      element.removeEventListener("mousemove", handleMouse);
      element.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
    <div ref={ref} className="inline-block will-change-transform">
      <div className={cn("inline-block cursor-pointer", className)} {...props}>
        {children}
      </div>
    </div>
  );
}
