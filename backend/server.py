from fastapi import FastAPI, APIRouter, HTTPException, Header, Request, Body
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import json
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

# Optional imports — gracefully handle if not installed
try:
    from motor.motor_asyncio import AsyncIOMotorClient
except ImportError:
    AsyncIOMotorClient = None

try:
    import resend
except ImportError:
    resend = None

ROOT_DIR = Path(__file__).parent
DATA_DIR = ROOT_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)
LOCAL_ITEMS_FILE = DATA_DIR / "work_items.json"

load_dotenv(ROOT_DIR / '.env')

# MongoDB connection with safe fallback
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'tanmay_portfolio')

client = None
db = None
if AsyncIOMotorClient is not None:
    try:
        client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=2000)
        db = client[db_name]
    except Exception as e:
        client = None
        db = None

# Resend config
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
NOTIFY_EMAIL = os.environ.get('NOTIFY_EMAIL', 'work.tanmay.in@gmail.com')
ADMIN_KEY = os.environ.get('ADMIN_KEY', 'tanmay-admin-2026')
CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME', '')
CLOUDINARY_UPLOAD_PRESET = os.environ.get('CLOUDINARY_UPLOAD_PRESET', '')

if RESEND_API_KEY and resend is not None:
    resend.api_key = RESEND_API_KEY

