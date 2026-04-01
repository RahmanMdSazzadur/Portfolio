'use client';

import { Project } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export default function ProjectDetailClient({ project }: { project: Project }) {
  return (
    <main className="bg-[#021024] min-h-screen text-white">
      {/* Back Button */}
      <Link
        href="/"
        className="fixed top-8 left-8 z-[100] flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/20 transition-all font-bold text-sm tracking-widest uppercase"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      {/* ── Hero Section ── */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={project.bgImage}
            alt={project.title}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#021024]" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-primary/80 text-sm font-bold tracking-[0.3em] uppercase mb-4"
          >
            {project.cat} · {project.date}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]"
          >
            {project.title}
          </motion.h1>

          {/* Floating project card preview */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-10 w-[320px] md:w-[500px] aspect-[4/3] relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-black/50"
          >
            <Image
              src={project.img}
              alt={project.title}
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/40 text-xs tracking-[0.2em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 bg-white/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Content Section ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 py-16 md:py-24">
        {/* Overview */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          custom={0}
          className="mb-16"
        >
          <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-primary/60 mb-4">
            Overview
          </h2>
          <p className="text-xl md:text-2xl text-white/85 leading-relaxed font-medium">
            {project.about.overview}
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {project.about.metrics.map((metric, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              custom={i}
              className="relative group rounded-2xl p-6 border border-white/10 text-center overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 text-lg md:text-xl font-black text-primary block">
                {metric}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Conclusion */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          custom={0}
          className="relative pl-6 border-l-2 border-primary/30"
        >
          <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-primary/60 mb-4">
            Result
          </h2>
          <p className="text-lg md:text-xl text-white/65 italic leading-relaxed">
            &ldquo;{project.about.conclusion}&rdquo;
          </p>
        </motion.div>
      </section>
    </main>
  );
}
