#!/usr/bin/env python3
"""
Ingredients CSV Import Script

This script reads the ingredients CSV file and imports them into the database via the API.
It automatically extracts unique suppliers from the CSV and creates them in the database first.
"""

import csv
import json
import re
import sys
import uuid
from typing import Optional, Dict, Any
from urllib import request as urllib_request
from urllib.error import URLError
import urllib.parse

# Configuration
CSV_FILE = "/Users/ryan/Code/ice-cream-calculator/data/ingredients.csv"
API_BASE = "http://localhost:4000/api"
API_ENDPOINT = f"{API_BASE}/ingredients"
SUPPLIERS_ENDPOINT = f"{API_BASE}/suppliers"

# Will be populated from CSV
SUPPLIER_MAPPING = {}


def generate_id() -> str:
    """Generate a unique ID."""
    return str(uuid.uuid4())


def slugify(text: str) -> str:
    """Convert text to a URL-friendly slug."""
    # Convert to lowercase and replace spaces/special chars with hyphens
    slug = re.sub(r'[^\w\s-]', '', text.lower())
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')


def generate_supplier_id(supplier_name: str) -> str:
    """Generate a UUID-based supplier ID (deterministic based on name)."""
    # Create a deterministic UUID from the supplier name
    # This ensures the same supplier name always gets the same ID
    import hashlib
    namespace = "00000000-0000-5000-8000-000000000000"  # Default namespace
    name_hash = hashlib.md5(supplier_name.encode()).digest()
    # Create a UUID5-like hash (simplified)
    return str(uuid.uuid5(uuid.UUID(namespace), supplier_name))


def parse_numeric(value: str) -> Optional[float]:
    """Parse a numeric field, handling errors and empty values."""
    if not value or value.startswith("#"):
        return None
    try:
        return float(value)
    except ValueError:
        return None


def parse_status(status: str) -> str:
    """Parse status field."""
    if not status:
        return "Inactive"
    return "Active" if status.split(",")[0].strip() == "Active" else "Inactive"


def get_supplier_id(supplier: str) -> str:
    """Get supplier ID from name, using mapping from CSV."""
    if not supplier:
        # Return a default supplier ID that should exist
        return list(SUPPLIER_MAPPING.values())[0] if SUPPLIER_MAPPING else "sup-unknown"
    supplier_name = supplier.strip()
    return SUPPLIER_MAPPING.get(supplier_name, "sup-unknown")


def transform_row(row: Dict[str, str]) -> Optional[Dict[str, Any]]:
    """Transform CSV row into ingredient payload."""
    name = row.get("Name", "").strip()
    if not name:
        return None

    return {
        "id": generate_id(),
        "name": name,
        "supplierId": get_supplier_id(row.get("Supplier", "")),
        "status": parse_status(row.get("Status", "")),
        "category": (row.get("Category", "") or "Other").strip(),
        "type": (row.get("Type", "") or "Dry").strip(),
        "brand": (row.get("Brand", "") or "").strip() or None,
        "foodCompositionId": (row.get("Food Composition ID", "") or "").strip() or None,
        "energyPer100g": parse_numeric(row.get("Energy, FSANZ", "")),
        "proteinPer100g": parse_numeric(row.get("Protein", "")),
        "totalFatPer100g": parse_numeric(row.get("Fat, total", "")),
        "saturatedFatPer100g": parse_numeric(row.get("Fat, saturated (SFA)", "")),
        "totalCarbPer100g": parse_numeric(row.get("Carbohydrate, available", "")),
        "totalSugarsPer100g": parse_numeric(row.get("Sugars, total", "")),
        "sodiumMgPer100g": parse_numeric(row.get("Sodium (mg)", "")),
        "waterPer100g": parse_numeric(row.get("Water", "")),
        "totalSolidsPer100g": parse_numeric(row.get("Total solids", "")),
        "otherSolidsPer100g": parse_numeric(row.get("Other solids", "")),
        "msnfPer100g": parse_numeric(row.get("MSNF", "")),
        "sucrosePer100g": parse_numeric(row.get("Sucrose", "")),
        "fructosePer100g": parse_numeric(row.get("Fructose", "")),
        "glucosePer100g": parse_numeric(row.get("Glucose", "")),
        "dextrosePer100g": parse_numeric(row.get("Dextrose", "")),
        "alcoholPer100g": parse_numeric(row.get("Alcohol", "")),
        "pac": parse_numeric(row.get("PAC", "")),
        "pod": parse_numeric(row.get("POD", "")),
        "hf": parse_numeric(row.get("HF", "")),
        "dryCocoaSolidsPer100g": parse_numeric(row.get("Dry Cocoa solids (without fat)", "")),
        "cocoaButterPer100g": parse_numeric(row.get("Cocoa butter", "")),
        "supplierCode": (row.get("Supplier code", "") or "").strip() or None,
        "packageSizeInGrams": parse_numeric(row.get("Package size", "")),
        "allergens": {},
    }


