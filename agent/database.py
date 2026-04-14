"""
Database Layer
--------------
Lightweight SQLite-backed state store that tracks every job discovered,
its current pipeline status, and whether an email has been sent.

Schema
------
jobs table columns:
    job_id          TEXT PRIMARY KEY
    title           TEXT
    company         TEXT
    location        TEXT
    description     TEXT
    url             TEXT
    recruiter_email TEXT  (nullable)
    recruiter_name  TEXT  (nullable)
    status          TEXT  -- found | applied | emailed | error
    created_at      TEXT
    updated_at      TEXT
"""

from __future__ import annotations

import sqlite3
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path


DEFAULT_DB_PATH = "agent/jobs.db"


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class JobRecord:
    job_id: str
    title: str
    company: str
    location: str
    description: str
    url: str
    recruiter_email: str | None = None
    recruiter_name: str | None = None
    status: str = "found"
    created_at: str = field(default_factory=_now)
    updated_at: str = field(default_factory=_now)


class Database:
    def __init__(self, db_path: str = DEFAULT_DB_PATH) -> None:
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self._migrate()

    def _migrate(self) -> None:
        self.conn.execute(
            """
            CREATE TABLE IF NOT EXISTS jobs (
                job_id          TEXT PRIMARY KEY,
                title           TEXT NOT NULL,
                company         TEXT NOT NULL,
                location        TEXT NOT NULL,
                description     TEXT,
                url             TEXT,
                recruiter_email TEXT,
                recruiter_name  TEXT,
                status          TEXT NOT NULL DEFAULT 'found',
                created_at      TEXT NOT NULL,
                updated_at      TEXT NOT NULL
            )
            """
        )
        self.conn.commit()

    # ── CRUD ──────────────────────────────────────────────────────────────────

    def upsert_job(self, record: JobRecord) -> None:
        record.updated_at = _now()
        self.conn.execute(
            """
            INSERT INTO jobs
                (job_id, title, company, location, description, url,
                 recruiter_email, recruiter_name, status, created_at, updated_at)
            VALUES
                (:job_id, :title, :company, :location, :description, :url,
                 :recruiter_email, :recruiter_name, :status, :created_at, :updated_at)
            ON CONFLICT(job_id) DO UPDATE SET
                recruiter_email = excluded.recruiter_email,
                recruiter_name  = excluded.recruiter_name,
                status          = excluded.status,
                updated_at      = excluded.updated_at
            """,
            record.__dict__,
        )
        self.conn.commit()

    def get_job(self, job_id: str) -> JobRecord | None:
        row = self.conn.execute(
            "SELECT * FROM jobs WHERE job_id = ?", (job_id,)
        ).fetchone()
        return _row_to_record(row) if row else None

    def update_status(self, job_id: str, status: str) -> None:
        self.conn.execute(
            "UPDATE jobs SET status = ?, updated_at = ? WHERE job_id = ?",
            (status, _now(), job_id),
        )
        self.conn.commit()

    def update_recruiter(
        self, job_id: str, email: str, name: str | None = None
    ) -> None:
        self.conn.execute(
            "UPDATE jobs SET recruiter_email = ?, recruiter_name = ?, updated_at = ? WHERE job_id = ?",
            (email, name, _now(), job_id),
        )
        self.conn.commit()

    def get_jobs_by_status(self, status: str) -> list[JobRecord]:
        rows = self.conn.execute(
            "SELECT * FROM jobs WHERE status = ? ORDER BY created_at DESC", (status,)
        ).fetchall()
        return [_row_to_record(r) for r in rows]

    def get_all_jobs(self) -> list[JobRecord]:
        rows = self.conn.execute(
            "SELECT * FROM jobs ORDER BY created_at DESC"
        ).fetchall()
        return [_row_to_record(r) for r in rows]

    def stats(self) -> dict[str, int]:
        row = self.conn.execute(
            """
            SELECT
                COUNT(*) AS total,
                SUM(status = 'found')   AS found,
                SUM(status = 'emailed') AS emailed,
                SUM(status = 'applied') AS applied,
                SUM(status = 'error')   AS error
            FROM jobs
            """
        ).fetchone()
        return dict(row)

    def close(self) -> None:
        self.conn.close()


def _row_to_record(row: sqlite3.Row) -> JobRecord:
    return JobRecord(**dict(row))
