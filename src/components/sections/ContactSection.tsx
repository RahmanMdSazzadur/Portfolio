"use client";

import { Section } from "@/components/ui/Section";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useState } from "react";

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Build mailto link with form data
    const subject = encodeURIComponent(`Portfolio Contact: ${data.project_type || "General"}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nProject Type: ${data.project_type}\n\nMessage:\n${data.message}`
    );

    window.open(`mailto:mdsazzadur570@gmail.com?subject=${subject}&body=${body}`, "_self");
    
    setStatus("sent");
    form.reset();
    setTimeout(() => setStatus("idle"), 5000);
  }

  return (
    <Section id="contact" className="py-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Strong CTA */}
        <div className="flex flex-col gap-8 text-center lg:text-left">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] text-white">
            Let&apos;s build <br className="hidden lg:block"/>
            <span className="text-gradient">something powerful.</span>
          </h2>
          
          <p className="text-xl text-foreground/70 font-medium max-w-xl mx-auto lg:mx-0">
            Whether you need a full-funnel content strategy, an automated growth engine, or a premium web experience, let&apos;s talk.
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#0a0a0a] bg-primary/20 flex items-center justify-center text-primary font-bold text-xs z-30">MR</div>
              <div className="w-12 h-12 rounded-full border-2 border-[#0a0a0a] bg-secondary/20 flex items-center justify-center text-secondary font-bold text-xs z-20">SJ</div>
              <div className="w-12 h-12 rounded-full border-2 border-[#0a0a0a] bg-accent/20 flex items-center justify-center text-accent font-bold text-xs z-10">+12</div>
            </div>
            <div className="text-sm font-bold text-white/50">Join 15+ hyper-growth brands.</div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="relative isolate">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-[2.5rem] blur-xl -z-10 opacity-50" />
          
          <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-white/10 bg-black/60 backdrop-blur-3xl">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              
              {/* Hidden fields for FormSubmit */}
              <input type="hidden" name="_subject" value="New Portfolio Contact Message" />
              <input type="hidden" name="_template" value="table" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-foreground/50 ml-1">Name</label>
                  <input id="name" name="name" type="text" required placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-foreground/50 ml-1">Email</label>
                  <input id="email" name="email" type="email" required placeholder="john@company.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="project" className="text-xs font-bold uppercase tracking-widest text-foreground/50 ml-1">Project Type</label>
                <select id="project" name="project_type" defaultValue="" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors appearance-none cursor-pointer">
                  <option value="" disabled className="text-black">Select an option...</option>
                  <option value="Content Strategy" className="text-black">Content Strategy</option>
                  <option value="n8n Automation" className="text-black">n8n Automation</option>
                  <option value="Web Experience" className="text-black">Web Experience</option>
                  <option value="Other" className="text-black">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-foreground/50 ml-1">Message</label>
                <textarea id="message" name="message" rows={4} required placeholder="Tell me about your goals..." className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors resize-none" />
              </div>

              <div className="pt-4">
                <MagneticButton>
                  <button 
                    type="submit" 
                    disabled={status === "sending"}
                    className="w-full py-5 rounded-xl bg-white text-black font-black tracking-wide text-lg hover:bg-neutral-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "idle" && "SEND MESSAGE"}
                    {status === "sending" && "SENDING..."}
                    {status === "sent" && "✓ MESSAGE SENT!"}
                    {status === "error" && "FAILED — TRY AGAIN"}
                  </button>
                </MagneticButton>
              </div>

              {status === "sent" && (
                <p className="text-center text-sm font-bold text-green-400 animate-pulse">
                  Thank you! I&apos;ll get back to you soon.
                </p>
              )}

            </form>
          </div>
        </div>

      </div>
      
      {/* Social Links */}
      <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
        <a href="https://www.facebook.com/md.s.rahman051" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-white/10 transition-all duration-300">
          <svg className="w-5 h-5 text-white/60 group-hover:text-[#1877F2] transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Facebook</span>
        </a>
        <a href="https://wa.me/358449744191" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-green-500/40 hover:bg-white/10 transition-all duration-300">
          <svg className="w-5 h-5 text-white/60 group-hover:text-[#25D366] transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">WhatsApp</span>
        </a>
        <a href="https://www.instagram.com/rahman_sazz/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-pink-500/40 hover:bg-white/10 transition-all duration-300">
          <svg className="w-5 h-5 text-white/60 group-hover:text-pink-500 transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Instagram</span>
        </a>
      </div>

      <div className="mt-16 text-center text-sm font-bold text-foreground/30 uppercase tracking-widest border-t border-white/5 pt-12">
        © {new Date().getFullYear()} MD SAZZADUR RAHMAN. All rights reserved.
      </div>
    </Section>
  );
}
