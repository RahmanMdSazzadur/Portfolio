"use client";

import { useRef } from "react";
import { Section } from "@/components/ui/Section";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const experiences = [
  {
    role: "Content Manager & Growth Strategist",
    company: "KICKS & SIX",
    period: "2023 – Present",
    description: "Scaled KICKS & SIX from 0 to 262.8K TikTok followers, 17K Facebook followers, and 1.4K YouTube subscribers through data-driven content strategies and viral short-form content.",
    points: [
      "TikTok: 262.8K Followers · 5.5M Likes · 30M+ Video Views",
      "YouTube: 1,454 Subs · 37.6K Views (28d) · 15.2% CTR",
      "Facebook: 17K Followers · 1.8K Posts · 100% Recommended",
      "Ranked #1 of 10 by views on latest upload (12.2K views)",
      "Achieved 15.2% Impressions Click-Through Rate on YouTube"
    ]
  },
  {
    role: "Freelance Automation Engineer",
    company: "Self-Employed",
    period: "2024 – Present",
    description: "Designing and deploying enterprise-grade n8n automation pipelines — from SEO content engines and B2B lead systems to RAG-powered document intelligence and YouTube metadata generators.",
    points: [
      "Built 4+ production n8n automation workflows",
      "AI-powered SEO, outreach, and content pipelines",
      "RAG systems with Pinecone + Google Gemini",
      "Zero-touch YouTube metadata automation"
    ]
  }
];

export function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate the timeline vertical line drawing down
    gsap.fromTo(lineRef.current, 
      { scaleY: 0 },
      { 
        scaleY: 1, 
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1
        }
      }
    );

    // Number counters for stats
    if (statsRef.current) {
      const counters = statsRef.current.querySelectorAll('.stat-counter');
      counters.forEach((counter) => {
        const target = parseFloat(counter.getAttribute('data-target') || "0");
        const suffix = counter.getAttribute('data-suffix') || "";
        const prefix = counter.getAttribute('data-prefix') || "";

        gsap.to(counter, {
          innerHTML: target,
          duration: 2,
          ease: "power2.out",
          snap: { innerHTML: 1 },
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            once: true
          },
          onUpdate: function() {
            // Number formatting for 4.2M etc
            const val = Number(this.targets()[0].innerHTML);
            const displayVal = val % 1 !== 0 ? val.toFixed(1) : Math.round(val);
            counter.innerHTML = `${prefix}${displayVal}${suffix}`;
          }
        });
      });
    }

  }, { scope: containerRef });

  return (
    <Section id="experience" title="EXPERIENCE">
      <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-8">
        
        {/* Timeline (Left/Main Col) */}
        <div className="lg:col-span-7 relative">
          
          {/* Vertical Track Line */}
          <div className="absolute left-[3px] md:left-[11px] top-6 bottom-0 w-px bg-white/10" />
          {/* Animated Fill Line */}
          <div ref={lineRef} className="absolute left-[3px] md:left-[11px] top-6 bottom-0 w-[2px] bg-gradient-to-b from-primary via-secondary to-accent origin-top drop-shadow-[0_0_10px_var(--color-primary)]" />

          <div className="space-y-16 pl-8 md:pl-16">
            {experiences.map((exp, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative group"
              >
                {/* Timeline Node */}
                <div className="absolute -left-[37px] md:-left-[69px] top-1.5 w-6 h-6 rounded-full bg-background border-2 border-primary z-10 flex items-center justify-center group-hover:scale-125 group-hover:bg-primary/20 group-hover:shadow-[0_0_20px_rgba(193,232,255,0.6)] transition-all duration-300 shadow-[0_0_10px_rgba(193,232,255,0.2)] animate-[pulse_3s_ease-in-out_infinite]">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(193,232,255,0.8)]" />
                </div>
                
                <div className="glass p-6 md:p-8 rounded-2xl border-white/5 hover:border-primary/30 transition-colors shadow-xl">
                  <div className="inline-block px-3 py-1 mb-4 rounded-full bg-white/5 text-xs font-bold tracking-wider text-primary border border-white/5">
                    {exp.period}
                  </div>
                  <h4 className="text-2xl font-black text-white mb-1">{exp.role}</h4>
                  <div className="text-foreground/50 font-medium mb-6 text-lg">{exp.company}</div>
                  
                  <ul className="space-y-3">
                    {exp.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-secondary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-foreground/80 font-medium">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Animated Stats (Right Col) */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-center perspective-[1000px]">
          <div ref={statsRef} className="space-y-6 sticky top-32">
            
            <motion.div 
              initial={{ opacity: 0, rotateX: -20, y: 30 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-[#052659] p-8 rounded-2xl border border-white/5 shadow-[0_10px_40px_rgba(2,16,36,0.6)] transform-style-3d hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                </div>
                <div className="text-primary font-bold uppercase tracking-widest text-sm">TikTok Followers</div>
              </div>
              <div className="text-5xl font-black text-white">
                <span className="stat-counter" data-target="262" data-suffix=".8K">0</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, rotateX: -20, y: 30 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-[#052659] p-8 rounded-2xl border border-white/5 shadow-[0_10px_40px_rgba(2,16,36,0.6)] transform-style-3d hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div className="text-secondary font-bold uppercase tracking-widest text-sm">TikTok Likes</div>
              </div>
              <div className="text-5xl font-black text-white">
                <span className="stat-counter" data-target="5.5" data-suffix="M">0</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, rotateX: -20, y: 30 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-[#052659] p-8 rounded-2xl border border-white/5 shadow-[0_10px_40px_rgba(2,16,36,0.6)] transform-style-3d hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div className="text-accent font-bold uppercase tracking-widest text-sm">YouTube CTR</div>
              </div>
              <div className="text-5xl font-black text-white">
                <span className="stat-counter" data-target="15.2" data-suffix="%">0</span>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </Section>
  );
}
