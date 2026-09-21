"""
Prometheus — Citizen Connect (SIH26129)
Driving Licence Module API Routes

GET  /api/citizen/{unified_id}     — Fetch citizen profile (Fill Once)
POST /api/dl/apply                 — Submit DL application
GET  /api/dl/track/{application_id} — Track DL application status
"""
import random
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException
from models.schemas import (
    CitizenProfile,
    DLApplicationRequest,
    DLApplicationResponse,
    DLTrackingStep,
    DLTrackingResponse,
)
from services.supabase_client import supabase

router = APIRouter(prefix="/api", tags=["driving-licence"])

# ============================================================
# In-memory store for demo submissions
# ============================================================
DL_APPLICATIONS = {}

# ============================================================
# Mock citizen data — used as fallback when Supabase is
# unreachable or the citizen doesn't exist in the DB.
# ============================================================
MOCK_CITIZENS = {
    "CIT-20260001": {
        "unified_id": "CIT-20260001",
        "full_name": "Rajesh Kumar Sharma",
        "date_of_birth": "1990-05-15",
        "gender": "male",
        "aadhaar_hash": "a1b2c3d4e5f6...hashed",
        "phone": "+919876543210",
        "email": "rajesh.sharma@email.com",
        "address": {
            "line1": "42, MG Road",
            "line2": "Near City Mall",
            "city": "Jaipur",
            "state": "Rajasthan",
            "pincode": "302001",
        },
    },
    "CIT-20260002": {
        "unified_id": "CIT-20260002",
        "full_name": "Priya Patel",
        "date_of_birth": "1995-08-22",
        "gender": "female",
        "aadhaar_hash": None,
        "phone": "+919123456789",
        "email": "priya.patel@email.com",
        "address": {
            "line1": "15, Lal Darwaza",
            "line2": "",
            "city": "Ahmedabad",
            "state": "Gujarat",
            "pincode": "380001",
        },
    },
}


# ============================================================
# 1. Fetch Citizen Profile
# ============================================================

@router.get("/citizen/{unified_id}")
async def get_citizen_profile(unified_id: str):
    """
    Fetch citizen profile by unified ID.
    Tries Supabase first, falls back to mock data for demo.
    """
    # Try Supabase
    try:
        profile = await supabase.get_citizen_profile(unified_id)
        if profile:
            return {
                "source": "prometheus_database",
                "verified": True,
                "profile": profile,
            }
    except Exception:
        # Supabase unavailable — fall through to mock
        pass

    # Fallback to mock data
    if unified_id in MOCK_CITIZENS:
        return {
            "source": "prometheus_mock",
            "verified": True,
            "profile": MOCK_CITIZENS[unified_id],
        }

    raise HTTPException(
        status_code=404,
        detail=f"Citizen profile not found for ID: {unified_id}",
    )


# ============================================================
# 2. Submit DL Application
# ============================================================

@router.post("/dl/apply", response_model=DLApplicationResponse)
async def submit_dl_application(application: DLApplicationRequest):
    """
    Accept a DL application, run it through the simulated
    Data Translation Engine, and return a dummy application ID.

    This simulates what would happen when data is sent to
    the actual Sarathi/Parivahan RTO system.
    """
    # ============================================================
    # DATA TRANSLATION ENGINE (Simulated)
    # ============================================================
    # In production, this would:
    # 1. Map Prometheus fields → Sarathi/Parivahan field names
    # 2. Format dates: YYYY-MM-DD → DD/MM/YYYY
    # 3. Validate RTO codes against the Parivahan database
    # 4. Enrich with additional metadata
    #
    # For demo, we generate a dummy application ID.
    # ============================================================

    app_number = random.randint(10000, 99999)
    application_id = f"DL-DEMO-{app_number}"

    now = datetime.utcnow()

    # Store in memory for tracking
    DL_APPLICATIONS[application_id] = {
        "application_id": application_id,
        "applicant_name": application.full_name,
        "application_type": application.application_type,
        "vehicle_class": application.vehicle_class,
        "state_rto": application.state_rto,
        "submitted_at": now.isoformat() + "Z",
        "steps": [
            {"step": 1, "label": "Application Submitted", "status": "completed", "timestamp": now.isoformat() + "Z"},
            {"step": 2, "label": "Documents Verified", "status": "completed", "timestamp": (now + timedelta(hours=2)).isoformat() + "Z"},
            {"step": 3, "label": "RTO Verification", "status": "in_progress", "timestamp": None},
            {"step": 4, "label": "Driving Test", "status": "pending", "timestamp": None},
            {"step": 5, "label": "Licence Issued", "status": "pending", "timestamp": None},
        ],
    }

    return DLApplicationResponse(
        success=True,
        message="Your Driving Licence application has been submitted successfully to the RTO.",
        application_id=application_id,
        estimated_processing_days=15,
    )


# ============================================================
# 3. Track DL Application
# ============================================================

@router.get("/dl/track/{application_id}", response_model=DLTrackingResponse)
async def track_dl_application(application_id: str):
    """
    Return tracking status for a DL application.
    Uses in-memory store for recent submissions, or returns
    demo data for the hardcoded DL-DEMO-10245.
    """
    # Check in-memory store first
    if application_id in DL_APPLICATIONS:
        data = DL_APPLICATIONS[application_id]
        return DLTrackingResponse(
            application_id=data["application_id"],
            applicant_name=data["applicant_name"],
            application_type=data["application_type"],
            submitted_at=data["submitted_at"],
            current_status="RTO Verification",
            steps=[DLTrackingStep(**s) for s in data["steps"]],
        )

    # Hardcoded demo data for DL-DEMO-10245
    if application_id.upper() == "DL-DEMO-10245":
        return DLTrackingResponse(
            application_id="DL-DEMO-10245",
            applicant_name="Rajesh Kumar Sharma",
            application_type="permanent",
            submitted_at="2026-09-10T10:30:00Z",
            current_status="RTO Verification",
            steps=[
                DLTrackingStep(step=1, label="Application Submitted", status="completed", timestamp="2026-09-10T10:30:00Z"),
                DLTrackingStep(step=2, label="Documents Verified", status="completed", timestamp="2026-09-10T14:15:00Z"),
                DLTrackingStep(step=3, label="RTO Verification", status="in_progress", timestamp=None),
                DLTrackingStep(step=4, label="Driving Test", status="pending", timestamp=None),
                DLTrackingStep(step=5, label="Licence Issued", status="pending", timestamp=None),
            ],
        )

    raise HTTPException(
        status_code=404,
        detail=f"Application not found: {application_id}",
    )
