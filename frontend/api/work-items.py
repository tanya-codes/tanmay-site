"""
Vercel Serverless API — work items CRUD
Stores data in a JSON file on Vercel's /tmp (ephemeral) + uses Vercel KV/Blob if available.
For a simple portfolio, /tmp + seeded defaults is sufficient.
"""
import json
import os
from http.server import BaseHTTPRequestHandler
from pathlib import Path

ADMIN_KEY = os.environ.get("ADMIN_KEY", "tanmay-admin-2026")
DATA_FILE = Path("/tmp/work_items.json")

# Default seed data — matches the portfolio's existing videos
DEFAULT_ITEMS = [
    {"id": "item-himalaya", "card_id": "campaign", "title": "Himalaya Work", "url": "/videos/himalaya_work.mp4", "brand": "Himalaya", "position": 1, "description": "Worked as the 3rd Assistant Director, contributing across the entire production pipeline—from early-stage concept discussions and pre-production planning to on-ground shoot execution and post-production coordination.", "link": None, "link_text": "View the final produced work here (to be released soon)", "kind": "video"},
    {"id": "item-amd", "card_id": "campaign", "title": "AMD Work", "url": "/videos/amd_work.mp4", "brand": "AMD", "position": 2, "description": "Served as the 3rd Chief on set, playing a key role in managing production flow and assisting in both creative and logistical aspects.", "link": "https://www.instagram.com/p/DT7kpsrDili/", "link_text": "Watch the final output here", "kind": "video"},
    {"id": "item-lenovo", "card_id": "campaign", "title": "Lenovo Work", "url": "/videos/lenovo_work.mp4", "brand": "Lenovo × FIFA World Cup 2026", "position": 3, "description": "Led end-to-end video editing and visual assembly for Lenovo's partnership campaign with the FIFA World Cup 2026.", "link": None, "link_text": "Watch the final output here", "kind": "video"},
    {"id": "item-arpanvester", "card_id": "campaign", "title": "Arpanvester Work", "url": "/videos/arpanvester_work.mp4", "brand": "Arpanvester", "position": 4, "description": "Served as Assistant Director on set for Arpanvester's commercial shoot.", "link": "https://www.instagram.com/p/DG-8x8Wv-zL/", "link_text": "Watch the final output here", "kind": "video"},
    {"id": "item-bakery", "card_id": "growth", "title": "Bakery Edit", "url": "/videos/bakery_edit.mp4", "brand": "Bakery & Cafe", "position": 5, "description": "Crafted sensory, fast-paced food cinematography edit for an artisanal bakery.", "link": None, "link_text": "Watch reel on Instagram", "kind": "video"},
    {"id": "item-real-estate-1", "card_id": "growth", "title": "Real Estate Edit 1", "url": "/videos/real_estate_edit_1.mp4", "brand": "Luxury Real Estate", "position": 6, "description": "Architectural showcase video edit emphasizing expansive spatial flow and high-end interior textures.", "link": None, "link_text": "Watch walkthrough", "kind": "video"},
    {"id": "item-real-estate-2", "card_id": "growth", "title": "Real Estate Edit 2", "url": "/videos/real_estate_edit_2.mp4", "brand": "Modern Estates", "position": 7, "description": "Cinematic property tour featuring clean typography overlays and ambient drone transitions.", "link": None, "link_text": "Watch walkthrough", "kind": "video"},
    {"id": "item-viral", "card_id": "growth", "title": "Viral Edit", "url": "/videos/viral_edit.mp4", "brand": "Viral Social Content", "position": 8, "description": "High-retention social edit engineered around a 1.5-second visual hook and fast typography kinetic motion.", "link": None, "link_text": "View viral reel", "kind": "video"},
    {"id": "item-spotify", "card_id": "editing", "title": "Spotify Edit", "url": "/videos/spotify_edit.mp4", "brand": "Spotify Aesthetic", "position": 9, "description": "Vibrant music-sync edit combining custom speed-ramping, kinetic motion graphics, and atmospheric chromatic grading.", "link": None, "link_text": "Watch edit", "kind": "video"},
    {"id": "item-spiderman", "card_id": "editing", "title": "Spiderman Edit", "url": "/videos/spiderman_edit.mp4", "brand": "Cinematic Cut", "position": 10, "description": "Action pacing edit with dynamic whip pans, match cuts, and aggressive bass drops.", "link": None, "link_text": "Watch edit", "kind": "video"},
    {"id": "item-party", "card_id": "editing", "title": "Party Edit", "url": "/videos/party_edit.mp4", "brand": "Nightlife & Events", "position": 11, "description": "High-energy event recap featuring strobe transitions, neon color pop, and rhythmic audio sync.", "link": None, "link_text": "Watch edit", "kind": "video"},
    {"id": "item-stranger-things", "card_id": "editing", "title": "Stranger Things Edit", "url": "/videos/stranger_things_edit.mp4", "brand": "Retro Sci-Fi Edit", "position": 12, "description": "Moody, 80s-synthwave homage edit utilizing synth basslines, CRT glitch textures, and suspenseful pacing.", "link": None, "link_text": "Watch edit", "kind": "video"},
]


def _read():
    if not DATA_FILE.exists():
        _write(DEFAULT_ITEMS)
        return list(DEFAULT_ITEMS)
    try:
        return json.loads(DATA_FILE.read_text())
    except Exception:
        return list(DEFAULT_ITEMS)


def _write(items):
    DATA_FILE.write_text(json.dumps(items, indent=2))


def _cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-admin-key",
    }


class handler(BaseHTTPRequestHandler):
    def _send(self, code, body):
        self.send_response(code)
        for k, v in _cors_headers().items():
            self.send_header(k, v)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(body).encode())

    def do_OPTIONS(self):
        self.send_response(204)
        for k, v in _cors_headers().items():
            self.send_header(k, v)
        self.end_headers()

    def do_GET(self):
        items = sorted(_read(), key=lambda x: x.get("position", 0))
        self._send(200, items)

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length)) if length else {}

        # Seed endpoint
        if self.path.rstrip("/").endswith("/seed"):
            _write(DEFAULT_ITEMS)
            return self._send(200, {"ok": True, "count": len(DEFAULT_ITEMS)})

        items = _read()
        if "id" not in body:
            import uuid
            body["id"] = f"item-{uuid.uuid4().hex[:8]}"
        items.append(body)
        _write(items)
        self._send(201, body)

    def do_PUT(self):
        # Extract item_id from path: /api/work-items/ITEM_ID
        parts = self.path.rstrip("/").split("/")
        item_id = parts[-1] if parts else ""

        key = self.headers.get("x-admin-key", "")
        if key != ADMIN_KEY:
            return self._send(403, {"error": "Unauthorized"})

        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length)) if length else {}

        items = _read()
        found = False
        for i, item in enumerate(items):
            if item.get("id") == item_id:
                items[i] = {**item, **body}
                found = True
                break
        if not found:
            return self._send(404, {"error": "Not found"})
        _write(items)
        self._send(200, items[i])

    def do_DELETE(self):
        parts = self.path.rstrip("/").split("/")
        item_id = parts[-1] if parts else ""

        key = self.headers.get("x-admin-key", "")
        if key != ADMIN_KEY:
            return self._send(403, {"error": "Unauthorized"})

        items = _read()
        new_items = [it for it in items if it.get("id") != item_id]
        if len(new_items) == len(items):
            return self._send(404, {"error": "Not found"})
        _write(new_items)
        self._send(200, {"ok": True})
