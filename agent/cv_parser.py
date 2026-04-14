"""
CV Parser
---------
Extracts structured profile data (skills, experience, projects) from a CV PDF
or plain text using PyMuPDF + Groq (llama3-70b — free tier).
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

import openai


_GROQ_BASE_URL = "https://api.groq.com/openai/v1"
_GROQ_MODEL = "llama3-70b-8192"

try:
    import fitz  # PyMuPDF
    _PYMUPDF_AVAILABLE = True
except ImportError:
    _PYMUPDF_AVAILABLE = False


def extract_text_from_pdf(pdf_path: str) -> str:
    """Return the raw text content of a PDF file."""
    if not _PYMUPDF_AVAILABLE:
        raise RuntimeError(
            "PyMuPDF is not installed. Run: pip install pymupdf"
        )
    doc = fitz.open(pdf_path)
    return "\n".join(page.get_text() for page in doc)


def parse_cv(cv_input: str, is_pdf_path: bool = False) -> dict[str, Any]:
    """
    Parse a CV and return a structured profile dict.

    Parameters
    ----------
    cv_input:
        Either the raw text of the CV or the path to a PDF file.
    is_pdf_path:
        Set to True when ``cv_input`` is a file path to a PDF.

    Returns
    -------
    dict with keys: name, email, phone, skills, experience, projects, summary
    """
    raw_text = extract_text_from_pdf(cv_input) if is_pdf_path else cv_input

    client = openai.OpenAI(
        api_key=os.environ["GROQ_API_KEY"],
        base_url=_GROQ_BASE_URL,
    )

    # ~12 000 chars ≈ 3 000 tokens — well within GPT-4o's 128 k context window.
    # Adjust if the CV is very long and you need more detail.
    MAX_CV_TEXT_LENGTH = 12_000

    prompt = """
You are a CV parsing assistant. Extract structured information from the CV text below.
Return a JSON object with exactly these keys:
- name (string)
- email (string)
- phone (string)
- summary (2–3 sentence professional summary)
- skills (list of strings)
- experience (list of objects: {title, company, duration, highlights: [string]})
- projects (list of objects: {name, description, technologies: [string]})

CV Text:
---
{cv_text}
---
Return ONLY valid JSON. No markdown fences.
""".format(cv_text=raw_text[:MAX_CV_TEXT_LENGTH])

    response = client.chat.completions.create(
        model=_GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
        response_format={"type": "json_object"},
    )

    profile: dict[str, Any] = json.loads(response.choices[0].message.content)
    return profile


def load_or_parse_profile(
    cv_text: str | None = None,
    cv_pdf: str | None = None,
    cache_path: str | None = None,
) -> dict[str, Any]:
    """
    Return a cached profile if it exists, otherwise parse and cache it.
    Pass ``cv_text`` or ``cv_pdf`` to force a fresh parse.
    """
    if cache_path is None:
        cache_path = str(Path(__file__).parent / "profile.json")
    cache = Path(cache_path)

    if cv_text:
        profile = parse_cv(cv_text)
        cache.write_text(json.dumps(profile, indent=2))
        return profile

    if cv_pdf:
        profile = parse_cv(cv_pdf, is_pdf_path=True)
        cache.write_text(json.dumps(profile, indent=2))
        return profile

    if cache.exists():
        return json.loads(cache.read_text())

    raise ValueError(
        "No CV provided and no cached profile found. "
        "Pass cv_text= or cv_pdf= on first run."
    )
