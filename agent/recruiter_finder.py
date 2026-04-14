"""
Recruiter Contact Finder
------------------------
Guesses likely recruiter / HR email addresses for a company using common
inbox patterns (careers@, hr@, jobs@, …) and verifies that the company's
domain actually has an MX record before returning an address.

No external API key required — uses only DNS lookups (via dnspython) and
URL parsing from the standard library.
"""

from __future__ import annotations

import re
import urllib.parse
from dataclasses import dataclass

try:
    import dns.resolver
    _DNS_AVAILABLE = True
except ImportError:
    _DNS_AVAILABLE = False


# Ordered by typical deliverability / likelihood of being monitored
_GENERIC_PATTERNS: list[str] = [
    "careers@{domain}",
    "hr@{domain}",
    "jobs@{domain}",
    "recruiting@{domain}",
    "talent@{domain}",
    "recruitment@{domain}",
    "hiring@{domain}",
    "apply@{domain}",
    "info@{domain}",
]


@dataclass
class RecruiterContact:
    email: str
    first_name: str | None
    last_name: str | None
    position: str | None
    confidence: int  # 0-100; pattern-guessed addresses get 50


def _extract_domain_from_url(url: str) -> str | None:
    """Pull the registrable domain from a job-listing URL."""
    try:
        host = urllib.parse.urlparse(url).hostname or ""
        # Strip common subdomains (www, jobs, careers, …)
        parts = host.split(".")
        if len(parts) >= 2:
            return ".".join(parts[-2:])
    except Exception:
        pass
    return None


def _guess_domain(company: str) -> str:
    """
    Very lightweight heuristic: strip common legal suffixes and build a
    plausible domain.  In production, prefer extracting the domain directly
    from the job listing URL.
    """
    name = re.sub(
        r"\b(ltd|llc|inc|corp|limited|plc|gmbh|group|global|solutions|technologies|tech)\b",
        "",
        company,
        flags=re.IGNORECASE,
    )
    slug = re.sub(r"[^a-z0-9]", "", name.lower().strip())
    return f"{slug}.com"


def _has_mx_record(domain: str) -> bool:
    """Return True if *domain* has at least one MX DNS record."""
    if not _DNS_AVAILABLE:
        # dnspython not installed — assume reachable to avoid blocking the pipeline
        return True
    try:
        answers = dns.resolver.resolve(domain, "MX", lifetime=5)
        return len(answers) > 0
    except Exception:
        return False


def find_recruiter_email(
    company: str,
    domain: str | None = None,
    job_url: str | None = None,
) -> RecruiterContact | None:
    """
    Return a best-guess recruiter / HR email for *company*.

    Resolution order:
    1. Use *domain* if explicitly supplied.
    2. Extract domain from *job_url* if provided.
    3. Guess from the company name.

    Returns ``None`` if the resolved domain has no MX record (i.e. cannot
    receive email) and we cannot make a reliable guess.
    """
    resolved_domain: str | None = None

    if domain:
        resolved_domain = domain
    elif job_url:
        resolved_domain = _extract_domain_from_url(job_url)

    if not resolved_domain:
        resolved_domain = _guess_domain(company)

    if not _has_mx_record(resolved_domain):
        return None

    # Return the first (highest-priority) generic pattern
    email = _GENERIC_PATTERNS[0].format(domain=resolved_domain)
    return RecruiterContact(
        email=email,
        first_name=None,
        last_name=None,
        position="HR / Recruiting",
        confidence=50,
    )


def verify_email(email: str) -> bool:
    """
    Lightweight verification: check that the email's domain has an MX record.
    (Full SMTP VRFY is unreliable as most servers disable it.)
    """
    try:
        domain = email.split("@")[1]
        return _has_mx_record(domain)
    except Exception:
        return False
