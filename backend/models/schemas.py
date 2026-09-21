"""
Prometheus — Citizen Connect (SIH26129)
Pydantic Models for Request/Response Validation
"""
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
import uuid


class FeedbackRequest(BaseModel):
    """Incoming feedback form submission from the frontend."""
    service_slug: str = Field(
        default="driving-licence",
        description="Identifier for the service page",
        max_length=100
    )
    helpfulness: Literal["yes", "moderately", "no"] = Field(
        description="User's helpfulness rating"
    )
    assessment_text: Optional[str] = Field(
        default=None,
        description="Link/Information Usability Assessment text",
        max_length=500
    )
    captcha_code: str = Field(
        description="User-entered captcha code for verification",
        min_length=1,
        max_length=20
    )


class FeedbackResponse(BaseModel):
    """Response returned after feedback submission."""
    success: bool
    message: str
    feedback_id: Optional[str] = None


class CitizenProfile(BaseModel):
    """
    Citizen profile model supporting the "Fill Once, Use Everywhere" architecture.
    A single citizen record is used across all government service applications.
    """
    unified_id: str = Field(description="Unique citizen identifier, e.g., CIT-20260001")
    full_name: str = Field(max_length=200)
    date_of_birth: str = Field(description="ISO format date string YYYY-MM-DD")
    gender: Literal["male", "female", "other", "prefer_not_to_say"]
    aadhaar_hash: Optional[str] = Field(default=None, max_length=64)
    phone: Optional[str] = Field(default=None, max_length=15)
    email: Optional[str] = Field(default=None, max_length=254)
    address: Optional[dict] = Field(
        default=None,
        description="Structured address: {line1, line2, city, state, pincode}"
    )


# ============================================================
# Driving Licence Module Schemas
# ============================================================

class DLApplicationRequest(BaseModel):
    """Incoming DL application form submission."""
    full_name: str = Field(max_length=200, description="Applicant's full name")
    date_of_birth: str = Field(description="Date of birth in YYYY-MM-DD format")
    address: str = Field(max_length=500, description="Full residential address")
    mobile_number: str = Field(max_length=15, description="Mobile number with country code")
    vehicle_class: Literal[
        "MC 50CC", "MC EX50CC", "LMV", "LMV-NT",
        "TRANS", "HMV", "HGMV", "HPMV"
    ] = Field(description="Vehicle class for the licence")
    state_rto: str = Field(max_length=100, description="State and RTO code, e.g. 'RJ-14 Jaipur'")
    application_type: Literal["learners", "permanent"] = Field(
        description="Type of licence application"
    )
    citizen_id: Optional[str] = Field(
        default=None,
        description="Prometheus unified citizen ID if fetched"
    )


class DLApplicationResponse(BaseModel):
    """Response returned after DL application submission."""
    success: bool
    message: str
    application_id: str = Field(description="Generated application ID, e.g. DL-DEMO-10245")
    estimated_processing_days: int = Field(default=15)


class DLTrackingStep(BaseModel):
    """A single step in the DL application tracking timeline."""
    step: int
    label: str
    status: Literal["completed", "in_progress", "pending"]
    timestamp: Optional[str] = None


class DLTrackingResponse(BaseModel):
    """Response for DL application tracking lookup."""
    application_id: str
    applicant_name: str
    application_type: str
    submitted_at: str
    current_status: str
    steps: list[DLTrackingStep]
