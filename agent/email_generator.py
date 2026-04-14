"""
Email Generator Agent
----------------------
Uses Groq (llama3-70b, free tier) to write a short, hyper-personalised cold
email for each job opportunity, grounded in the candidate's CV profile and the
job description.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any

import openai


_GROQ_BASE_URL = "https://api.groq.com/openai/v1"
_GROQ_MODEL = "llama3-70b-8192"


@dataclass
class GeneratedEmail:
    subject: str
    body: str
    recruiter_email: str
    job_title: str
    company: str


_SYSTEM_PROMPT = """
You are an expert career coach and copywriter specialising in cold email
outreach for job seekers.  Write concise, professional, and highly personalised
cold emails that get responses.

Rules:
- Keep the email under 200 words.
- Open with a personalised hook referencing the specific role and company.
- Highlight 2–3 skills from the candidate's profile that directly match the
  job requirements.
- Include a clear, low-friction call-to-action (e.g. "Would you be open to a
  15-minute call this week?").
- Maintain a warm but professional tone.
- Do NOT use generic filler phrases like "I hope this email finds you well."
- Do NOT attach or reference attachments in the email body.
- End with the candidate's name.
""".strip()


def generate_cold_email(
    job_title: str,
    company: str,
    job_description: str,
    profile: dict[str, Any],
    recruiter_name: str | None = None,
    recruiter_email: str = "",
) -> GeneratedEmail:
    """
    Generate a personalised cold email for a single job opportunity.

    Parameters
    ----------
    job_title:
        The title of the role being applied for.
    company:
        The hiring company name.
    job_description:
        The full or truncated job description text.
    profile:
        Structured CV profile as returned by ``cv_parser.parse_cv``.
    recruiter_name:
        First name of the recruiter (used in the salutation).
    recruiter_email:
        The recipient email address (embedded in the result for convenience).
    """
    client = openai.OpenAI(
        api_key=os.environ["GROQ_API_KEY"],
        base_url=_GROQ_BASE_URL,
    )

    greeting = f"Hi {recruiter_name}," if recruiter_name else "Hi,"

    user_prompt = f"""
Candidate Profile:
- Name: {profile.get('name', 'the candidate')}
- Summary: {profile.get('summary', '')}
- Top Skills: {', '.join(profile.get('skills', [])[:10])}
- Recent Role: {_latest_role(profile)}

Target Job:
- Title: {job_title}
- Company: {company}
- Description (excerpt): {job_description[:1500]}

Write the email starting with: "{greeting}"
Return a JSON object with exactly two keys: "subject" and "body".
""".strip()

    response = client.chat.completions.create(
        model=_GROQ_MODEL,
        messages=[
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.7,
        response_format={"type": "json_object"},
    )

    import json
    result = json.loads(response.choices[0].message.content)

    return GeneratedEmail(
        subject=result["subject"],
        body=result["body"],
        recruiter_email=recruiter_email,
        job_title=job_title,
        company=company,
    )


def _latest_role(profile: dict[str, Any]) -> str:
    """Return a one-line summary of the most recent experience entry."""
    experience: list[dict] = profile.get("experience", [])
    if not experience:
        return "N/A"
    latest = experience[0]
    return f"{latest.get('title', '')} at {latest.get('company', '')} ({latest.get('duration', '')})"
