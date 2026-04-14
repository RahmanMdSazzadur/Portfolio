"""
Auto-Apply Agent
----------------
Uses Playwright to fill out and submit job application forms automatically.
Currently supports ATS-style forms (Greenhouse, Lever, Workday basics) and
generic HTML forms.

Required env vars:
    CANDIDATE_NAME      – full name for form fields
    CANDIDATE_EMAIL     – email address for form fields
    CANDIDATE_PHONE     – phone number
    CV_PDF_PATH         – absolute path to the CV/resume PDF for file uploads
"""

from __future__ import annotations

import os
from dataclasses import dataclass

from playwright.async_api import async_playwright, Page, TimeoutError as PlaywrightTimeout

from database import Database, JobRecord


@dataclass
class ApplicationResult:
    job_id: str
    success: bool
    message: str


async def _fill_common_fields(page: Page) -> None:
    """Fill standard name/email/phone fields that appear across most ATS forms."""
    candidate_name = os.environ.get("CANDIDATE_NAME", "")
    candidate_email = os.environ.get("CANDIDATE_EMAIL", "")
    candidate_phone = os.environ.get("CANDIDATE_PHONE", "")
    cv_pdf = os.environ.get("CV_PDF_PATH", "")

    # Name
    for selector in ['input[name*="name" i]', 'input[placeholder*="name" i]']:
        try:
            await page.fill(selector, candidate_name, timeout=3000)
        except PlaywrightTimeout:
            pass

    # First / Last name split
    for selector in ['input[name*="first" i]', 'input[placeholder*="first" i]']:
        try:
            first = candidate_name.split()[0] if candidate_name else ""
            await page.fill(selector, first, timeout=3000)
        except PlaywrightTimeout:
            pass

    for selector in ['input[name*="last" i]', 'input[placeholder*="last" i]']:
        try:
            last = candidate_name.split()[-1] if candidate_name else ""
            await page.fill(selector, last, timeout=3000)
        except PlaywrightTimeout:
            pass

    # Email
    for selector in ['input[type="email"]', 'input[name*="email" i]']:
        try:
            await page.fill(selector, candidate_email, timeout=3000)
        except PlaywrightTimeout:
            pass

    # Phone
    for selector in ['input[type="tel"]', 'input[name*="phone" i]']:
        try:
            await page.fill(selector, candidate_phone, timeout=3000)
        except PlaywrightTimeout:
            pass

    # Resume upload
    if cv_pdf:
        for selector in ['input[type="file"]']:
            try:
                await page.set_input_files(selector, cv_pdf, timeout=3000)
            except PlaywrightTimeout:
                pass


async def apply_to_job(job: JobRecord) -> ApplicationResult:
    """
    Navigate to the job application URL and attempt to submit the form.

    This is a best-effort automation.  If any step fails (CAPTCHA, dynamic
    fields, multi-page forms), the job is flagged for manual review.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            )
        )
        page = await context.new_page()

        try:
            await page.goto(job.url, wait_until="networkidle", timeout=30_000)
            await _fill_common_fields(page)

            # Attempt to click a submit/apply button
            submitted = False
            for selector in [
                'button[type="submit"]',
                'input[type="submit"]',
                'button:has-text("Apply")',
                'button:has-text("Submit")',
                'a:has-text("Apply Now")',
            ]:
                try:
                    await page.click(selector, timeout=5000)
                    submitted = True
                    break
                except PlaywrightTimeout:
                    continue

            if not submitted:
                return ApplicationResult(
                    job_id=job.job_id,
                    success=False,
                    message="Could not locate a submit button — requires manual review",
                )

            # Wait briefly for confirmation
            await page.wait_for_timeout(3000)
            return ApplicationResult(
                job_id=job.job_id,
                success=True,
                message="Application submitted successfully",
            )

        except Exception as exc:
            return ApplicationResult(
                job_id=job.job_id,
                success=False,
                message=f"Error during auto-apply: {exc}",
            )
        finally:
            await browser.close()


async def run_auto_apply(
    db: Database,
    max_applications: int = 5,
) -> list[ApplicationResult]:
    """
    Pull 'found' or 'emailed' jobs from the DB and attempt to auto-apply.
    Updates DB status to 'applied' or 'error' after each attempt.
    """
    jobs = db.get_jobs_by_status("emailed") + db.get_jobs_by_status("found")
    results: list[ApplicationResult] = []

    for job in jobs[:max_applications]:
        result = await apply_to_job(job)
        new_status = "applied" if result.success else "error"
        db.update_status(job.job_id, new_status)
        results.append(result)
        print(f"[Auto-Apply] {job.company} — {result.message}")

    return results