def make_api_request(url: str, data: Optional[Dict] = None) -> tuple[int, str]:
    """Make HTTP request to API."""
    try:
        if data:
            data_bytes = json.dumps(data).encode('utf-8')
            req = urllib_request.Request(
                url,
                data=data_bytes,
                headers={"Content-Type": "application/json"},
                method="POST"
            )
        else:
            req = urllib_request.Request(url)
        
        with urllib_request.urlopen(req, timeout=10) as response:
            status = response.status
            body = response.read().decode('utf-8')
            return status, body
    except URLError as e:
        if hasattr(e, 'code'):
            # Server returned an HTTP error
            error_body = e.read().decode('utf-8') if hasattr(e, 'read') else ""
            return e.code, error_body
        else:
            # Connection error
            raise


def extract_suppliers_from_csv() -> set:
    """Extract unique supplier names from CSV."""
    suppliers = set()
    try:
        with open(CSV_FILE, "r", encoding="utf-8") as f:
            # Skip the first row (metadata/grouping headers)
            f.readline()
            # Now read with the actual column headers
            reader = csv.DictReader(f)
            for row in reader:
                supplier = row.get("Supplier", "").strip()
                if supplier:
                    suppliers.add(supplier)
    except Exception as e:
        print(f"❌ Error reading CSV: {str(e)}")
        return set()
    return suppliers


def create_suppliers(suppliers: set) -> bool:
    """Create suppliers in the database."""
    if not suppliers:
        print("ℹ️  No suppliers found in CSV")
        return True
    
    print(f"📝 Creating {len(suppliers)} suppliers...\n")
    
    created = 0
    failed = 0
    
    for supplier_name in sorted(suppliers):
        supplier_id = generate_supplier_id(supplier_name)
        
        supplier_payload = {
            "id": supplier_id,
            "name": supplier_name,
            "email": None,
            "phone": None,
            "address": None,
            "website": None
        }
        
        try:
            status, response_text = make_api_request(SUPPLIERS_ENDPOINT, supplier_payload)
            
            if status == 201:
                SUPPLIER_MAPPING[supplier_name] = supplier_id
                print(f"   ✅ {supplier_name} → {supplier_id}")
                created += 1
            elif status == 409:
                # Already exists, get the ID from the response or assume it matches
                SUPPLIER_MAPPING[supplier_name] = supplier_id
                print(f"   ℹ️  {supplier_name} (already exists)")
                created += 1
            else:
                print(f"   ❌ Failed to create {supplier_name}: {status}")
                if response_text:
                    try:
                        error_data = json.loads(response_text)
                        print(f"      {error_data.get('message', response_text[:100])}")
                    except:
                        print(f"      {response_text[:100]}")
                failed += 1
                
        except Exception as e:
            print(f"   ❌ Error creating {supplier_name}: {str(e)}")
            failed += 1
    
    print(f"\n   ✅ Created: {created}")
    if failed > 0:
        print(f"   ❌ Failed: {failed}")
        return False
    return True


def main():
    """Main import function."""
    print("🍦 Ingredients Import Process\n")
    
    # Check API is running
    print(f"📤 Checking API at {API_BASE}...")
    try:
        status, _ = make_api_request(f"{API_BASE}/docs.json", {})
        if status != 200:
            print(f"❌ API returned status {status}")
            return
    except URLError:
        print(f"❌ Cannot connect to API at {API_BASE}")
        print("   Please ensure the server is running with: npm run server:start")
        return
    
    print(f"✅ API is running\n")
    
    # Step 1: Extract and create suppliers
    print("=" * 50)
    print("STEP 1: Setting up suppliers")
    print("=" * 50)
    suppliers = extract_suppliers_from_csv()
    if not create_suppliers(suppliers):
        print("❌ Failed to create suppliers. Aborting import.")
        return
    
    # Step 2: Load and import ingredients
    print("\n" + "=" * 50)
    print("STEP 2: Importing ingredients")
    print("=" * 50 + "\n")
    
    print("� Reading CSV file...")
    
    try:
        ingredients = []
        with open(CSV_FILE, "r", encoding="utf-8") as f:
            # Skip the first row (metadata/grouping headers)
            f.readline()
            # Now read with the actual column headers
            reader = csv.DictReader(f)
            for row in reader:
                ingredient = transform_row(row)
                if ingredient:
                    ingredients.append(ingredient)
        
        print(f"✅ Loaded {len(ingredients)} ingredients from CSV\n")
        print(f"📥 Starting import of {len(ingredients)} ingredients...\n")
        
        imported = 0
        failed = 0
        
        for i, ingredient in enumerate(ingredients, 1):
            try:
                status, response_text = make_api_request(API_ENDPOINT, ingredient)
                
                if status == 201:
                    imported += 1
                    if i % 50 == 0:
                        print(f"  📊 Progress: {i}/{len(ingredients)} imported...")
                else:
                    print(f"❌ Failed to import '{ingredient['name']}': {status}")
                    if response_text:
                        print(f"   Response: {response_text[:200]}")
                    failed += 1
                    
            except Exception as e:
                print(f"❌ Error importing '{ingredient['name']}': {str(e)}")
                failed += 1
        
        print(f"\n✨ Import complete!")
        print(f"   ✅ Successfully imported: {imported}")
        print(f"   ❌ Failed: {failed}")
        print(f"   📊 Total: {len(ingredients)}")
        
    except FileNotFoundError:
        print(f"❌ CSV file not found: {CSV_FILE}")
        sys.exit(1)
    except Exception as e:
        print(f"💥 Fatal error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
