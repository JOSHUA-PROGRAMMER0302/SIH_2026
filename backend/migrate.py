"""
Prometheus -- Database Migration Script (v2)
Tests multiple Supabase endpoints to find working auth method,
then verifies table existence.
"""
import httpx
import os
import sys
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    print("ERROR: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env")
    sys.exit(1)

print(f"Supabase URL: {SUPABASE_URL}")
print(f"API Key: {SUPABASE_ANON_KEY[:25]}...")
print()


def test_endpoints():
    """Try multiple Supabase endpoints to check connectivity."""
    print("[1] Testing Supabase endpoints...")

    endpoints = [
        # Public auth settings (no auth required usually)
        {
            "name": "Auth Settings (public)",
            "url": f"{SUPABASE_URL}/auth/v1/settings",
            "headers": {"apikey": SUPABASE_ANON_KEY},
        },
        # Health check
        {
            "name": "Health check",
            "url": f"{SUPABASE_URL}/auth/v1/health",
            "headers": {"apikey": SUPABASE_ANON_KEY},
        },
        # REST API root with apikey only
        {
            "name": "REST API (apikey header)",
            "url": f"{SUPABASE_URL}/rest/v1/",
            "headers": {"apikey": SUPABASE_ANON_KEY},
        },
        # REST API root with Bearer auth
        {
            "name": "REST API (Bearer auth)",
            "url": f"{SUPABASE_URL}/rest/v1/",
            "headers": {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            },
        },
    ]

    any_success = False
    for ep in endpoints:
        try:
            r = httpx.get(ep["url"], headers=ep["headers"], timeout=10)
            status_text = "OK" if r.status_code in (200, 204) else f"HTTP {r.status_code}"
            body_preview = r.text[:150].replace("\n", " ") if r.text else "(empty)"
            print(f"  {ep['name']}: {status_text}")
            print(f"    Response: {body_preview}")
            if r.status_code in (200, 204):
                any_success = True
        except Exception as e:
            print(f"  {ep['name']}: FAILED - {e}")
        print()

    return any_success


def try_table_query(table_name):
    """Try to query a table to see if it exists."""
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
    }
    try:
        r = httpx.get(
            f"{SUPABASE_URL}/rest/v1/{table_name}",
            headers=headers,
            params={"select": "id", "limit": "1"},
            timeout=10,
        )
        return r.status_code, r.text[:200]
    except Exception as e:
        return None, str(e)


if __name__ == "__main__":
    print("=" * 60)
    print("Prometheus -- Supabase Connectivity Diagnostics")
    print("=" * 60)
    print()

    # Test all endpoints
    reachable = test_endpoints()

    # Try querying tables regardless
    print("[2] Attempting to query tables...")
    for table in ["citizen_profiles", "service_feedback"]:
        status, body = try_table_query(table)
        if status:
            print(f"  {table}: HTTP {status}")
            print(f"    Response: {body}")
        else:
            print(f"  {table}: ERROR - {body}")
        print()

    print("=" * 60)
    if reachable:
        print("[INFO] Supabase instance is reachable.")
    else:
        print("[INFO] Could not verify Supabase connectivity.")

    print()
    print("NEXT STEPS:")
    print("  1. Open your Supabase Dashboard: https://supabase.com/dashboard")
    print("  2. Go to Settings > API")
    print("  3. Look for 'anon public' key -- it's a long string starting with 'eyJ...'")
    print("     (NOT the 'sb_publishable_' key)")
    print("  4. Also go to SQL Editor and run database/schema.sql")
    print("=" * 60)
