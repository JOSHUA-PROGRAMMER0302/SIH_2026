"""
Prometheus — Citizen Connect (SIH26129)
FastAPI Application Entry Point

A unified government service platform backend that connects
to Supabase for data persistence.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.feedback import router as feedback_router
from routes.dl_routes import router as dl_router
from services.supabase_client import supabase


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown events."""
    # Startup — nothing special needed, Supabase client is ready
    yield
    # Shutdown — close the HTTP client cleanly
    await supabase.close()


app = FastAPI(
    title="Prometheus — Citizen Connect API",
    description=(
        "Backend API for the Citizen Connect platform (SIH26129). "
        "Provides endpoints for feedback collection, citizen profile management, "
        "and integration with government services via the 'Fill Once, Use Everywhere' architecture."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# ============================================================
# CORS Middleware
# Allow the React frontend to communicate with this API.
# Adjust origins for production deployment.
# ============================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:3000",   # Alternative dev port
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# Include Routers
# ============================================================
app.include_router(feedback_router)
app.include_router(dl_router)


# ============================================================
# Health Check
# ============================================================
@app.get("/", tags=["health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "Prometheus — Citizen Connect API",
        "version": "1.0.0",
    }


@app.get("/api/health", tags=["health"])
async def api_health():
    return {"status": "ok", "database": "supabase", "message": "All systems operational."}
