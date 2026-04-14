# AI Job Application Agent

An autonomous multi-agent pipeline that finds remote job listings, guesses
recruiter email addresses, writes personalised cold outreach with a free LLM,
and auto-applies to positions via Playwright — all tracked in a Next.js
dashboard.

**100 % free to run.** No paid APIs required.

## Architecture

```
CV Parser → Job Discovery → Recruiter Finder → Email Generator → Email Sender → Auto-Apply
     ↓              ↓               ↓                  ↓               ↓             ↓
 profile.json    jobs.db         jobs.db            emails[]       SMTP relay    Playwright
```

| Module | File | Purpose | Cost |
|---|---|---|---|
| CV Parser | `cv_parser.py` | Extracts structured profile from a PDF or text CV | Free (Groq) |
| Job Discovery | `job_discovery.py` | Searches [RemoteOK](https://remoteok.com/api) for matching roles | Free (no auth) |
| Recruiter Finder | `recruiter_finder.py` | Guesses HR emails via patterns + DNS MX check | Free (DNS only) |
| Email Generator | `email_generator.py` | Writes personalised cold emails with Groq llama3-70b | Free tier |
| Email Sender | `email_sender.py` | Sends emails through any SMTP server with rate limiting | Free (Gmail/Outlook) |
| Auto-Apply | `auto_apply.py` | Fills and submits application forms with Playwright | Free (open-source) |
| Database | `database.py` | SQLite state store — tracks every job through the pipeline | Free |
| Orchestrator | `orchestrator.py` | Wires all agents together, exposes a CLI | — |
| Server | `server.py` | FastAPI wrapper for the Next.js dashboard integration | — |

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
# Fill in the two required values: GROQ_API_KEY and SMTP_USER / SMTP_PASSWORD
```

Required keys (all free):

| Variable | Where to get it |
|---|---|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) → API Keys → Create key (free, no CC) |
| `SMTP_USER` | Your Gmail or Outlook address |
| `SMTP_PASSWORD` | Gmail: Settings → Security → App Passwords (requires 2FA enabled) |

### 3. Run from the CLI

```bash
# One-shot run — find jobs, email recruiters, auto-apply
python orchestrator.py --job "Software Engineer" --location "Remote" --cv cv.pdf

# Skip auto-apply (email only)
python orchestrator.py --job "Data Analyst" --skip-apply

# Save results to a file
python orchestrator.py --job "ML Engineer" --output results.json
```

### 4. Start the API server (for the Next.js dashboard)

```bash
uvicorn server:app --host 0.0.0.0 --port 8000
```

Then set `AGENT_BACKEND_URL=http://localhost:8000` in the portfolio's
`.env.local` and the dashboard at `/agent` will connect to the live agent.

## Free-tier limits

| Service | Free limit | Notes |
|---|---|---|
| Groq | 14,400 req/day · 30 RPM | More than enough for daily runs |
| RemoteOK | Unlimited | Public JSON API, no auth |
| Gmail SMTP | ~500 emails/day | Use app password; respects `DAILY_EMAIL_LIMIT` |
| Playwright | Unlimited | Open-source |

## Scheduling

Add to crontab to run every weekday at 9 AM:

```cron
0 9 * * 1-5 cd /path/to/agent && source .env && python orchestrator.py --job "Software Engineer" --location "Remote"
```

## Compliance & Ethics

- **Daily sending limit**: Default 25 emails/day (`DAILY_EMAIL_LIMIT`). Adjust carefully.
- **RemoteOK**: Official public API — no scraping required.
- **Recruiter emails**: Pattern-guessed generic inboxes (careers@, hr@, jobs@). Domain verified via DNS MX before use.
- **Auto-apply**: Only submits to publicly accessible forms. CAPTCHAs and assessment-heavy forms are skipped and flagged for manual review.
- **LinkedIn**: This agent does **not** scrape LinkedIn.

## Dashboard

The Next.js portfolio includes a live dashboard at `/agent` that lets you:

- Enter a target job title and location
- Paste your CV text
- Trigger the pipeline
- Monitor pipeline stages in real time
- View job results, email statuses, and agent logs

When `AGENT_BACKEND_URL` is not set the dashboard runs in **demo mode** with
realistic mock data so the UI can be shown in your portfolio without any
backend running.
