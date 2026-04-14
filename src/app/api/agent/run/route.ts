import { NextRequest, NextResponse } from "next/server";

// Shape of what the Python agent returns (or what we mock when env vars are absent)
interface AgentRunResult {
  jobsFound: number;
  emailsSent: number;
  applicationsSubmitted: number;
  jobs: {
    title: string;
    company: string;
    location: string;
    url: string;
    recruiterEmail?: string;
    status: "found" | "applied" | "emailed" | "error";
  }[];
  logs: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobTitle, location, cvText } = body as {
      jobTitle?: string;
      location?: string;
      cvText?: string;
    };

    if (!jobTitle || typeof jobTitle !== "string" || !jobTitle.trim()) {
      return NextResponse.json({ error: "jobTitle is required" }, { status: 400 });
    }

    const agentUrl = process.env.AGENT_BACKEND_URL;

    // ── If a Python backend is configured, proxy the request ──────────────────
    if (agentUrl) {
      const upstream = await fetch(`${agentUrl}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, location, cvText }),
      });

      if (!upstream.ok) {
        const err = await upstream.text();
        return NextResponse.json(
          { error: `Agent backend error: ${err}` },
          { status: 502 }
        );
      }

      const data: AgentRunResult = await upstream.json();
      return NextResponse.json(data);
    }

    // ── Demo mode: return realistic mock data so the UI is fully functional ──
    const mockJobs: AgentRunResult["jobs"] = [
      {
        title: jobTitle,
        company: "Acme Corp",
        location: location || "Remote",
        url: "https://www.adzuna.co.uk/jobs/details/example1",
        recruiterEmail: "sarah.jones@acme.com",
        status: "emailed",
      },
      {
        title: jobTitle,
        company: "TechFlow Ltd",
        location: location || "Remote",
        url: "https://www.adzuna.co.uk/jobs/details/example2",
        recruiterEmail: "hiring@techflow.io",
        status: "applied",
      },
      {
        title: jobTitle,
        company: "NovaSystems",
        location: location || "Remote",
        url: "https://www.adzuna.co.uk/jobs/details/example3",
        status: "found",
      },
    ];

    const result: AgentRunResult = {
      jobsFound: mockJobs.length,
      emailsSent: mockJobs.filter((j) => j.status === "emailed").length,
      applicationsSubmitted: mockJobs.filter((j) => j.status === "applied").length,
      jobs: mockJobs,
      logs: [
        `[CV Parser]      Extracted 12 skills and 3 years of experience from CV`,
        `[Job Discovery]  Searched RemoteOK for "${jobTitle}" in "${location || "Remote"}"`,
        `[Job Discovery]  Found ${mockJobs.length} matching roles`,
        `[Recruiter]      Resolved 2 / ${mockJobs.length} recruiter emails via DNS pattern lookup`,
        `[Email Gen]      Generated personalised cold emails using Groq llama3-70b`,
        `[Email Sender]   Sent 1 email via SMTP — daily limit respected`,
        `[Auto-Apply]     Submitted application to TechFlow Ltd via Playwright`,
        `[Orchestrator]   Pipeline complete. Next run scheduled in 24 h.`,
      ],
    };

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("[/api/agent/run]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
