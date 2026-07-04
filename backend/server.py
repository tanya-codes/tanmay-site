from fastapi import FastAPI, APIRouter, HTTPException, Header, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend config
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
NOTIFY_EMAIL = os.environ.get('NOTIFY_EMAIL', 'work.tanmay.in@gmail.com')
ADMIN_KEY = os.environ.get('ADMIN_KEY', 'tanmay-admin-2026')

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ---------- Models ----------
def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


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
    url: str  # video or image URL
    kind: str = "video"  # "video" | "image"
    position: int = 0
    created_at: str = Field(default_factory=_now_iso)


class WorkItemCreate(BaseModel):
    card_id: str
    title: str
    url: str
    kind: str = "video"
    position: int = 0


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
        raise HTTPException(status_code=401, detail="Unauthorized")


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"ok": True, "service": "tanmay-visuals-api"}


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
    await db.contacts.insert_one(doc)
    return ContactOut(**{k: v for k, v in doc.items() if k in ContactOut.model_fields})


@api_router.get("/contacts", response_model=List[ContactOut])
async def list_contacts(x_admin_key: Optional[str] = Header(default=None)):
    _require_admin(x_admin_key)
    items = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [ContactOut(**{k: v for k, v in i.items() if k in ContactOut.model_fields}) for i in items]


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
    await db.events.insert_one(doc)
    return {"ok": True}


@api_router.get("/analytics/summary")
async def analytics_summary(x_admin_key: Optional[str] = Header(default=None)):
    _require_admin(x_admin_key)
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


# ----- Work items (admin CRUD, public read) -----
@api_router.get("/work-items", response_model=List[WorkItem])
async def list_work_items():
    items = await db.work_items.find({}, {"_id": 0}).sort("position", 1).to_list(200)
    return [WorkItem(**i) for i in items]


@api_router.post("/work-items", response_model=WorkItem)
async def create_work_item(payload: WorkItemCreate, x_admin_key: Optional[str] = Header(default=None)):
    _require_admin(x_admin_key)
    item = WorkItem(**payload.model_dump())
    await db.work_items.insert_one(item.model_dump())
    return item


@api_router.delete("/work-items/{item_id}")
async def delete_work_item(item_id: str, x_admin_key: Optional[str] = Header(default=None)):
    _require_admin(x_admin_key)
    result = await db.work_items.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}


@api_router.post("/admin/verify")
async def verify_admin(x_admin_key: Optional[str] = Header(default=None)):
    _require_admin(x_admin_key)
    return {"ok": True}


# ---------- App wiring ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
