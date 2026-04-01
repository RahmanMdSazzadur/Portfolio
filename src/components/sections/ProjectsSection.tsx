"use client";

import { Section } from "@/components/ui/Section";
import React from 'react';
import { RadialScrollGallery } from '@/components/ui/portfolio-and-image-gallery';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from "next/link";
import { projects } from "@/lib/data";

export function ProjectsSection() {
  return (
    <Section id="projects" className="py-24">
      <div className="bg-[#021024]/90 min-h-[600px] text-foreground overflow-hidden rounded-[3rem] border border-white/10 w-full shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-[#021024]/60 to-secondary/5 blur-3xl -z-10" />
        
        <div className="h-[200px] flex flex-col items-center justify-center space-y-4 pt-4 md:pt-8 bg-[#021024]/90 backdrop-blur-3xl border-b border-white/5 relative z-10">
          <div className="space-y-1 text-center">
            <span className="text-xs font-bold tracking-widest text-[#C1E8FF] uppercase shadow-[#C1E8FF] drop-shadow-md">
              Selected Works
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              Projects
            </h2>
          </div>
          <div className="animate-bounce text-foreground/50 text-xs font-bold tracking-widest uppercase flex flex-col items-center gap-2">
            Rotate
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
          </div>
        </div>

        <RadialScrollGallery
          className="!min-h-[500px] md:!min-h-[700px] -mt-20 md:-mt-10 mb-20"
          baseRadius={400}
          mobileRadius={200}
          visiblePercentage={45}
          scrollDuration={2500}
        >
          {(hoveredIndex) =>
            projects.map((project, index) => {
               const isActive = hoveredIndex === index;
               return (
                <Link 
                  href={`/project/${project.id}`}
                  key={project.id} 
                  className="group relative block w-[180px] h-[260px] sm:w-[260px] sm:h-[360px] overflow-hidden rounded-[2rem] bg-black/50 border border-white/20 shadow-[-10px_-10px_30px_rgba(255,255,255,0.05),10px_10px_30px_rgba(0,0,0,0.5)] transition-shadow duration-500 cursor-pointer"
                >
                  <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                    <img
                      src={project.img}
                      alt={project.title}
                      className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
                        isActive ? 'scale-110 blur-0' : 'scale-100 blur-[2px] grayscale-[50%]'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#021024] via-[#021024]/40 to-transparent opacity-80" />
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-between p-6">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="text-[10px] px-3 py-1 bg-white/10 text-white border border-white/20 backdrop-blur-md rounded-full shadow-lg pointer-events-none">
                        {project.cat}
                      </Badge>
                      <div 
                        className={`w-8 h-8 rounded-full bg-[#C1E8FF] text-black shadow-[0_0_15px_#C1E8FF] flex items-center justify-center transition-all duration-500 hover:bg-white z-50 ${isActive ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-45 scale-50'}`}
                      >
                        <ArrowUpRight size={16} strokeWidth={3} />
                      </div>
                    </div>

                    <div className={`transition-transform duration-500 ${isActive ? 'translate-y-0' : 'translate-y-4'} pointer-events-none`}>
                      <h3 className="text-xl sm:text-2xl font-black leading-tight text-white mb-2 pb-1 drop-shadow-md">{project.title}</h3>
                      <div className={`h-1 rounded-full bg-gradient-to-r from-[#C1E8FF] to-[#5483B3] mt-2 transition-all duration-500 ease-out ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                    </div>
                  </div>
                </Link>
               );
            })
          }
        </RadialScrollGallery>

      </div>
    </Section>
  );
}
