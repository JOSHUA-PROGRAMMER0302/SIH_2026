"""
Prometheus — Citizen Connect (SIH26129)
Feedback API Routes

POST /api/feedback — Accept and store user feedback from the
"Did you find this information helpful?" form.
"""
import random
import string
from fastapi import APIRouter, HTTPException, Request
from models.schemas import FeedbackRequest, FeedbackResponse
from services.supabase_client import supabase

router = APIRouter(prefix="/api", tags=["feedback"])

# ============================================================
# Mock Captcha Store
# In production, replace with reCAPTCHA / hCaptcha verification
# ============================================================
# Simple in-memory captcha for hackathon demo
ACTIVE_CAPTCHAS = {}


def generate_captcha() -> dict:
    """Generate a simple text captcha for demo purposes."""
    code = "".join(random.choices(string.ascii_lowercase + string.digits, k=6))
    captcha_id = "".join(random.choices(string.ascii_letters, k=12))
    ACTIVE_CAPTCHAS[captcha_id] = code
    return {"captcha_id": captcha_id, "captcha_text": code}


def verify_captcha(captcha_id: str, user_code: str) -> bool:
    """Verify a captcha code. Returns True if valid."""
    if captcha_id in ACTIVE_CAPTCHAS:
        valid = ACTIVE_CAPTCHAS[captcha_id].lower() == user_code.lower()
        if valid:
            del ACTIVE_CAPTCHAS[captcha_id]  # One-time use
        return valid
    # For demo: accept "fod245" as a hardcoded valid captcha
    return user_code.lower() == "fod245"


@router.get("/captcha")
async def get_captcha():
    """Generate and return a new captcha challenge."""
    captcha = generate_captcha()
    return captcha


@router.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(feedback: FeedbackRequest, request: Request):
    """
    Accept feedback form submission and insert into Supabase.

    Flow:
    1. Validate the captcha code
    2. Prepare the data payload
    3. Insert into service_feedback table via Supabase REST API
    4. Return success/error response
    """
    # Step 1: Verify captcha
    # In production, verify against a secure captcha service
    captcha_id = request.headers.get("X-Captcha-Id", "")
    is_valid_captcha = verify_captcha(captcha_id, feedback.captcha_code)

    if not is_valid_captcha:
        raise HTTPException(
            status_code=400,
            detail="Invalid captcha code. Please try again."
        )

    # Step 2: Prepare data for Supabase insertion
    feedback_data = {
        "service_slug": feedback.service_slug,
        "helpfulness": feedback.helpfulness,
        "assessment_text": feedback.assessment_text,
        "captcha_valid": True,
        "ip_address": request.client.host if request.client else None,
        "user_agent": request.headers.get("user-agent", ""),
    }

    # Step 3: Insert into Supabase
    try:
        result = await supabase.insert_feedback(feedback_data)
        feedback_id = result.get("id", "unknown")
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save feedback: {str(e)}"
        )

    # Step 4: Return success response
    return FeedbackResponse(
        success=True,
        message="Thank you for your feedback! Your response has been recorded.",
        feedback_id=str(feedback_id),
    )