app = FastAPI(title="Tanmay Visuals API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ---------- Models ----------
def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


DEFAULT_WORK_ITEMS = [
    {
        "id": "item-himalaya",
        "card_id": "campaign",
        "title": "Himalaya Work",
        "url": "/videos/himalaya_work.mp4",
        "thumbnail_url": None,
        "brand": "Himalaya",
        "description": "Worked as the 3rd Assistant Director, contributing across the entire production pipeline—from early-stage concept discussions and pre-production planning to on-ground shoot execution and post-production coordination. Actively involved in recce, scheduling, and ensuring smooth communication between departments to bring the final output to life.",
        "link": None,
        "link_text": "View the final produced work here (to be released soon)",
        "kind": "video",
        "position": 1,
        "created_at": _now_iso(),
    },
    {
        "id": "item-amd",
        "card_id": "campaign",
        "title": "AMD Work",
        "url": "/videos/amd_work.mp4",
        "thumbnail_url": None,
        "brand": "AMD",
        "description": "Served as the 3rd Chief on set, playing a key role in managing production flow and assisting in both creative and logistical aspects. From pre-production and location recce to shoot-day execution and post-production follow-ups, contributed to maintaining efficiency and alignment throughout the project lifecycle.",
        "link": "https://www.instagram.com/p/DT7kpsrDili/?hl=en",
        "link_text": "Watch the final output here",
        "kind": "video",
        "position": 2,
        "created_at": _now_iso(),
    },
    {
        "id": "item-lenovo",
        "card_id": "campaign",
        "title": "Lenovo Work",
        "url": "/videos/lenovo_work.mp4",
        "thumbnail_url": None,
        "brand": "Lenovo × FIFA World Cup 2026",
        "description": "Led end-to-end video editing and visual assembly for Lenovo's partnership campaign with the FIFA World Cup 2026. Handled fast-paced cuts, sound design, and rhythm to create high-octane social and event promos highlighting the brand's tech presence at a global scale.",
        "link": None,
        "link_text": "Watch the final output here",
        "kind": "video",
        "position": 3,
        "created_at": _now_iso(),
    },
    {
        "id": "item-arpanvester",
        "card_id": "campaign",
        "title": "Arpanvester Work",
        "url": "/videos/arpanvester_work.mp4",
        "thumbnail_url": None,
        "brand": "Arpanvester",
        "description": "Served as Assistant Director on set for Arpanvester's commercial shoot. Directed background talents, synchronized props and camera queues, and ensured lighting setups seamlessly captured brand aesthetics.",
        "link": "https://www.instagram.com/p/DG-8x8Wv-zL/?hl=en",
        "link_text": "Watch the final output here",
        "kind": "video",
        "position": 4,
        "created_at": _now_iso(),
    },
    {
        "id": "item-bakery",
        "card_id": "growth",
        "title": "Bakery Edit",
        "url": "/videos/bakery_edit.mp4",
        "thumbnail_url": None,
        "brand": "Bakery & Cafe",
        "description": "Crafted sensory, fast-paced food cinematography edit for an artisanal bakery. Color-graded rich golden pastry tones with synchronized dynamic beat cuts that drove 3x normal engagement on Instagram Reels.",
        "link": None,
        "link_text": "Watch reel on Instagram",
        "kind": "video",
        "position": 5,
        "created_at": _now_iso(),
    },
    {
        "id": "item-real-estate-1",
        "card_id": "growth",
        "title": "Real Estate Edit 1",
        "url": "/videos/real_estate_edit_1.mp4",
        "thumbnail_url": None,
        "brand": "Luxury Real Estate",
        "description": "Architectural showcase video edit emphasizing expansive spatial flow, high-end interior textures, and seamless speed ramps to capture luxury property buyers.",
        "link": None,
        "link_text": "Watch walkthrough",
        "kind": "video",
        "position": 6,
        "created_at": _now_iso(),
    },
    {
        "id": "item-real-estate-2",
        "card_id": "growth",
        "title": "Real Estate Edit 2",
        "url": "/videos/real_estate_edit_2.mp4",
        "thumbnail_url": None,
        "brand": "Modern Estates",
        "description": "Cinematic property tour featuring clean typography overlays, ambient drone transitions, and polished sound design tailored for real estate investment conversions.",
        "link": None,
        "link_text": "Watch walkthrough",
        "kind": "video",
        "position": 7,
        "created_at": _now_iso(),
    },
    {
        "id": "item-viral",
        "card_id": "growth",
        "title": "Viral Edit",
        "url": "/videos/viral_edit.mp4",
        "thumbnail_url": None,
        "brand": "Viral Social Content",
        "description": "High-retention social edit engineered around a 1.5-second visual hook, fast typography kinetic motion, and immersive SFX pacing.",
        "link": None,
        "link_text": "View viral reel",
        "kind": "video",
        "position": 8,
        "created_at": _now_iso(),
    },
    {
        "id": "item-spotify",
        "card_id": "editing",
        "title": "Spotify Edit",
        "url": "/videos/spotify_edit.mp4",
        "thumbnail_url": None,
        "brand": "Spotify Aesthetic",
        "description": "Vibrant music-sync edit combining custom speed-ramping, kinetic motion graphics, and atmospheric chromatic grading.",
        "link": None,
        "link_text": "Watch edit",
        "kind": "video",
        "position": 9,
        "created_at": _now_iso(),
    },
    {
        "id": "item-spiderman",
        "card_id": "editing",
        "title": "Spiderman Edit",
        "url": "/videos/spiderman_edit.mp4",
        "thumbnail_url": None,
        "brand": "Cinematic Cut",
        "description": "Action pacing edit with dynamic whip pans, match cuts, and aggressive bass drops built specifically for short-form video algorithms.",
        "link": None,
        "link_text": "Watch edit",
        "kind": "video",
        "position": 10,
        "created_at": _now_iso(),
    },
    {
        "id": "item-party",
        "card_id": "editing",
        "title": "Party Edit",
        "url": "/videos/party_edit.mp4",
        "thumbnail_url": None,
        "brand": "Nightlife & Events",
        "description": "High-energy event recap featuring strobe transitions, neon color pop, and rhythmic audio sync that recreates the live party energy.",
        "link": None,
        "link_text": "Watch edit",
        "kind": "video",
        "position": 11,
        "created_at": _now_iso(),
    },
    {
        "id": "item-stranger-things",
        "card_id": "editing",
        "title": "Stranger Things Edit",
        "url": "/videos/stranger_things_edit.mp4",
        "thumbnail_url": None,
        "brand": "Retro Sci-Fi Edit",
        "description": "Moody, 80s-synthwave homage edit utilizing synth basslines, CRT glitch textures, and suspenseful pacing.",
        "link": None,
        "link_text": "Watch edit",
        "kind": "video",
        "position": 12,
        "created_at": _now_iso(),
    },
]


class ContactCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    brand: Optional[str] = Field(default=None, max_length=160)
    phone: str = Field(min_length=4, max_length=32)
    message: str = Field(min_length=1, max_length=4000)


class ContactOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    brand: Optional[str] = None
    phone: str
    message: str
    created_at: str
    email_sent: bool = False


class AnalyticsEvent(BaseModel):
    event: str = Field(min_length=1, max_length=64)
    meta: Optional[dict] = None


class WorkItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    card_id: str  # "campaign" | "growth" | "editing"
    title: str
    url: str  # Cloudinary or video URL
    thumbnail_url: Optional[str] = None
    brand: Optional[str] = None
    description: Optional[str] = None
    link: Optional[str] = None
    link_text: Optional[str] = None
    kind: str = "video"  # "video" | "image"
    position: int = 0
    created_at: str = Field(default_factory=_now_iso)


class WorkItemCreate(BaseModel):
    card_id: str
    title: str
    url: str
    thumbnail_url: Optional[str] = None
    brand: Optional[str] = None
    description: Optional[str] = None
    link: Optional[str] = None
    link_text: Optional[str] = None
    kind: str = "video"
    position: int = 0


class WorkItemUpdate(BaseModel):
    card_id: Optional[str] = None
    title: Optional[str] = None
    url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    brand: Optional[str] = None
    description: Optional[str] = None
    link: Optional[str] = None
    link_text: Optional[str] = None
    kind: Optional[str] = None
    position: Optional[int] = None


class LoginRequest(BaseModel):
    admin_key: str


# ---------- Storage Helpers (MongoDB + JSON fallback) ----------
def _read_local_items() -> List[dict]:
    if not LOCAL_ITEMS_FILE.exists():
        _write_local_items(DEFAULT_WORK_ITEMS)
        return list(DEFAULT_WORK_ITEMS)
    try:
        with open(LOCAL_ITEMS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return list(DEFAULT_WORK_ITEMS)


def _write_local_items(items: List[dict]):
    try:
        with open(LOCAL_ITEMS_FILE, "w", encoding="utf-8") as f:
            json.dump(items, f, indent=2)
    except Exception as e:
        logger.error(f"Failed to write local items: {e}")


async def _db_available() -> bool:
    if db is None or client is None:
        return False
    try:
        await asyncio.wait_for(client.admin.command('ping'), timeout=1.5)
        return True
    except Exception:
        return False


async def _get_all_work_items() -> List[dict]:
    if await _db_available():
        count = await db.work_items.count_documents({})
        if count == 0:
            # Auto-seed initial 12 items
            for item in DEFAULT_WORK_ITEMS:
                await db.work_items.insert_one(dict(item))
        items = await db.work_items.find({}, {"_id": 0}).sort("position", 1).to_list(200)
        return items
    return sorted(_read_local_items(), key=lambda x: x.get("position", 0))


async def _save_work_item(item_dict: dict):
    if await _db_available():
        await db.work_items.insert_one(item_dict)
    items = _read_local_items()
    items.append(item_dict)
    _write_local_items(items)


async def _update_work_item(item_id: str, updates: dict) -> bool:
    updated = False
    if await _db_available():
        res = await db.work_items.update_one({"id": item_id}, {"$set": updates})
        if res.matched_count > 0:
            updated = True
    items = _read_local_items()
    for it in items:
        if it.get("id") == item_id:
            it.update(updates)
            updated = True
            break
    if updated:
        _write_local_items(items)
    return updated


async def _delete_work_item(item_id: str) -> bool:
    deleted = False
    if await _db_available():
        res = await db.work_items.delete_one({"id": item_id})
        if res.deleted_count > 0:
            deleted = True
    items = _read_local_items()
    orig_len = len(items)
    items = [i for i in items if i.get("id") != item_id]
    if len(items) < orig_len:
        deleted = True
        _write_local_items(items)
    return deleted


# ---------- Helpers ----------
async def _send_notification_email(payload: ContactCreate) -> bool:
    if not RESEND_API_KEY:
        logger.info("RESEND_API_KEY not set — skipping email send")
        return False
    try:
        html = f"""
        <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; color:#0C0C0C;">
          <tr><td style="padding:12px 0;"><h2 style="margin:0;">New lead — Tanmay Visuals</h2></td></tr>
          <tr><td style="padding:6px 0;"><strong>Name:</strong> {payload.name}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Brand:</strong> {payload.brand or '-'}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Phone:</strong> {payload.phone}</td></tr>
          <tr><td style="padding:12px 0;"><strong>Message:</strong><br/><div style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px;">{payload.message}</div></td></tr>
        </table>
        """
        params = {
            "from": SENDER_EMAIL,
            "to": [NOTIFY_EMAIL],
            "subject": f"New lead from {payload.name} — Tanmay Visuals",
            "html": html,
        }
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent: {result}")
        return True
    except Exception as e:
        logger.error(f"Failed to send lead email: {e}")
        return False


def _require_admin(x_admin_key: Optional[str]):
    if not x_admin_key or x_admin_key != ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized: invalid admin key")


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {
        "ok": True,
        "service": "tanmay-visuals-api",
        "storage": "mongodb" if await _db_available() else "local-json"
    }


# ----- Cloudinary public config for frontend upload -----
@api_router.get("/cloudinary/config")
async def cloudinary_config():
    return {
        "cloud_name": CLOUDINARY_CLOUD_NAME,
        "upload_preset": CLOUDINARY_UPLOAD_PRESET,
        "configured": bool(CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET)
    }


# ----- Admin Auth -----
@api_router.post("/admin/login")
async def admin_login(payload: LoginRequest):
    if payload.admin_key != ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Invalid admin password/key")
    return {"ok": True, "token": ADMIN_KEY, "role": "admin"}


@api_router.post("/admin/verify")
async def verify_admin(x_admin_key: Optional[str] = Header(default=None)):
    _require_admin(x_admin_key)
    return {"ok": True, "role": "admin"}


# ----- Work items (Public Read, Admin Write) -----
@api_router.get("/work-items", response_model=List[WorkItem])
async def list_work_items():
    raw = await _get_all_work_items()
    return [WorkItem(**i) for i in raw]


@api_router.post("/work-items", response_model=WorkItem)
async def create_work_item(payload: WorkItemCreate, x_admin_key: Optional[str] = Header(default=None)):
    _require_admin(x_admin_key)
    item = WorkItem(**payload.model_dump())
    await _save_work_item(item.model_dump())
    return item


@api_router.put("/work-items/{item_id}", response_model=WorkItem)
async def update_work_item(item_id: str, payload: WorkItemUpdate, x_admin_key: Optional[str] = Header(default=None)):
    _require_admin(x_admin_key)
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    success = await _update_work_item(item_id, updates)
    if not success:
        raise HTTPException(status_code=404, detail="Work item not found")
    
    # Return updated item
    all_items = await _get_all_work_items()
    for it in all_items:
        if it.get("id") == item_id:
            return WorkItem(**it)
    raise HTTPException(status_code=404, detail="Work item not found")


@api_router.delete("/work-items/{item_id}")
async def delete_work_item(item_id: str, x_admin_key: Optional[str] = Header(default=None)):
    _require_admin(x_admin_key)
    success = await _delete_work_item(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Work item not found")
    return {"ok": True, "deleted_id": item_id}


@api_router.post("/work-items/seed")
async def seed_work_items(x_admin_key: Optional[str] = Header(default=None)):
    _require_admin(x_admin_key)
    if await _db_available():
        await db.work_items.delete_many({})
        for item in DEFAULT_WORK_ITEMS:
            await db.work_items.insert_one(dict(item))
    _write_local_items(DEFAULT_WORK_ITEMS)
    return {"ok": True, "message": "Successfully seeded default 12 portfolio items"}


# ----- Contacts & Leads -----
@api_router.post("/contact", response_model=ContactOut)
async def create_contact(payload: ContactCreate, request: Request):
    email_sent = await _send_notification_email(payload)
    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name.strip(),
        "brand": (payload.brand or "").strip() or None,
        "phone": payload.phone.strip(),
        "message": payload.message.strip(),
        "created_at": _now_iso(),
        "email_sent": email_sent,
        "ip": request.client.host if request.client else None,
        "user_agent": request.headers.get("user-agent"),
    }
    if await _db_available():
        await db.contacts.insert_one(doc)
    return ContactOut(**{k: v for k, v in doc.items() if k in ContactOut.model_fields})


@api_router.get("/contacts", response_model=List[ContactOut])
async def list_contacts(x_admin_key: Optional[str] = Header(default=None)):
    _require_admin(x_admin_key)
    if await _db_available():
        items = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
        return [ContactOut(**{k: v for k, v in i.items() if k in ContactOut.model_fields}) for i in items]
    return []


# ----- Analytics -----
@api_router.post("/analytics/event")
async def track_event(event: AnalyticsEvent, request: Request):
    doc = {
        "id": str(uuid.uuid4()),
        "event": event.event,
        "meta": event.meta or {},
        "created_at": _now_iso(),
        "ip": request.client.host if request.client else None,
        "user_agent": request.headers.get("user-agent"),
        "referer": request.headers.get("referer"),
    }
    if await _db_available():
        await db.events.insert_one(doc)
    return {"ok": True}


@api_router.get("/analytics/summary")
async def analytics_summary(x_admin_key: Optional[str] = Header(default=None)):
    _require_admin(x_admin_key)
    if await _db_available():
        pipeline = [
            {"$group": {"_id": "$event", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
        ]
        grouped = await db.events.aggregate(pipeline).to_list(100)
        total = await db.events.count_documents({})
        contacts = await db.contacts.count_documents({})
        return {
            "total_events": total,
            "total_contacts": contacts,
            "by_event": [{"event": g["_id"], "count": g["count"]} for g in grouped],
        }
    return {"total_events": 0, "total_contacts": 0, "by_event": []}


# ---------- App wiring ----------
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()
