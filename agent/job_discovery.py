"""
Job Discovery Agent
--------------------
Searches the Adzuna API for job listings matching the user's target role and
location, then stores the results in the local SQLite database.

Adzuna API docs: https://developer.adzuna.com/activedocs
"""

from __future__ import annotations

import os
import time
from dataclasses import dataclass, field
from typing import Any

import requests

from database import Database, JobRecord


ADZUNA_BASE = "https://api.adzuna.com/v1/api/jobs"


@dataclass
class AdzunaJob:
    id: str
    title: str
    company: str
    location: str
    description: str
    url: str
    salary_min: float | None = None
    salary_max: float | None = None
    raw: dict[str, Any] = field(default_factory=dict)


def _country_code(location: str) -> str:
    """Guess the Adzuna country code from a location string."""
    location_lower = location.lower()
    if any(k in location_lower for k in ("uk", "london", "manchester", "united kingdom")):
        return "gb"
    if any(k in location_lower for k in ("canada", "toronto", "vancouver")):
        return "ca"
    if any(k in location_lower for k in ("australia", "sydney", "melbourne")):
        return "au"
    return "us"  # default


def search_jobs(
    job_title: str,
    location: str = "Remote",
    max_results: int = 20,
    country: str | None = None,
) -> list[AdzunaJob]:
    """
    Query the Adzuna API and return a list of matching job listings.

    Required env vars:
        ADZUNA_APP_ID   – your Adzuna application ID
        ADZUNA_API_KEY  – your Adzuna API key
    """
    app_id = os.environ["ADZUNA_APP_ID"]
    api_key = os.environ["ADZUNA_API_KEY"]
    cc = country or _country_code(location)

    jobs: list[AdzunaJob] = []
    page = 1
    results_per_page = min(max_results, 50)

    while len(jobs) < max_results:
        url = f"{ADZUNA_BASE}/{cc}/search/{page}"
        params = {
            "app_id": app_id,
            "app_key": api_key,
            "what": job_title,
            "where": location,
            "results_per_page": results_per_page,
            "content-type": "application/json",
        }

        resp = requests.get(url, params=params, timeout=15)
        resp.raise_for_status()
        data = resp.json()

        raw_jobs: list[dict[str, Any]] = data.get("results", [])
        if not raw_jobs:
            break

        for item in raw_jobs:
            company_name = (
                item.get("company", {}).get("display_name", "Unknown")
                if isinstance(item.get("company"), dict)
                else str(item.get("company", "Unknown"))
            )
            loc_name = (
                item.get("location", {}).get("display_name", location)
                if isinstance(item.get("location"), dict)
                else str(item.get("location", location))
            )
            jobs.append(
                AdzunaJob(
                    id=str(item.get("id", "")),
                    title=item.get("title", job_title),
                    company=company_name,
                    location=loc_name,
                    description=item.get("description", ""),
                    url=item.get("redirect_url", ""),
                    salary_min=item.get("salary_min"),
                    salary_max=item.get("salary_max"),
                    raw=item,
                )
            )
            if len(jobs) >= max_results:
                break

        if len(raw_jobs) < results_per_page:
            break  # no more pages
        page += 1
        time.sleep(0.5)  # be polite

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

    adzuna_jobs = search_jobs(job_title, location, max_results)
    stored: list[JobRecord] = []

    for job in adzuna_jobs:
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
