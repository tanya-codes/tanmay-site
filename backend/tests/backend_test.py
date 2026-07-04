"""Backend API tests for Tanmay Visuals portfolio backend."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://cinematic-portfolio-209.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"
ADMIN_KEY = "tanmay-admin-2026"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "X-Admin-Key": ADMIN_KEY})
    return s


# ---------- Health ----------
class TestHealth:
    def test_root(self, client):
        r = client.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("ok") is True
        assert data.get("service") == "tanmay-visuals-api"


# ---------- Contact ----------
class TestContact:
    def test_create_contact_valid(self, client, admin_client):
        payload = {
            "name": "TEST_John Doe",
            "brand": "TEST_Brand",
            "phone": "9999999999",
            "message": "Hello, I want to work with you.",
        }
        r = client.post(f"{API}/contact", json=payload)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["name"] == payload["name"]
        assert body["brand"] == payload["brand"]
        assert body["phone"] == payload["phone"]
        assert body["message"] == payload["message"]
        assert body["email_sent"] is False  # RESEND key empty
        assert "id" in body and body["id"]

        # Verify persistence via admin /contacts
        r2 = admin_client.get(f"{API}/contacts")
        assert r2.status_code == 200
        ids = [c["id"] for c in r2.json()]
        assert body["id"] in ids

    def test_create_contact_missing_name(self, client):
        r = client.post(f"{API}/contact", json={"name": "", "phone": "1234", "message": "hi"})
        assert r.status_code == 422

    def test_create_contact_missing_phone(self, client):
        r = client.post(f"{API}/contact", json={"name": "x", "phone": "", "message": "hi"})
        assert r.status_code == 422

    def test_create_contact_missing_message(self, client):
        r = client.post(f"{API}/contact", json={"name": "x", "phone": "1234", "message": ""})
        assert r.status_code == 422

    def test_contacts_requires_admin(self, client):
        r = client.get(f"{API}/contacts")
        assert r.status_code == 401


# ---------- Analytics ----------
class TestAnalytics:
    def test_track_event(self, client):
        r = client.post(f"{API}/analytics/event", json={"event": "page_view", "meta": {"path": "/"}})
        assert r.status_code == 200
        assert r.json() == {"ok": True}

    def test_summary_requires_admin(self, client):
        r = client.get(f"{API}/analytics/summary")
        assert r.status_code == 401

    def test_summary_with_admin(self, admin_client):
        # Ensure at least one event exists
        requests.post(f"{API}/analytics/event", json={"event": "test_event"})
        r = admin_client.get(f"{API}/analytics/summary")
        assert r.status_code == 200
        data = r.json()
        assert "total_events" in data
        assert "total_contacts" in data
        assert "by_event" in data
        assert isinstance(data["by_event"], list)
        assert isinstance(data["total_events"], int)


# ---------- Admin Verify ----------
class TestAdminVerify:
    def test_verify_wrong_key(self, client):
        r = client.post(f"{API}/admin/verify", headers={"X-Admin-Key": "wrong"})
        assert r.status_code == 401

    def test_verify_missing_key(self, client):
        r = client.post(f"{API}/admin/verify")
        assert r.status_code == 401

    def test_verify_correct_key(self, admin_client):
        r = admin_client.post(f"{API}/admin/verify")
        assert r.status_code == 200
        assert r.json().get("ok") is True


# ---------- Work Items CRUD ----------
class TestWorkItems:
    def test_work_items_crud_flow(self, client, admin_client):
        # Public list initial
        r = client.get(f"{API}/work-items")
        assert r.status_code == 200
        initial = r.json()
        assert isinstance(initial, list)

        # Create requires admin
        payload = {
            "card_id": "campaign",
            "title": "TEST_Item",
            "url": "https://example.com/video.mp4",
            "kind": "video",
            "position": 99,
        }
        r_unauth = client.post(f"{API}/work-items", json=payload)
        assert r_unauth.status_code == 401

        r_create = admin_client.post(f"{API}/work-items", json=payload)
        assert r_create.status_code == 200, r_create.text
        created = r_create.json()
        assert created["title"] == payload["title"]
        assert created["url"] == payload["url"]
        assert created["card_id"] == payload["card_id"]
        item_id = created["id"]
        assert item_id

        # Public GET should include it
        r_list = client.get(f"{API}/work-items")
        assert r_list.status_code == 200
        ids = [i["id"] for i in r_list.json()]
        assert item_id in ids

        # Delete unauth
        r_del_unauth = client.delete(f"{API}/work-items/{item_id}")
        assert r_del_unauth.status_code == 401

        # Delete with admin
        r_del = admin_client.delete(f"{API}/work-items/{item_id}")
        assert r_del.status_code == 200
        assert r_del.json().get("ok") is True

        # Delete non-existent -> 404
        r_del2 = admin_client.delete(f"{API}/work-items/{item_id}")
        assert r_del2.status_code == 404

        # Confirm removal
        r_list2 = client.get(f"{API}/work-items")
        ids2 = [i["id"] for i in r_list2.json()]
        assert item_id not in ids2
