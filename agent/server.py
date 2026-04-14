"""
FastAPI wrapper around the orchestrator so the Next.js API route can proxy
requests to the Python agent backend.

Run:
    uvicorn server:app --host 0.0.0.0 --port 8000

Set AGENT_BACKEND_URL=http://localhost:8000 in the Next.js .env.local to
connect the dashboard to this server.
"""

from __future__ import annotations

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from orchestrator import run_pipeline


app = FastAPI(title="AI Job Agent Backend", version="1.0.0")


class RunRequest(BaseModel):
    jobTitle: str
    location: str = "Remote"
    cvText: str | None = None


@app.post("/run")
def run(req: RunRequest):
    if not req.jobTitle.strip():
        raise HTTPException(status_code=400, detail="jobTitle is required")
    try:
        result = run_pipeline(
            job_title=req.jobTitle,
            location=req.location,
            cv_text=req.cvText or None,
        )
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/health")
def health():
    return {"status": "ok"}
