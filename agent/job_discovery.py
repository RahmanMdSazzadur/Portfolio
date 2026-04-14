"""
Job Discovery Agent
--------------------
Searches the RemoteOK public API (no auth required, completely free) for remote
job listings matching the user's target role, then stores the results in the
local SQLite database.

RemoteOK API docs: https://remoteok.com/api
"""

from __future__ import annotations

import hashlib
import time
from dataclasses import dataclass, field
from typing import Any

import requests

from database import Database, JobRecord


REMOTEOK_API = "https://remoteok.com/api"

# RemoteOK requires a User-Agent header or it returns a 403
_HEADERS = {"User-Agent": "JobAgent/1.0 (portfolio project)"}


@dataclass
class RemoteOKJob:
    id: str
    title: str
    company: str
    location: str
    description: str
    url: str
    tags: list[str] = field(default_factory=list)
    raw: dict[str, Any] = field(default_factory=dict)


def search_jobs(
    job_title: str,
    location: str = "Remote",
    max_results: int = 20,
) -> list[RemoteOKJob]:
    """
    Query the RemoteOK API and return jobs matching ``job_title``.

    No API key required — the endpoint is publicly accessible.
    """
    # Build a tag-based search URL using keywords from the job title
    tags = "+".join(job_title.lower().split())
    url = f"{REMOTEOK_API}?tags={tags}"

    resp = requests.get(url, headers=_HEADERS, timeout=20)
    resp.raise_for_status()

    raw_list: list[dict[str, Any]] = resp.json()

    # First element is a legal notice dict; real jobs start at index 1
    jobs: list[RemoteOKJob] = []
    keywords = {w.lower() for w in job_title.split()}

    for item in raw_list[1:]:
        if not isinstance(item, dict):
            continue

        title: str = item.get("position", "")
        company: str = item.get("company", "Unknown")
        description: str = item.get("description", "")

        # Loose relevance filter: title or description contains at least one keyword
        combined = (title + " " + description).lower()
        if not any(kw in combined for kw in keywords):
            continue

        job_url: str = item.get("url", "") or f"https://remoteok.com/remote-jobs/{item.get('id', '')}"
        job_id: str = str(item.get("id", "")) or hashlib.md5(job_url.encode()).hexdigest()[:12]

        jobs.append(
            RemoteOKJob(
                id=job_id,
                title=title or job_title,
                company=company,
                location=item.get("location", "Remote") or "Remote",
                description=description,
                url=job_url,
                tags=item.get("tags", []),
                raw=item,
            )
        )

        if len(jobs) >= max_results:
            break

    # If the tag search returned nothing, fall back to the full feed with
    # client-side keyword filtering (RemoteOK serves at most ~300 recent jobs)
    if not jobs:
        time.sleep(1)
        resp = requests.get(REMOTEOK_API, headers=_HEADERS, timeout=20)
        resp.raise_for_status()
        raw_list = resp.json()

        for item in raw_list[1:]:
            if not isinstance(item, dict):
                continue
            title = item.get("position", "")
            combined = (title + " " + item.get("description", "")).lower()
            if not any(kw in combined for kw in keywords):
                continue

            job_url = item.get("url", "") or f"https://remoteok.com/remote-jobs/{item.get('id', '')}"
            job_id = str(item.get("id", "")) or hashlib.md5(job_url.encode()).hexdigest()[:12]

            jobs.append(
                RemoteOKJob(
                    id=job_id,
                    title=title or job_title,
                    company=item.get("company", "Unknown"),
                    location=item.get("location", "Remote") or "Remote",
                    description=item.get("description", ""),
                    url=job_url,
                    tags=item.get("tags", []),
                    raw=item,
                )
            )
            if len(jobs) >= max_results:
                break

    return jobs


def discover_and_store(
    job_title: str,
    location: str = "Remote",
    max_results: int = 20,
    db: Database | None = None,
) -> list[JobRecord]:
    """
    Search for jobs and persist new results to the database.
    Returns the list of newly stored records.
    """
    if db is None:
        db = Database()

    remote_jobs = search_jobs(job_title, location, max_results)
    stored: list[JobRecord] = []

    for job in remote_jobs:
        existing = db.get_job(job.id)
        if existing:
            continue  # already in DB, skip

        record = JobRecord(
            job_id=job.id,
            title=job.title,
            company=job.company,
            location=job.location,
            description=job.description,
            url=job.url,
            status="found",
        )
        db.upsert_job(record)
        stored.append(record)

    return stored
