"use client";

import { Section } from "@/components/ui/Section";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "framer-motion";

// ── Client Reviews ──
// Add more clients below as needed — the grid auto-distributes across 3 columns.
const testimonials = [
  {
    text: "Sazzadur took KICKS & SIX from zero to 262K TikTok followers and 5.5M likes. His content strategy and understanding of short-form algorithms is unmatched. Every video he produces is engineered for maximum reach.",
    image: "/clients/kicks-six-profile.jpg",
    name: "Imrose (Tasik)",
    role: "Founder, KICKS & SIX",
  },
  {
    text: "Our YouTube CTR jumped to 15.2% and our latest upload ranked #1 of 10 by views within the first day. He doesn't just create content — he builds growth systems.",
    image: "/clients/kicks-six-profile.jpg",
    name: "Imrose (Tasik)",
    role: "Founder, KICKS & SIX",
  },
  {
    text: "Managing our Facebook page with 17K followers and 1.8K posts — every piece of content is on-brand, on-time, and optimized for engagement. 100% recommendation from our community.",
    image: "/clients/kicks-six-profile.jpg",
    name: "Imrose (Tasik)",
    role: "Founder, KICKS & SIX",
  },
  {
    text: "Sazzadur built and manages our entire Shopify store and SEO strategy from scratch. He understands both the technical and creative sides of e-commerce growth.",
    image: "/clients/nexgen-logo.png",
    name: "NexGen Fusion 3D",
    role: "Client — E-Commerce & SEO",
  },
  {
    text: "He handles our Facebook page and product marketing with the same precision he brings to automation. Our 3D printing brand has seen consistent growth since he joined.",
    image: "/clients/nexgen-logo.png",
    name: "NexGen Fusion 3D",
    role: "Client — Facebook & Sales",
  },
  {
    text: "The n8n automation workflows he built for our content pipeline save hours every week. He's not just a content creator — he's a full-stack growth engineer.",
    image: "/clients/kicks-six-profile.jpg",
    name: "Imrose (Tasik)",
    role: "Founder, KICKS & SIX",
  },
  {
    text: "Sazzadur handled our entire digital presence — from social media content to lead generation campaigns. His work helped us reach more students looking to study abroad than we ever could on our own.",
    image: "/clients/mayfair-logo.png",
    name: "Mayfair Global Education",
    role: "Client — Study Abroad Agency",
  },
  {
    text: "Professional, fast, and always delivering beyond expectations. He understood our education consultancy brand and created content that truly connected with prospective students and their families.",
    image: "/clients/mayfair-logo.png",
    name: "Mayfair Global Education",
    role: "Client — Digital Marketing",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 8);

export function TestimonialsSection() {
  return (
    <Section id="testimonials" className="py-24 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-3xl mx-auto mb-16 text-center"
        >
          <div className="text-xs font-bold tracking-widest text-[#5483B3] uppercase mb-4 shadow-[#5483B3] drop-shadow-md">
            Client Voices
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white uppercase">
            Industry <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C1E8FF] to-[#5483B3]">Validation</span>
          </h2>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] h-[600px] md:h-[700px] overflow-hidden w-full">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </Section>
  );
}
