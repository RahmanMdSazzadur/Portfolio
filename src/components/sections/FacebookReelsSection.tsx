"use client";

import { Section } from "@/components/ui/Section";
import { Play, Eye, Flame, Globe, ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/spotlight-card";
import Image from "next/image";

const KICKS_SIX_THUMBNAIL = "/clients/kicks-six-profile.jpg";
const NEXGEN_THUMBNAIL = "/clients/nexgen-facebook.png";

interface FacebookReel {
  id: number;
  title: string;
  brand: string;
  category: string;
  views?: string;
  likes?: string;
  comments?: string;
  shares?: string;
  glowColor: string;
  thumbnail: string;
  link: string;
  featured?: boolean;
  description?: string;
}

const facebookReels: FacebookReel[] = [
  // KICKS & SIX Reels
  {
    id: 1,
    title: "Real Madrid vs Atletico Madrid",
    brand: "KICKS & SIX",
    category: "Match Reaction",
    views: "100K+",
    glowColor: "blue",
    thumbnail: KICKS_SIX_THUMBNAIL,
    link: "https://www.facebook.com/people/KICKS-SIX/61554840814867/",
    featured: true,
    description: "Viral match reaction that exploded across Facebook — one of the most engaged reels on the page.",
  },
  {
    id: 2,
    title: "Real Madrid Analysis",
    brand: "KICKS & SIX",
    category: "Tactical Breakdown",
    views: "100K",
    glowColor: "cyan",
    thumbnail: KICKS_SIX_THUMBNAIL,
    link: "https://www.facebook.com/people/KICKS-SIX/61554840814867/",
  },
  // NexGen Fusion 3D Reels
  {
    id: 3,
    title: "Elegoo Centauri Carbon 2 Combo",
    brand: "NexGen Fusion 3D",
    category: "Product Showcase",
    likes: "188",
    comments: "15",
    shares: "30",
    glowColor: "green",
    thumbnail: NEXGEN_THUMBNAIL,
    link: "https://www.facebook.com/reel/1386146430191243",
    featured: true,
    description: "Professional product reel showcasing the Elegoo Centauri Carbon 2 Combo 3D Printer — multicolor printing, premium build quality.",
  },
];

export function FacebookReelsSection() {
  // Group reels by brand
  const kicksReels = facebookReels.filter(r => r.brand === "KICKS & SIX");
  const nexgenReels = facebookReels.filter(r => r.brand === "NexGen Fusion 3D");

  return (
    <Section
      id="fb-reels"
      title="Facebook Reels"
      subtitle="Video content I produced, edited, and published for my clients — driving engagement and sales."
    >
      {/* KICKS & SIX Section */}
      <div className="max-w-6xl mx-auto px-4 mt-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
            <Image src={KICKS_SIX_THUMBNAIL} alt="KICKS & SIX" width={32} height={32} className="object-cover w-full h-full" />
          </div>
          <span className="text-sm font-bold text-white/60 uppercase tracking-wider">KICKS & SIX</span>
          <div className="flex-1 h-px bg-white/5" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {kicksReels.map((reel, index) => (
            <ReelCard key={reel.id} reel={reel} index={index} />
          ))}
        </div>
      </div>

      {/* NexGen Fusion 3D Section */}
      <div className="max-w-6xl mx-auto px-4 mt-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-white flex items-center justify-center">
            <span className="text-[8px] font-black text-black leading-none">NG</span>
          </div>
          <span className="text-sm font-bold text-white/60 uppercase tracking-wider">NexGen Fusion 3D</span>
          <div className="flex-1 h-px bg-white/5" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {nexgenReels.map((reel, index) => (
            <ReelCard key={reel.id} reel={reel} index={index} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function ReelCard({ reel, index }: { reel: FacebookReel; index: number }) {
  const isFeatured = reel.featured;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, type: "spring", stiffness: 100 }}
      className={isFeatured && reel.brand === "KICKS & SIX" ? "md:col-span-2" : ""}
    >
      <a
        href={reel.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <GlowCard
          customSize
          className={`w-full ${isFeatured ? "h-[280px] md:h-[320px]" : "h-[240px]"} cursor-pointer group hover:-translate-y-1 duration-500 overflow-hidden bg-[#0d0d0f] border-white/5`}
          glowColor={reel.glowColor as any}
        >
          {/* Thumbnail Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src={reel.thumbnail}
              alt={reel.brand}
              fill
              className={`object-cover ${isFeatured ? "opacity-50 group-hover:opacity-70" : "opacity-40 group-hover:opacity-60"} transition-opacity duration-700 scale-110 group-hover:scale-105`}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className={`absolute inset-0 ${isFeatured ? "bg-gradient-to-r from-[#0d0d0f]/90 via-[#0d0d0f]/50 to-[#0d0d0f]/30" : "bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/50 to-[#0d0d0f]/20"}`} />
          </div>

          {/* Content */}
          <div className={`absolute inset-0 flex ${isFeatured ? "flex-col md:flex-row items-center justify-center gap-6 md:gap-10 p-8 md:p-10" : "flex-col justify-end p-6"} z-10`}>
            {isFeatured && (
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className={`absolute inset-0 ${reel.glowColor === "green" ? "bg-green-500/30" : "bg-blue-500/30"} rounded-full blur-xl animate-pulse`} />
                  <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 border-2 border-white/15 flex items-center justify-center group-hover:border-${reel.glowColor}-500/40 group-hover:bg-${reel.glowColor}-500/10 transition-all duration-500`}>
                    <Play className="w-7 h-7 md:w-8 md:h-8 text-white/70 ml-1 group-hover:text-white transition-colors" fill="currentColor" />
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${reel.glowColor === "green" ? "bg-green-500/10 border-green-500/20" : "bg-blue-500/10 border-blue-500/20"} border`}>
                  <Flame className={`w-3 h-3 ${reel.glowColor === "green" ? "text-green-400" : "text-blue-400"}`} />
                  <span className={`text-[10px] font-bold ${reel.glowColor === "green" ? "text-green-300" : "text-blue-300"} uppercase tracking-wider`}>
                    {reel.brand === "NexGen Fusion 3D" ? "Product Reel" : "Viral Reel"}
                  </span>
                </div>
              </div>
            )}

            <div className={isFeatured ? "text-center md:text-left max-w-md" : ""}>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-3 h-3 text-white/30" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">Facebook Reel</span>
                <span className="text-[10px] text-white/20">•</span>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">{reel.category}</span>
              </div>

              <h3 className={`${isFeatured ? "text-xl md:text-2xl" : "text-lg"} font-black text-white tracking-tight mb-2`}>{reel.title}</h3>

              {isFeatured && reel.description && (
                <p className="text-sm text-white/35 font-medium leading-relaxed mb-4 hidden md:block">{reel.description}</p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 flex-wrap">
                {reel.views && (
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-400/70" />
                    <span className={`${isFeatured ? "text-xl md:text-2xl" : "text-sm"} font-black text-white`}>{reel.views}</span>
                    {isFeatured && <span className="text-[10px] font-bold text-white/30 uppercase">views</span>}
                  </div>
                )}
                {reel.likes && (
                  <div className="flex items-center gap-1.5">
                    <ThumbsUp className="w-3.5 h-3.5 text-blue-400/70" />
                    <span className={`${isFeatured ? "text-lg font-bold" : "text-sm font-bold"} text-white/70`}>{reel.likes}</span>
                  </div>
                )}
                {reel.comments && (
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-green-400/70" />
                    <span className="text-sm font-bold text-white/70">{reel.comments}</span>
                  </div>
                )}
                {reel.shares && (
                  <div className="flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-purple-400/70" />
                    <span className="text-sm font-bold text-white/70">{reel.shares}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </GlowCard>
      </a>
    </motion.div>
  );
}
