import { Navbar } from "@/components/ui/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { ContentShowcaseSection } from "@/components/sections/ContentShowcaseSection";
import { FacebookReelsSection } from "@/components/sections/FacebookReelsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { AutomationSystemsSection } from "@/components/sections/AutomationSystemsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <TimelineSection />
      <ClientsSection />
      <ContentShowcaseSection />
      <FacebookReelsSection />
      <ProjectsSection />
      <AutomationSystemsSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
}
