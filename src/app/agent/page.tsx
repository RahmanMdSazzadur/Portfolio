import { AgentDashboard } from "./AgentDashboard";

export const metadata = {
  title: "AI Job Agent | Portfolio",
  description:
    "Autonomous AI agent that discovers jobs, finds recruiter contacts, and sends personalised cold emails.",
};

export default function AgentPage() {
  return <AgentDashboard />;
}
