"""
Email Sender
------------
Sends generated cold emails via the Gmail API (OAuth 2.0) with rate-limiting
to protect domain reputation (max 25 emails per day by default).

Setup:
    1. Create a Google Cloud project and enable the Gmail API.
    2. Create OAuth 2.0 credentials (Desktop application).
    3. Download the credentials JSON and set GMAIL_CREDENTIALS_PATH.
    4. On first run, a browser window opens for consent — token is cached.

Required env vars:
    GMAIL_CREDENTIALS_PATH  – path to the OAuth credentials JSON file
    GMAIL_TOKEN_PATH        – path where the token cache will be stored
                              (default: agent/gmail_token.json)
    GMAIL_SENDER            – the "From" address (your Gmail address)
    DAILY_EMAIL_LIMIT       – max emails per day (default: 25)
"""

from __future__ import annotations

import base64
import json
import os
from datetime import date
from email.mime.text import MIMEText
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

from email_generator import GeneratedEmail


SCOPES = ["https://www.googleapis.com/auth/gmail.send"]
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
        # New day — reset
        counter = {"date": str(date.today()), "count": 0}
        _save_counter(counter)
    return counter["count"] >= limit


def _increment_counter() -> None:
    counter = _load_counter()
    if counter["date"] != str(date.today()):
        counter = {"date": str(date.today()), "count": 0}
    counter["count"] += 1
    _save_counter(counter)


def _get_gmail_service():
    credentials_path = os.environ["GMAIL_CREDENTIALS_PATH"]
    token_path = os.environ.get("GMAIL_TOKEN_PATH", "agent/gmail_token.json")

    creds: Credentials | None = None
    if Path(token_path).exists():
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(credentials_path, SCOPES)
            creds = flow.run_local_server(port=0)
        Path(token_path).write_text(creds.to_json())

    return build("gmail", "v1", credentials=creds)


def send_email(generated: GeneratedEmail) -> bool:
    """
    Send a single cold email.

    Returns True if the email was sent successfully, False if the daily
    limit was reached or sending failed.
    """
    if _daily_limit_reached():
        print(f"[Email Sender] Daily limit reached — skipping {generated.recruiter_email}")
        return False

    sender = os.environ["GMAIL_SENDER"]
    message = MIMEText(generated.body, "plain")
    message["to"] = generated.recruiter_email
    message["from"] = sender
    message["subject"] = generated.subject

    encoded = base64.urlsafe_b64encode(message.as_bytes()).decode()

    service = _get_gmail_service()
    service.users().messages().send(
        userId="me", body={"raw": encoded}
    ).execute()

    _increment_counter()
    print(f"[Email Sender] Sent → {generated.recruiter_email} | Subject: {generated.subject}")
    return True


def send_batch(emails: list[GeneratedEmail]) -> list[bool]:
    """Send a list of emails, respecting the daily limit."""
    return [send_email(email) for email in emails]
