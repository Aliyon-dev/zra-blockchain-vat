import os
import pytest
from fastapi.testclient import TestClient

# Skip integration tests by default. To run them against your Supabase DB,
# set RUN_INTEGRATION_TESTS=1 and ensure DATABASE_URL points to Supabase.
run_integration = os.getenv('RUN_INTEGRATION_TESTS') == '1'


@pytest.fixture(scope='module')
def client():
    if not run_integration:
        pytest.skip('Integration tests are skipped by default. Set RUN_INTEGRATION_TESTS=1 to enable.')

    # import after DATABASE_URL is set
    from app.main import app
    from app.database import Base, engine

    # Create tables if missing (safe for ephemeral test DBs). Do not drop production tables.
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c


def test_create_and_get_invoice(client):
    payload = {
        "supplier_tpin": "111222333",
        "buyer_tpin": "444555666",
        "vat": 15.0,
        "amount": 200.0,
    }
    resp = client.post("/invoices", json=payload)
    assert resp.status_code == 201
    data = resp.json()
    assert data['id'] > 0
    assert data['supplier_tpin'] == payload['supplier_tpin']

    get_resp = client.get(f"/invoices/{data['id']}")
    assert get_resp.status_code == 200
    got = get_resp.json()
    assert got['id'] == data['id']


def test_get_nonexistent_invoice(client):
    get_resp = client.get(f"/invoices/999999")
    assert get_resp.status_code == 404


def test_cancel_invoice(client):
    payload = {
        "supplier_tpin": "999888777",
        "buyer_tpin": "222333444",
        "vat": 5.0,
        "amount": 50.0,
    }
    resp = client.post("/invoices", json=payload)
    assert resp.status_code == 201
    data = resp.json()

    patch = client.patch(f"/invoices/{data['id']}")
    assert patch.status_code == 200
    p = patch.json()
    assert p['status'] == 'CANCELLED'

def test_cancel_nonexistent_invoice(client):
    patch_resp = client.patch(f"/invoices/999999")
    assert patch_resp.status_code == 404

def test_create_invoice_invalid_payload(client):
    payload = {
        # missing supplier_tpin
        "buyer_tpin": "444555666",
        "vat": 15.0,
        "amount": 200.0,
    }
    resp = client.post("/invoices", json=payload)
    assert resp.status_code == 422
