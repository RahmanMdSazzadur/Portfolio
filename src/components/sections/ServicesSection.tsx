"use client";

import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/ui/GlassCard";
import { PenTool, TrendingUp, Cpu } from "lucide-react";

const services = [
  {
    title: "Content Strategy",
    description: "Multi-platform content roadmaps engineered for maximum engagement and brand authority.",
    icon: <PenTool className="w-8 h-8 text-[#5483B3]" />,
    color: "rgba(255, 0, 85, 0.15)",
  },
  {
    title: "Performance Marketing",
    description: "Data-driven, high-ROI campaigns leveraging advanced analytics and behavioral targeting.",
    icon: <TrendingUp className="w-8 h-8 text-[#C1E8FF]" />,
    color: "rgba(0, 240, 255, 0.15)",
  },
  {
    title: "Automation Systems",
    description: "Scalable infrastructure and workflows that capture leads and drive business growth on autopilot.",
    icon: <Cpu className="w-8 h-8 text-[#7DA0CA]" />,
    color: "rgba(138, 43, 226, 0.15)",
  },
];

export function ServicesSection() {
  return (
    <Section id="services" title="Core Expertise" subtitle="The three pillars of my growth architecture.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {services.map((service, index) => (
          <GlassCard key={index} delay={index * 0.15} highlightColor={service.color}>
            <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
              {service.icon}
            </div>
            <h3 className="text-2xl font-bold mb-4 tracking-tight">{service.title}</h3>
            <p className="text-foreground/70 leading-relaxed font-medium flex-grow">
              {service.description}
            </p>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
