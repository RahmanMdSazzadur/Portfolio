"""
Recruiter Contact Finder
------------------------
Given a company name and domain, attempts to locate a recruiter / HR email
address using the Hunter.io Lookup and Search APIs.

Hunter.io API docs: https://hunter.io/api-documentation
"""

from __future__ import annotations

import os
import re
from dataclasses import dataclass

import requests


HUNTER_BASE = "https://api.hunter.io/v2"


@dataclass
class RecruiterContact:
    email: str
    first_name: str | None
    last_name: str | None
    position: str | None
    confidence: int  # 0-100 as returned by Hunter


def _guess_domain(company: str) -> str:
    """
    Very lightweight heuristic: strip common legal suffixes and build a
    plausible domain.  In production, prefer extracting the domain directly
    from the job listing URL.
    """
    name = re.sub(r"\b(ltd|llc|inc|corp|limited|plc|gmbh)\b", "", company, flags=re.IGNORECASE)
    slug = re.sub(r"[^a-z0-9]", "", name.lower().strip())
    return f"{slug}.com"


def find_recruiter_email(
    company: str,
    domain: str | None = None,
    department: str = "human resources",
) -> RecruiterContact | None:
    """
    Try to find a recruiter or HR contact for ``company``.

    Required env vars:
        HUNTER_API_KEY – your Hunter.io API key (free tier: 25 searches/month)

    Parameters
    ----------
    company:
        Company name as it appears in the job listing.
    domain:
        Explicitly provided company domain (e.g. ``acme.com``).
        If omitted, a domain is guessed from the company name.
    department:
        Filter contacts by department.  Use ``None`` to skip filtering.

    Returns
    -------
    The best-confidence recruiter contact, or ``None`` if nothing was found.
    """
    api_key = os.environ["HUNTER_API_KEY"]
    resolved_domain = domain or _guess_domain(company)

    # 1. Domain Search — returns all email addresses found for a domain
    params: dict[str, str] = {
        "domain": resolved_domain,
        "api_key": api_key,
        "limit": "10",
    }
    if department:
        params["department"] = department

    resp = requests.get(f"{HUNTER_BASE}/domain-search", params=params, timeout=10)
    if not resp.ok:
        return None

    data = resp.json().get("data", {})
    emails: list[dict] = data.get("emails", [])

    if not emails:
        # 2. Fallback: broaden search without department filter
        params.pop("department", None)
        resp = requests.get(f"{HUNTER_BASE}/domain-search", params=params, timeout=10)
        if not resp.ok:
            return None
        data = resp.json().get("data", {})
        emails = data.get("emails", [])

    if not emails:
        return None

    # Pick the contact with the highest confidence score
    best = max(emails, key=lambda e: e.get("confidence", 0))

    return RecruiterContact(
        email=best["value"],
        first_name=best.get("first_name"),
        last_name=best.get("last_name"),
        position=best.get("position"),
        confidence=best.get("confidence", 0),
    )


def verify_email(email: str) -> bool:
    """
    Verify that an email address is deliverable using Hunter's Email Verifier.
    Returns True if the verification status is 'valid'.

    Required env vars:
        HUNTER_API_KEY
    """
    api_key = os.environ["HUNTER_API_KEY"]
    resp = requests.get(
        f"{HUNTER_BASE}/email-verifier",
        params={"email": email, "api_key": api_key},
        timeout=15,
    )
    if not resp.ok:
        return False
    result = resp.json().get("data", {})
    return result.get("status") == "valid"
