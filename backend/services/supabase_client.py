"""
Prometheus -- Citizen Connect (SIH26129)
Supabase REST Client Wrapper

Uses httpx to communicate with Supabase PostgreSQL via REST API.
Configure SUPABASE_URL and SUPABASE_ANON_KEY in .env file.
"""
import os
import httpx
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "your-anon-key")


def _get_headers():
    """Common headers for Supabase REST API."""
    return {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }


class SupabaseClient:
    """Async client for Supabase REST API operations with lazy init."""

    def __init__(self):
        self.base_url = f"{SUPABASE_URL}/rest/v1"
        self._client: Optional[httpx.AsyncClient] = None

    def _get_client(self) -> httpx.AsyncClient:
        """Lazily create the async client to avoid event loop issues."""
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                headers=_get_headers(),
                timeout=30.0,
            )
        return self._client

    async def insert_feedback(self, data: dict) -> dict:
        """
        Insert a feedback record into the service_feedback table.

        Args:
            data: Dict with keys matching the service_feedback columns:
                  - service_slug, helpfulness, assessment_text, captcha_valid

        Returns:
            The inserted row as a dict, or raises an exception.
        """
        client = self._get_client()
        url = f"{self.base_url}/service_feedback"
        response = await client.post(url, json=data)

        if response.status_code not in (200, 201):
            raise Exception(
                f"Supabase insert failed [{response.status_code}]: {response.text}"
            )

        result = response.json()
        return result[0] if isinstance(result, list) and len(result) > 0 else result

    async def get_citizen_profile(self, unified_id: str) -> Optional[dict]:
        """
        Fetch a citizen profile by unified_id.
        Supports the "Fill Once, Use Everywhere" architecture.
        """
        client = self._get_client()
        url = f"{self.base_url}/citizen_profiles"
        params = {
            "unified_id": f"eq.{unified_id}",
            "select": "*",
        }
        response = await client.get(url, params=params)

        if response.status_code != 200:
            raise Exception(
                f"Supabase query failed [{response.status_code}]: {response.text}"
            )

        result = response.json()
        return result[0] if isinstance(result, list) and len(result) > 0 else None

    async def close(self):
        """Close the HTTP client connection."""
        if self._client and not self._client.is_closed:
            await self._client.aclose()


# Singleton instance
supabase = SupabaseClient()
