"""
Email Sender
------------
Sends generated cold emails via SMTP (no OAuth required).  Works with any
SMTP-capable provider:

  • Gmail  — enable 2FA → App Passwords → generate a 16-character password
  • Outlook — use your normal password (or an app password if 2FA is on)
  • Mailgun / SendGrid SMTP relay — also work out of the box

Required env vars:
    SMTP_USER      – the "From" address and SMTP username
    SMTP_PASSWORD  – the SMTP password (or Gmail app password)
    SMTP_HOST      – SMTP server hostname   (default: smtp.gmail.com)
    SMTP_PORT      – SMTP port              (default: 587, STARTTLS)
    DAILY_EMAIL_LIMIT – max emails per day  (default: 25)
"""

from __future__ import annotations

import json
import os
import smtplib
from datetime import date
from email.mime.text import MIMEText
from pathlib import Path

from email_generator import GeneratedEmail


_COUNTER_FILE = Path(__file__).parent / "daily_send_counter.json"


def _load_counter() -> dict:
    if _COUNTER_FILE.exists():
        return json.loads(_COUNTER_FILE.read_text())
    return {"date": str(date.today()), "count": 0}


def _save_counter(counter: dict) -> None:
    _COUNTER_FILE.write_text(json.dumps(counter))


def _daily_limit_reached() -> bool:
    limit = int(os.environ.get("DAILY_EMAIL_LIMIT", 25))
    counter = _load_counter()
    if counter["date"] != str(date.today()):
        counter = {"date": str(date.today()), "count": 0}
        _save_counter(counter)
    return counter["count"] >= limit


def _increment_counter() -> None:
    counter = _load_counter()
    if counter["date"] != str(date.today()):
        counter = {"date": str(date.today()), "count": 0}
    counter["count"] += 1
    _save_counter(counter)


def send_email(generated: GeneratedEmail) -> bool:
    """
    Send a single cold email via SMTP.

    Returns True if the email was sent successfully, False if the daily limit
    was reached or sending failed.
    """
    if _daily_limit_reached():
        print(f"[Email Sender] Daily limit reached — skipping {generated.recruiter_email}")
        return False

    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ["SMTP_USER"]
    smtp_pass = os.environ["SMTP_PASSWORD"]

    msg = MIMEText(generated.body, "plain")
    msg["Subject"] = generated.subject
    msg["From"] = smtp_user
    msg["To"] = generated.recruiter_email

    with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
        server.ehlo()
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, [generated.recruiter_email], msg.as_string())

    _increment_counter()
    print(f"[Email Sender] Sent → {generated.recruiter_email} | Subject: {generated.subject}")
    return True


def send_batch(emails: list[GeneratedEmail]) -> list[bool]:
    """Send a list of emails, respecting the daily limit."""
    return [send_email(email) for email in emails]
