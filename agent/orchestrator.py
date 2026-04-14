"""
Orchestrator
------------
Top-level entry point that wires all agents together into a single pipeline:

    1. CV Parser      → build candidate profile
    2. Job Discovery  → find relevant listings via Adzuna
    3. Recruiter Finder → resolve emails with Hunter.io
    4. Email Generator → personalise cold emails with GPT-4o
    5. Email Sender   → dispatch via Gmail API
    6. Auto-Apply     → submit applications via Playwright

Run once:
    python orchestrator.py --job "Software Engineer" --location "London" --cv cv.pdf

Schedule daily (add to crontab):
    0 9 * * 1-5 cd /path/to/agent && python orchestrator.py ...
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
from pathlib import Path

from cv_parser import load_or_parse_profile
from database import Database, JobRecord
from email_generator import generate_cold_email
from email_sender import send_batch
from job_discovery import discover_and_store
from recruiter_finder import find_recruiter_email


def _log(msg: str) -> None:
    print(f"[Orchestrator] {msg}", flush=True)


def run_pipeline(
    job_title: str,
    location: str = "Remote",
    cv_text: str | None = None,
    cv_pdf: str | None = None,
    max_jobs: int = 20,
    max_applications: int = 5,
    skip_apply: bool = False,
) -> dict:
    """
    Execute the full job-application pipeline.

    Returns a summary dict suitable for the Next.js API route.
    """
    db = Database()
    logs: list[str] = []

    def log(msg: str) -> None:
        _log(msg)
        logs.append(f"[Orchestrator] {msg}")

    # ── 1. CV Parser ──────────────────────────────────────────────────────────
    log("Parsing CV…")
    profile = load_or_parse_profile(cv_text=cv_text, cv_pdf=cv_pdf)
    log(f"Profile loaded: {profile.get('name', 'unknown')} — {len(profile.get('skills', []))} skills")

    # ── 2. Job Discovery ──────────────────────────────────────────────────────
    log(f"Searching RemoteOK for '{job_title}' in '{location}'…")
    new_jobs: list[JobRecord] = discover_and_store(job_title, location, max_jobs, db)
    log(f"Found {len(new_jobs)} new job listing(s)")

    emails_to_send = []
    results_summary: list[dict] = []

    for job in new_jobs:
        # ── 3. Recruiter Finder ───────────────────────────────────────────────
        log(f"Looking up recruiter for {job.company}…")
        contact = None
        try:
            contact = find_recruiter_email(job.company, job_url=job.url)
        except Exception as exc:
            log(f"  Recruiter lookup error for {job.company}: {exc}")

        if contact:
            db.update_recruiter(job.job_id, contact.email, contact.first_name)
            log(f"  Found: {contact.email} (confidence {contact.confidence}%)")
        else:
            log(f"  No recruiter email found for {job.company}")

        # ── 4. Email Generator ────────────────────────────────────────────────
        if contact:
            log(f"Generating cold email for {job.title} @ {job.company}…")
            try:
                email = generate_cold_email(
                    job_title=job.title,
                    company=job.company,
                    job_description=job.description,
                    profile=profile,
                    recruiter_name=contact.first_name,
                    recruiter_email=contact.email,
                )
                emails_to_send.append((job, email))
                log(f"  Email ready: '{email.subject}'")
            except Exception as exc:
                log(f"  Email generation failed: {exc}")

        results_summary.append({
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "url": job.url,
            "recruiterEmail": contact.email if contact else None,
            "status": job.status,
        })

    # ── 5. Email Sender ───────────────────────────────────────────────────────
    emails_sent = 0
    for job, email in emails_to_send:
        sent = False
        try:
            results = send_batch([email])
            sent = results[0]
        except Exception as exc:
            log(f"Email send failed for {job.company}: {exc}")

        if sent:
            db.update_status(job.job_id, "emailed")
            emails_sent += 1
            # Update the summary dict
            for r in results_summary:
                if r["company"] == job.company and r["title"] == job.title:
                    r["status"] = "emailed"
                    break

    log(f"Sent {emails_sent} cold email(s)")

    # ── 6. Auto-Apply ─────────────────────────────────────────────────────────
    applications_submitted = 0
    if not skip_apply:
        from auto_apply import run_auto_apply  # import here to keep Playwright optional

        log("Running auto-apply…")
        apply_results = asyncio.run(run_auto_apply(db, max_applications))
        for ar in apply_results:
            if ar.success:
                applications_submitted += 1
                for r in results_summary:
                    if r.get("url") and ar.job_id:
                        job_rec = db.get_job(ar.job_id)
                        if job_rec and job_rec.url == r.get("url"):
                            r["status"] = "applied"
                            break
        log(f"Submitted {applications_submitted} application(s)")

    stats = db.stats()
    log(f"Pipeline complete. DB totals: {stats}")

    return {
        "jobsFound": len(new_jobs),
        "emailsSent": emails_sent,
        "applicationsSubmitted": applications_submitted,
        "jobs": results_summary,
        "logs": logs,
    }


# ── CLI entry point ────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="AI Job Application Agent")
    parser.add_argument("--job", required=True, help="Target job title")
    parser.add_argument("--location", default="Remote", help="Preferred location")
    parser.add_argument("--cv", help="Path to CV PDF")
    parser.add_argument("--max-jobs", type=int, default=20)
    parser.add_argument("--max-apply", type=int, default=5)
    parser.add_argument("--skip-apply", action="store_true", help="Skip auto-apply step")
    parser.add_argument("--output", help="Write JSON summary to this file path")
    args = parser.parse_args()

    result = run_pipeline(
        job_title=args.job,
        location=args.location,
        cv_pdf=args.cv,
        max_jobs=args.max_jobs,
        max_applications=args.max_apply,
        skip_apply=args.skip_apply,
    )

    if args.output:
        Path(args.output).write_text(json.dumps(result, indent=2))
        print(f"Summary written to {args.output}")
    else:
        print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
