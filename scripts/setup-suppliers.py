#!/usr/bin/env python3
"""
Suppliers Setup Script

This script creates the two demo suppliers in the database via the API.
"""

import json
from urllib import request as urllib_request
from urllib.error import URLError

API_BASE = "http://localhost:4000/api"
SUPPLIERS_ENDPOINT = f"{API_BASE}/suppliers"

SUPPLIERS = [
    {
        "id": "sup-demo-creamery",
        "name": "Demo Creamery Collective",
        "email": "orders@democreamery.example",
        "phone": "+1-555-111-2222",
        "address": "10 Creamery Lane, Gelato City",
        "website": "https://democreamery.example"
    },
    {
        "id": "sup-tanstack-gelato",
        "name": "TanStack Gelato Supply",
        "email": "hello@tanstackgelato.example",
        "phone": "+1-555-333-4444",
        "address": "42 Router Road, Queryville",
        "website": "https://tanstackgelato.example"
    }
]


def make_api_request(url: str, data: dict) -> tuple[int, str]:
    """Make HTTP request to API."""
    try:
        data_bytes = json.dumps(data).encode('utf-8')
        req = urllib_request.Request(
            url,
            data=data_bytes,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        
        with urllib_request.urlopen(req, timeout=10) as response:
            status = response.status
            body = response.read().decode('utf-8')
            return status, body
    except URLError as e:
        if hasattr(e, 'code'):
            error_body = e.read().decode('utf-8') if hasattr(e, 'read') else ""
            return e.code, error_body
        else:
            raise


def main():
    """Create suppliers."""
    print("🏢 Setting up suppliers...\n")
    
    # Check API is running
    print(f"📤 Checking API at {API_BASE}...")
    try:
        status, _ = make_api_request(f"{API_BASE}/docs.json", {})
    except URLError:
        print(f"❌ Cannot connect to API at {API_BASE}")
        print("   Please ensure the server is running with: npm run server:start")
        return
    
    print(f"✅ API is running")
    
    created = 0
    failed = 0
    
    for supplier in SUPPLIERS:
        try:
            print(f"\n📝 Creating supplier: {supplier['name']}...")
            status, response_text = make_api_request(SUPPLIERS_ENDPOINT, supplier)
            
            if status == 201:
                print(f"   ✅ Created successfully")
                created += 1
            else:
                print(f"   ❌ Failed: {status}")
                if response_text:
                    print(f"   Response: {response_text[:200]}")
                failed += 1
                
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
            failed += 1
    
    print(f"\n✨ Setup complete!")
    print(f"   ✅ Created: {created}")
    print(f"   ❌ Failed: {failed}")


if __name__ == "__main__":
    main()
