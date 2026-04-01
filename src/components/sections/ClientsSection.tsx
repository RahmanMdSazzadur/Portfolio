"use client";

import { Section } from "@/components/ui/Section";
import { LogoMarquee } from "@/components/ui/LogoMarquee";
import { GlowCard } from "@/components/ui/spotlight-card";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Video, Music2, Users, Globe, TrendingUp, Eye, ShoppingBag, Search } from "lucide-react";
import Image from "next/image";

const KICKS_SIX_THUMBNAIL = "/clients/kicks-six-profile.jpg";

const clients = [
  {
    id: 1,
    brand: "KICKS & SIX",
    platform: "YouTube",
    title: "YouTube Channel Growth",
    image: "/clients/kicks-six-youtube.png",
    color: "red",
    icon: <Video className="w-4 h-4" />,
    stats: { subscribers: "1,454", views: "37.6K", watchTime: "1.6K hrs" },
  },
  {
    id: 2,
    brand: "KICKS & SIX",
    platform: "TikTok",
    title: "TikTok Viral Growth",
    image: "/clients/kicks-six-tiktok.png",
    color: "cyan",
    icon: <Music2 className="w-4 h-4" />,
    stats: { followers: "262.8K", likes: "5.5M", views: "30.2M+" },
  },
  {
    id: 3,
    brand: "KICKS & SIX",
    platform: "Facebook",
    title: "Facebook Page Management",
    image: "/clients/kicks-six-facebook.png",
    color: "purple",
    icon: <Users className="w-4 h-4" />,
    stats: { followers: "17K", posts: "1.8K", reviews: "100%" },
  },
  {
    id: 4,
    brand: "NexGen Fusion 3D",
    platform: "Website / SEO",
    title: "E-Commerce & SEO Management",
    image: "/clients/nexgen-website.png",
    color: "green",
    icon: <Search className="w-4 h-4" />,
    stats: { platform: "Shopify", focus: "SEO", type: "E-Commerce" },
  },
  {
    id: 5,
    brand: "NexGen Fusion 3D",
    platform: "Facebook",
    title: "Facebook Page & Sales",
    image: "/clients/nexgen-facebook.png",
    color: "blue",
    icon: <ShoppingBag className="w-4 h-4" />,
    stats: { followers: "3.4K", category: "3D Print", reach: "Growing" },
  },
];

export function ClientsSection() {
  const [selectedClient, setSelectedClient] = useState<typeof clients[0] | null>(null);

  return (
    <section id="clients" className="pt-24 pb-12 overflow-hidden bg-background">
      
      <div className="container mx-auto px-6 mb-12 text-center max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          CLIENTS & COLLABORATIONS
        </h2>
        <p className="text-lg md:text-xl text-foreground/60 font-medium">
          Collaborated with brands like Gigabyte, Yamaha &amp; bKash — and managing growth for KICKS &amp; SIX and NexGen Fusion 3D.
        </p>
      </div>

      <LogoMarquee />

      <div className="container mx-auto px-4 md:px-6 mt-16 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.12, type: "spring", stiffness: 100 }}
            >
              <GlowCard 
                customSize
                className="group relative overflow-hidden cursor-pointer w-full h-[320px] bg-[#0d0d0f] border-white/5 hover:-translate-y-2 transition-transform duration-500"
                glowColor={item.color as any}
              >
                <div 
                  className="absolute inset-0 z-20"
                  onClick={() => setSelectedClient(item)}
                />
                
                {/* Client Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={item.image}
                    alt={`${item.brand} - ${item.platform}`}
                    fill
                    className="object-cover object-top opacity-70 group-hover:opacity-90 transition-opacity duration-700 scale-105 group-hover:scale-100"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/70 to-transparent" />
                </div>

                {/* Platform Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                  {item.icon}
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/70">{item.platform}</span>
                </div>

                {/* Stats Row - visible on hover */}
                <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <span className="text-[10px] font-bold text-white/60">
                      {Object.entries(item.stats)[0][1]}
                    </span>
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  {/* Mini Stats */}
                  <div className="flex gap-4 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75 translate-y-3 group-hover:translate-y-0">
                    {Object.entries(item.stats).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-sm font-extrabold text-white">{value}</span>
                        <span className="text-[9px] uppercase tracking-widest text-white/40 font-semibold">{key}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-[0.2em]">{item.brand}</div>
                  <h4 className="text-lg font-bold text-white tracking-tight leading-tight">{item.title}</h4>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full-Screen Image Modal */}
      <AnimatePresence>
        {selectedClient && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-3xl"
            onClick={() => setSelectedClient(null)}
          >
            <button 
              className="absolute top-6 right-6 md:top-8 md:right-8 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors border border-white/20 text-white z-50 cursor-pointer"
              onClick={() => setSelectedClient(null)}
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-[9/16] w-full max-w-sm rounded-[2rem] overflow-hidden bg-black border border-white/20 shadow-[0_0_150px_rgba(255,255,255,0.1)] cursor-default"
            >
              <Image
                src={selectedClient.image}
                alt={`${selectedClient.brand} - ${selectedClient.platform}`}
                fill
                className="object-cover object-top"
                sizes="400px"
              />

              {/* Top-left Platform Tag within modal */}
              <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-white/20 backdrop-blur-xl z-10">
                {selectedClient.icon}
                <span className="text-xs font-bold uppercase tracking-wider text-white/90">{selectedClient.platform}</span>
              </div>

              {/* Bottom Gradient Info */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
                <div className="flex gap-6 mb-4">
                  {Object.entries(selectedClient.stats).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-lg font-extrabold text-white">{value}</span>
                      <span className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">{key}</span>
                    </div>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{selectedClient.title}</h3>
                <p className="text-sm text-white/50 font-medium">{selectedClient.brand}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
