"use client";

import { Section } from "@/components/ui/Section";
import { Play, X, Eye, TrendingUp, Flame, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { GlowCard } from "@/components/ui/spotlight-card";
import Image from "next/image";

const KICKS_SIX_THUMBNAIL = "/clients/kicks-six-profile.jpg";

const videos = [
  {
    id: 1,
    tiktokId: "7564398607000931602",
    title: "The Viral Moment",
    category: "TikTok Viral",
    views: "30.2M",
    likes: "1.2M+",
    glowColor: "red",
    featured: true,
    description: "One of the most viewed videos on TikTok Bangladesh — a milestone moment for KICKS & SIX.",
  },
  {
    id: 2,
    tiktokId: "7408022200638311697",
    title: "Bangladesh Journey to SAFF U20 Final",
    category: "Sports Documentary",
    views: "4.6M",
    likes: "280K+",
    glowColor: "cyan",
    featured: false,
    description: "A cinematic documentary-style recap of the Bangladesh U20 team's historic SAFF journey.",
  },
];

function TikTokEmbed({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-3xl"
      onClick={onClose}
    >
      <button 
        className="absolute top-6 right-6 md:top-8 md:right-8 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors border border-white/20 text-white z-50 cursor-pointer"
        onClick={onClose}
      >
        <X className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <motion.div 
        initial={{ scale: 0.85, y: 60, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[380px] rounded-[2rem] overflow-hidden bg-black border border-white/15 shadow-[0_0_120px_rgba(255,255,255,0.08)] cursor-default"
      >
        {/* Loading State */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
              <span className="text-white/50 text-sm font-medium">Loading TikTok...</span>
            </div>
          </div>
        )}
        <iframe 
          ref={iframeRef}
          src={`https://www.tiktok.com/player/v1/${videoId}?&music_info=1&description=1`}
          className="w-full border-0"
          style={{ height: "min(80vh, 700px)" }}
          allow="fullscreen"
          allowFullScreen
          onLoad={() => setLoaded(true)}
        />
      </motion.div>
    </motion.div>
  );
}

export function ContentShowcaseSection() {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const featuredVideo = videos.find(v => v.featured)!;
  const gridVideos = videos.filter(v => !v.featured);

  return (
    <Section id="content" title="Content Showcase" subtitle="High-retention video formats that stop the scroll — produced for KICKS & SIX.">
      
      {/* Featured / Hero Video Card - The 30.2M Viral Hit */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
        className="max-w-5xl mx-auto mt-12 px-4"
      >
        <GlowCard 
          customSize 
          className="w-full h-[320px] md:h-[380px] cursor-pointer group hover:-translate-y-1 duration-500 overflow-hidden bg-[#0d0d0f] border-white/5"
          glowColor="red"
        >
          <div 
            className="absolute inset-0 z-20 w-full h-full"
            onClick={() => setSelectedVideoId(featuredVideo.tiktokId)}
          />

          {/* Thumbnail Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src={KICKS_SIX_THUMBNAIL}
              alt="KICKS & SIX"
              fill
              className="object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700 scale-110 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0f]/90 via-[#0d0d0f]/60 to-[#0d0d0f]/40" />
          </div>

          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Default State */}
          <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 p-8 md:p-12 pointer-events-none transition-all duration-500 z-10">
            
            {/* Left: Play button + View count */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl animate-pulse" />
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 border-2 border-white/15 flex items-center justify-center group-hover:border-red-500/40 group-hover:bg-red-500/10 transition-all duration-500">
                  <Play className="w-8 h-8 md:w-10 md:h-10 text-white/70 ml-1 group-hover:text-white transition-colors" fill="currentColor" />
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span className="text-xs font-bold text-red-300 uppercase tracking-wider">Viral</span>
              </div>
            </div>

            {/* Right: Info */}
            <div className="text-center md:text-left max-w-lg">
              <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{featuredVideo.category}</span>
                <span className="text-[10px] text-white/20">•</span>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">KICKS & SIX</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">{featuredVideo.title}</h3>
              <p className="text-sm md:text-base text-white/40 font-medium leading-relaxed mb-5 hidden md:block">{featuredVideo.description}</p>
              
              <div className="flex items-center gap-6 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-red-400/80" />
                  <span className="text-2xl md:text-3xl font-black text-white tracking-tight">{featuredVideo.views}</span>
                  <span className="text-xs font-bold text-white/30 uppercase">Views</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400/80" />
                  <span className="text-lg font-bold text-white/70">{featuredVideo.likes}</span>
                  <span className="text-xs font-bold text-white/30 uppercase">Likes</span>
                </div>
              </div>
            </div>
          </div>
        </GlowCard>
      </motion.div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 gap-5 max-w-md mx-auto mt-8 px-4">
        {gridVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: index * 0.1, type: "spring", stiffness: 100 }}
            className="w-full h-full"
          >
            <GlowCard 
              customSize 
              className="w-full h-[240px] cursor-pointer group hover:-translate-y-1 duration-500 overflow-hidden bg-[#0d0d0f] border-white/5"
              glowColor={video.glowColor as any}
            >
              <div 
                className="absolute inset-0 z-20 w-full h-full"
                onClick={() => setSelectedVideoId(video.tiktokId)}
              />

              {/* Thumbnail Background */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={KICKS_SIX_THUMBNAIL}
                  alt="KICKS & SIX"
                  fill
                  className="object-cover opacity-40 group-hover:opacity-65 transition-opacity duration-700 scale-110 group-hover:scale-100"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/50 to-[#0d0d0f]/20" />
              </div>

              {/* Default Centered Play */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none transition-all duration-500 group-hover:opacity-0 group-hover:scale-95 z-10">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
                  <Play className="w-5 h-5 text-white/50 ml-1" fill="currentColor" />
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3 h-3 text-white/30" />
                  <span className="text-xs font-bold text-white/30">{video.views}</span>
                </div>
              </div>

              {/* Hover Active State */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between pointer-events-none transition-all duration-500 opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100 z-10">
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <Eye className="w-3 h-3 text-white/60" />
                    <span className="text-[11px] font-bold text-white/70">{video.views}</span>
                  </div>
                  <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center bg-black/40 backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  </div>
                </div>
                
                <div className="mt-auto">
                  <div className="text-[10px] font-bold text-white/40 mb-1 uppercase tracking-widest">{video.category}</div>
                  <h4 className="text-base font-bold text-white tracking-tight leading-tight">{video.title}</h4>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* TikTok Embed Modal */}
      <AnimatePresence>
        {selectedVideoId && (
          <TikTokEmbed 
            videoId={selectedVideoId} 
            onClose={() => setSelectedVideoId(null)} 
          />
        )}
      </AnimatePresence>

    </Section>
  );
}
