"use client";
import React from "react";
import { motion } from "framer-motion";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: { text: string; image: string; name: string; role: string }[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div 
                className="p-8 rounded-[2rem] border border-white/10 glass max-w-sm w-full shadow-2xl relative overflow-hidden group" 
                key={i}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="text-foreground/80 leading-relaxed italic relative z-10">"{text}"</div>
                <div className="flex items-center gap-4 mt-6 relative z-10">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 p-0.5 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    <img
                      src={image}
                      alt={name}
                      className="h-full w-full rounded-full object-cover grayscale-[50%] transition-all duration-300 group-hover:grayscale-0"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="font-bold tracking-tight text-white">{name}</div>
                    <div className="text-xs text-[#C1E8FF] uppercase tracking-widest opacity-80 mt-0.5">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
