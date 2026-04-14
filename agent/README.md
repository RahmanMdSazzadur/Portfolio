# AI Job Application Agent

An autonomous multi-agent pipeline that finds relevant job listings, locates recruiter emails, writes personalised cold outreach with GPT-4o, and auto-applies to positions via Playwright — all tracked in a Next.js dashboard.

## Architecture

```
CV Parser → Job Discovery → Recruiter Finder → Email Generator → Email Sender → Auto-Apply
     ↓              ↓               ↓                  ↓               ↓             ↓
 profile.json    jobs.db         jobs.db            emails[]       Gmail API    Playwright
```

| Module | File | Purpose |
|---|---|---|
| CV Parser | `cv_parser.py` | Extracts structured profile from a PDF or text CV |
| Job Discovery | `job_discovery.py` | Searches Adzuna API for matching roles |
| Recruiter Finder | `recruiter_finder.py` | Finds recruiter emails via Hunter.io |
| Email Generator | `email_generator.py` | Writes personalised cold emails with GPT-4o |
| Email Sender | `email_sender.py` | Sends emails through Gmail API with rate limiting |
| Auto-Apply | `auto_apply.py` | Fills and submits application forms with Playwright |
| Database | `database.py` | SQLite state store — tracks every job through the pipeline |
| Orchestrator | `orchestrator.py` | Wires all agents together, exposes a CLI |
| Server | `server.py` | FastAPI wrapper for the Next.js dashboard integration |

## Quick Start

### 1. Install dependencies

```bash
cd agent
pip install -r requirements.txt
playwright install chromium
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Fill in your API keys in .env
```

Required keys:
- `OPENAI_API_KEY` — [platform.openai.com](https://platform.openai.com)
- `ADZUNA_APP_ID` + `ADZUNA_API_KEY` — [developer.adzuna.com](https://developer.adzuna.com) (free tier available)
- `HUNTER_API_KEY` — [hunter.io](https://hunter.io) (25 free searches/month)
- Gmail OAuth credentials — [console.cloud.google.com](https://console.cloud.google.com)

### 3. Run from the CLI

```bash
# One-shot run — find jobs, email recruiters, auto-apply
python orchestrator.py --job "Software Engineer" --location "London" --cv cv.pdf

# Skip auto-apply (email only)
python orchestrator.py --job "Data Analyst" --skip-apply

# Save results to a file
python orchestrator.py --job "ML Engineer" --output results.json
```

### 4. Start the API server (for the Next.js dashboard)

```bash
uvicorn server:app --host 0.0.0.0 --port 8000
```

Then set `AGENT_BACKEND_URL=http://localhost:8000` in the portfolio's `.env.local` and the dashboard at `/agent` will connect to the live agent.

## Scheduling

Add to crontab to run every weekday at 9 AM:

```cron
0 9 * * 1-5 cd /path/to/agent && source .env && python orchestrator.py --job "Software Engineer" --location "Remote"
```

## Compliance & Ethics

- **Daily sending limit**: Default 25 emails/day (`DAILY_EMAIL_LIMIT`). Increase carefully.
- **Adzuna API**: Official API — no scraping required.
- **Hunter.io**: Resolves publicly available email patterns — compliant with GDPR when used for legitimate job outreach.
- **Auto-apply**: Only submits to publicly accessible application forms. CAPTCHAs and assessment-heavy forms are skipped and flagged for manual review.
- **LinkedIn**: This agent does **not** scrape LinkedIn. Use their official API or enter recruiter names manually.

## Dashboard

The Next.js portfolio includes a live dashboard at `/agent` that lets you:

- Enter a target job title and location
- Paste your CV text
- Trigger the pipeline
- Monitor pipeline stages in real time
- View job results, email statuses, and agent logs

When `AGENT_BACKEND_URL` is not set the dashboard runs in **demo mode** with realistic mock data so the UI can be shown in your portfolio.
