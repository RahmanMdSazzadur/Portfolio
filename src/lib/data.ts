export interface Project {
  id: string; // alphanumeric string for URLs
  title: string;
  cat: string;
  img: string;
  date: string;
  bgImage: string;
  about: {
    overview: string;
    metrics: string[];
    conclusion: string;
  };
}

export const projects: Project[] = [
  {
    id: "seo-traffic-engine",
    title: "SEO Traffic Supercharger",
    cat: "Automation",
    date: "2025",
    img: "/projects/seo-traffic-engine.png",
    bgImage: "/projects/seo-traffic-engine.png",
    about: {
      overview: "A 3-phase n8n automation pipeline that supercharges website traffic — from Google Trends discovery to AI-powered competitive analysis to fully automated SEO article generation, all stored in Supabase.",
      metrics: ["3-Phase Pipeline", "AI Content Writer", "Google Trends + Crawling", "Auto Supabase Storage"],
      conclusion: "End-to-end SEO content engine: discovers hot topics, analyzes top competitors, and generates publish-ready articles — all on autopilot."
    }
  },
  {
    id: "ytb-metadata-engine",
    title: "YTB Metadata Generator",
    cat: "Automation",
    date: "2025",
    img: "/projects/ytb-metadata-generator.png",
    bgImage: "/projects/ytb-metadata-generator.png",
    about: {
      overview: "A 5-phase n8n automation that watches your YouTube channel via RSS, scrapes new uploads with Apify, feeds the full transcript to Mistral AI, and auto-generates SEO-optimized descriptions, timestamps, and tags — then pushes them back to YouTube. Zero clicks required.",
      metrics: ["100% Hands-Free", "AI-Generated Timestamps", "Auto SEO Tags", "Instant Metadata on Upload"],
      conclusion: "Upload a video. Walk away. The pipeline writes your description, generates perfect timestamps, tags it for discovery, and updates the video — before your first viewer even clicks."
    }
  },
  {
    id: "rag-company-docs",
    title: "RAG Document Intelligence",
    cat: "AI / RAG",
    date: "2025",
    img: "/projects/rag-company-docs.png",
    bgImage: "/projects/rag-company-docs.png",
    about: {
      overview: "A dual-flow n8n RAG system that auto-indexes company documents from Google Drive into a Pinecone vector store using Google Gemini embeddings — then lets employees chat with an AI agent that retrieves precise answers from internal policies, handbooks, and SOPs in real time.",
      metrics: ["98% Answer Accuracy", "Real-Time Doc Sync", "Gemini 2.0 Flash", "Pinecone Vector Search"],
      conclusion: "Your company knowledge base, alive and searchable. Upload a doc to Drive — it's instantly indexed. Ask a question in chat — the AI pulls the exact answer from your files. HR, onboarding, compliance — all on autopilot."
    }
  },
  { 
    id: "b2b-lead-engine", 
    title: "B2B Lead Engine", 
    cat: "Automation", 
    date: "2025",
    img: "/projects/b2b-lead-outreach.png",
    bgImage: "/projects/b2b-lead-outreach.png",
    about: {
      overview: "A fully automated n8n-powered B2B lead management and AI outreach system — from LinkedIn scraping and data enrichment to smart lead scoring, hyper-personalized AI email drafting, and multi-channel follow-up sequences, all synced to your CRM in real time.",
      metrics: ["500+ Leads/Day", "15% Cold Email Open Rate", "3.8% Conversion", "Zero Manual Touchpoints"],
      conclusion: "Your sales team closes. The machine does everything else — scrape, enrich, score, write, send, follow up, repeat. Outbound on autopilot."
    }
  },
];
