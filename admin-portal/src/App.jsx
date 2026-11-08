import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Upload,
  Video,
  Film,
  Plus,
  Trash2,
  Edit3,
  X,
  Play,
  LogOut,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  Link as LinkIcon,
} from "lucide-react";

// ── Config (hardcoded so Tanmay never has to touch settings) ──
const ADMIN_KEY = "tanmay-admin-2026";
const CLOUD_NAME = "bsnz76af";
const UPLOAD_PRESET = "tanmay_portfolio"; // Tanmay creates this once in Cloudinary
const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || "https://tanmayportfolio2.vercel.app/api").replace(/\/+$/, "");
const SITE_URL = import.meta.env.VITE_SITE_URL || "https://tanmayportfolio2.vercel.app";

const CATEGORIES = [
  { id: "campaign", name: "Brand Campaigns", number: "01" },
  { id: "growth",   name: "Growth & Strategy", number: "02" },
  { id: "editing",  name: "Video Editing", number: "03" },
];

const PORTFOLIO_URL = "https://tanmayportfolio2.vercel.app";

const getVideoPoster = (item) => {
  if (!item) return null;
  if (item.thumbnail_url) return item.thumbnail_url;
  if (!item.url) return null;
  if (item.url.includes("cloudinary.com")) {
    return item.url.replace(/\.(mp4|mov|webm|mkv)$/i, ".jpg");
  }
  const match = item.url.match(/\/videos\/([^/?#]+)\.mp4/i);
  if (match) {
    return `${PORTFOLIO_URL}/videos/posters/${match[1]}.jpg`;
  }
  return null;
};

const DEFAULT_ITEMS = [
  { id: "item-himalaya", card_id: "campaign", title: "Himalaya Work", url: `${PORTFOLIO_URL}/videos/himalaya_work.mp4`, thumbnail_url: `${PORTFOLIO_URL}/videos/posters/himalaya_work.jpg`, brand: "Himalaya", position: 1, description: "Worked as the 3rd Assistant Director, contributing across the entire production pipeline—from early-stage concept discussions and pre-production planning to on-ground shoot execution and post-production coordination." },
  { id: "item-amd", card_id: "campaign", title: "AMD Work", url: `${PORTFOLIO_URL}/videos/amd_work.mp4`, thumbnail_url: `${PORTFOLIO_URL}/videos/posters/amd_work.jpg`, brand: "AMD", position: 2, description: "Served as the 3rd Chief on set, playing a key role in managing production flow and assisting in both creative and logistical aspects.", link: "https://www.instagram.com/p/DT7kpsrDili/" },
  { id: "item-lenovo", card_id: "campaign", title: "Lenovo Work", url: `${PORTFOLIO_URL}/videos/lenovo_work.mp4`, thumbnail_url: `${PORTFOLIO_URL}/videos/posters/lenovo_work.jpg`, brand: "Lenovo × FIFA World Cup 2026", position: 3, description: "Led end-to-end video editing and visual assembly for Lenovo's partnership campaign with the FIFA World Cup 2026." },
  { id: "item-arpanvester", card_id: "campaign", title: "Arpanvester Work", url: `${PORTFOLIO_URL}/videos/arpanvester_work.mp4`, thumbnail_url: `${PORTFOLIO_URL}/videos/posters/arpanvester_work.jpg`, brand: "Arpanvester", position: 4, description: "Served as Assistant Director on set for Arpanvester's commercial shoot.", link: "https://www.instagram.com/p/DG-8x8Wv-zL/" },
  { id: "item-bakery", card_id: "growth", title: "Bakery Edit", url: `${PORTFOLIO_URL}/videos/bakery_edit.mp4`, thumbnail_url: `${PORTFOLIO_URL}/videos/posters/bakery_edit.jpg`, brand: "Bakery & Cafe", position: 5, description: "Crafted sensory, fast-paced food cinematography edit for an artisanal bakery." },
  { id: "item-real-estate-1", card_id: "growth", title: "Real Estate Edit 1", url: `${PORTFOLIO_URL}/videos/real_estate_edit_1.mp4`, thumbnail_url: `${PORTFOLIO_URL}/videos/posters/real_estate_edit_1.jpg`, brand: "Luxury Real Estate", position: 6, description: "Architectural showcase video edit emphasizing expansive spatial flow and high-end interior textures." },
  { id: "item-real-estate-2", card_id: "growth", title: "Real Estate Edit 2", url: `${PORTFOLIO_URL}/videos/real_estate_edit_2.mp4`, thumbnail_url: `${PORTFOLIO_URL}/videos/posters/real_estate_edit_2.jpg`, brand: "Modern Estates", position: 7, description: "Cinematic property tour featuring clean typography overlays and ambient drone transitions." },
  { id: "item-viral", card_id: "growth", title: "Viral Edit", url: `${PORTFOLIO_URL}/videos/viral_edit.mp4`, thumbnail_url: `${PORTFOLIO_URL}/videos/posters/viral_edit.jpg`, brand: "Viral Social Content", position: 8, description: "High-retention social edit engineered around a 1.5-second visual hook and fast typography kinetic motion." },
  { id: "item-spotify", card_id: "editing", title: "Spotify Edit", url: `${PORTFOLIO_URL}/videos/spotify_edit.mp4`, thumbnail_url: `${PORTFOLIO_URL}/videos/posters/spotify_edit.jpg`, brand: "Spotify Aesthetic", position: 9, description: "Vibrant music-sync edit combining custom speed-ramping, kinetic motion graphics, and atmospheric chromatic grading." },
  { id: "item-spiderman", card_id: "editing", title: "Spiderman Edit", url: `${PORTFOLIO_URL}/videos/spiderman_edit.mp4`, thumbnail_url: `${PORTFOLIO_URL}/videos/posters/spiderman_edit.jpg`, brand: "Cinematic Cut", position: 10, description: "Action pacing edit with dynamic whip pans, match cuts, and aggressive bass drops." },
  { id: "item-party", card_id: "editing", title: "Party Edit", url: `${PORTFOLIO_URL}/videos/party_edit.mp4`, thumbnail_url: `${PORTFOLIO_URL}/videos/posters/party_edit.jpg`, brand: "Nightlife & Events", position: 11, description: "High-energy event recap featuring strobe transitions, neon color pop, and rhythmic audio sync." },
  { id: "item-stranger-things", card_id: "editing", title: "Stranger Things Edit", url: `${PORTFOLIO_URL}/videos/stranger_things_edit.mp4`, thumbnail_url: `${PORTFOLIO_URL}/videos/posters/stranger_things_edit.jpg`, brand: "Retro Sci-Fi Edit", position: 12, description: "Moody, 80s-synthwave homage edit utilizing synth basslines, CRT glitch textures, and suspenseful pacing." },
];

// ── Helpers ──
const DATA_VERSION = "v4"; // bump to force localStorage refresh when defaults change
const load  = () => { try { if (localStorage.getItem("tv_version") !== DATA_VERSION) { localStorage.removeItem("tv_items"); localStorage.setItem("tv_version", DATA_VERSION); return DEFAULT_ITEMS; } const s = localStorage.getItem("tv_items"); return s ? JSON.parse(s) : DEFAULT_ITEMS; } catch { return DEFAULT_ITEMS; } };
const save  = (items) => { try { localStorage.setItem("tv_items", JSON.stringify(items)); localStorage.setItem("tv_version", DATA_VERSION); } catch {} };
const toast = (set, msg, type = "ok") => { set({ msg, type }); setTimeout(() => set(null), 4000); };

// ══════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════
export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem("tv_auth") === "1");
  const [password, setPassword] = useState("");
  const [authErr, setAuthErr] = useState("");
  const [items, setItems] = useState(load);
  const [tab, setTab] = useState("all");
  const [note, setNote] = useState(null);

  // Modals
  const [showUpload, setShowUpload] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [preview, setPreview] = useState(null);

  // Try loading from backend on mount
  useEffect(() => {
    if (!loggedIn) return;
    axios.get(`${BACKEND_URL}/work-items`, { timeout: 4000 })
      .then(r => { if (r.data?.length) { setItems(r.data); save(r.data); } })
      .catch(() => {});
  }, [loggedIn]);

  const update = (newItems) => { setItems(newItems); save(newItems); };

  // ── Login ──
  const handleLogin = (e) => {
    e.preventDefault();
    if (password.trim() === ADMIN_KEY) {
      setLoggedIn(true);
      localStorage.setItem("tv_auth", "1");
      setAuthErr("");
    } else {
      setAuthErr("Wrong password. Try again.");
    }
  };

  // ── Actions ──
  const handleDelete = (id) => {
    const next = items.filter(i => i.id !== id);
    update(next);
    setDeleting(null);
    toast(setNote, "Deleted!");
    axios.delete(`${BACKEND_URL}/work-items/${id}`, { headers: { "x-admin-key": ADMIN_KEY } }).catch(() => {});
  };

  const handleReorder = (item, dir) => {
    const catItems = items.filter(i => i.card_id === item.card_id).sort((a, b) => (a.position || 0) - (b.position || 0));
    const idx = catItems.findIndex(i => i.id === item.id);
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= catItems.length) return;
    const target = catItems[targetIdx];
    const next = items.map(i => {
      if (i.id === item.id) return { ...i, position: target.position || targetIdx };
      if (i.id === target.id) return { ...i, position: item.position || idx };
      return i;
    });
    update(next);
    toast(setNote, "Reordered!");
  };

  const filtered = tab === "all" ? items : items.filter(i => i.card_id === tab);

  // ────────────────────────────────
  // LOGIN SCREEN
  // ────────────────────────────────
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#070709] flex flex-col justify-center items-center px-4">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#B600A8]/15 via-[#7621B0]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="w-full max-w-sm relative z-10">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Tanmay Visuals</h1>
            <p className="mt-1 text-sm text-white/50">Admin Portal</p>
          </div>
          <form onSubmit={handleLogin} className="bg-[#0E0E12] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="relative">
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#16161D] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#B600A8]"
              />
              <Lock size={16} className="absolute right-3.5 top-3.5 text-white/30" />
            </div>
            {authErr && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={13} /> {authErr}</p>}
            <button className="w-full glow-btn text-white font-medium py-3 rounded-xl text-sm">
              Enter →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ────────────────────────────────
  // MAIN DASHBOARD
  // ────────────────────────────────
  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col">
      {/* Toast */}
      {note && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm border backdrop-blur-md ${
          note.type === "err" ? "bg-red-950/80 border-red-500/30 text-red-200" : "bg-emerald-950/80 border-emerald-500/30 text-emerald-200"
        }`}>
          {note.type === "err" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {note.msg}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0C0C0F]/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#B600A8] to-[#7621B0] flex items-center justify-center font-bold text-white text-xs">T</div>
            <span className="font-bold text-sm">Tanmay Visuals <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded-full ml-1">Admin</span></span>
          </div>
          <div className="flex items-center gap-2">
            <a href={SITE_URL} target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/70">
              <Eye size={13} /> Live Site <ExternalLink size={11} />
            </a>
            <button onClick={() => { setLoggedIn(false); localStorage.removeItem("tv_auth"); }} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10 text-white/60 hover:text-red-400">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-extrabold">Work Videos ({items.length})</h2>
          <button onClick={() => setShowUpload(true)} className="glow-btn px-5 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2 self-start">
            <Plus size={16} /> Upload New Video
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          {[{ id: "all", name: "All" }, ...CATEGORIES].map(c => (
            <button key={c.id} onClick={() => setTab(c.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                tab === c.id ? "bg-white text-black" : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}>
              {c.number ? `${c.number} · ` : ""}{c.name} ({c.id === "all" ? items.length : items.filter(i => i.card_id === c.id).length})
            </button>
          ))}
        </div>

        {/* Video Grid */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center bg-[#0E0E12] border border-white/5 rounded-2xl">
            <Film size={32} className="text-white/20 mx-auto mb-2" />
            <p className="text-sm text-white/50">No videos yet. Click "Upload New Video" to add one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.sort((a,b) => (a.position||0) - (b.position||0)).map((item, idx) => {
              const cat = CATEGORIES.find(c => c.id === item.card_id);
              return (
                <div key={item.id} className="group bg-[#0E0E12] border border-white/[0.08] hover:border-white/20 rounded-2xl overflow-hidden flex flex-col transition-all">
                  {/* Thumbnail */}
                  <div className="relative aspect-[9/12] bg-[#141419] overflow-hidden">
                    {getVideoPoster(item) && (
                      <img
                        src={getVideoPoster(item)}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <video
                      src={item.url}
                      poster={getVideoPoster(item) || undefined}
                      className="relative z-10 w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="none"
                      onMouseEnter={e => { const p = e.target.play(); p?.catch?.(() => {}); }}
                      onMouseLeave={e => e.target.pause()}
                    />
                    <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                    {/* Tags */}
                    <span className="absolute top-2 left-2 z-20 text-[10px] font-mono bg-black/60 backdrop-blur px-2 py-0.5 rounded-full border border-white/10 text-white/80">{cat?.number}</span>
                    <span className="absolute top-2 right-2 z-20 text-[10px] font-mono bg-[#B600A8]/80 text-white px-2 py-0.5 rounded-full">#{item.position || idx+1}</span>
                    {/* Play overlay */}
                    <button onClick={() => setPreview(item)} className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-white"><Play size={18} fill="currentColor" /></div>
                    </button>
                    {/* Bottom info */}
                    <div className="absolute bottom-2 inset-x-2.5 z-20">
                      <p className="text-[10px] uppercase font-mono tracking-wider text-[#D946EF]">{item.brand || cat?.name}</p>
                      <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="p-3 flex items-center justify-between border-t border-white/5">
                    <div className="flex gap-1">
                      <button onClick={() => handleReorder(item, "up")} className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"><ArrowUp size={13} /></button>
                      <button onClick={() => handleReorder(item, "down")} className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"><ArrowDown size={13} /></button>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setEditing(item)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"><Edit3 size={14} /></button>
                      <button onClick={() => setDeleting(item.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/60 hover:text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── UPLOAD MODAL ── */}
      {showUpload && <UploadModal items={items} onDone={(newItem) => {
        const next = [...items, newItem];
        update(next);
        setShowUpload(false);
        toast(setNote, "Video uploaded! It will appear on your website.");
      }} onClose={() => setShowUpload(false)} />}

      {/* ── EDIT MODAL ── */}
      {editing && <EditModal item={editing} onDone={(updated) => {
        const next = items.map(i => i.id === updated.id ? updated : i);
        update(next);
        setEditing(null);
        toast(setNote, "Updated!");
      }} onClose={() => setEditing(null)} />}

      {/* ── DELETE CONFIRM ── */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 max-w-xs w-full text-center">
            <Trash2 size={24} className="text-red-400 mx-auto mb-3" />
            <h3 className="text-base font-bold">Delete this video?</h3>
            <p className="text-xs text-white/50 mt-1">It will be removed from your portfolio.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setDeleting(null)} className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleting)} className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIDEO PREVIEW ── */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-[#0C0C0F] border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <span className="text-xs font-mono text-white/70">{preview.title}</span>
              <button onClick={() => setPreview(null)} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"><X size={14} /></button>
            </div>
            <div className="aspect-[9/16] max-h-[70vh] bg-black"><video src={preview.url} className="w-full h-full object-contain" controls autoPlay /></div>
          </div>
        </div>
      )}
    </div>
  );
}


// ══════════════════════════════════════════════
// UPLOAD MODAL — dead simple
// ══════════════════════════════════════════════
function UploadModal({ items, onDone, onClose }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("campaign");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      if (!title) setTitle(f.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").replace(/\b\w/g, c => c.toUpperCase()));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError("Pick a video file first"); return; }
    if (!title.trim()) { setError("Give it a title"); return; }

    setUploading(true);
    setError("");
    setProgress(5);

    // Upload to Cloudinary
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", UPLOAD_PRESET);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
        fd,
        { onUploadProgress: (p) => { if (p.total) setProgress(Math.round(p.loaded * 100 / p.total)); } }
      );

      const newItem = {
        id: "item-" + Date.now(),
        card_id: category,
        title: title.trim(),
        url: res.data.secure_url,
        brand: brand.trim() || null,
        description: description.trim() || null,
        link: link.trim() || null,
        kind: "video",
        position: items.length + 1,
        created_at: new Date().toISOString(),
      };

      // Try saving to backend (non-blocking)
      axios.post(`${BACKEND_URL}/work-items`, newItem, { headers: { "x-admin-key": ADMIN_KEY }, timeout: 4000 }).catch(() => {});

      onDone(newItem);
    } catch (err) {
      setError("Upload failed: " + (err.response?.data?.error?.message || err.message));
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg bg-[#0F0F14] border border-white/10 rounded-2xl p-6 my-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold">Upload New Video</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70"><X size={14} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File picker */}
          <div onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${file ? "border-emerald-500/50 bg-emerald-500/5" : "border-white/15 hover:border-[#B600A8]/50"}`}>
            <input ref={inputRef} type="file" accept="video/mp4,video/quicktime,video/webm" onChange={handleFile} className="hidden" />
            {file ? (
              <div className="flex items-center justify-center gap-2">
                <Video size={20} className="text-emerald-400" />
                <div className="text-left">
                  <p className="text-sm font-semibold truncate max-w-xs">{file.name}</p>
                  <p className="text-[11px] text-white/50">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
              </div>
            ) : (
              <div>
                <Upload size={28} className="text-white/30 mx-auto mb-1" />
                <p className="text-sm font-medium">Click to pick a video</p>
                <p className="text-[11px] text-white/40">MP4, MOV, WEBM</p>
              </div>
            )}
          </div>

          {/* Progress */}
          {uploading && (
            <div className="bg-[#14141A] rounded-xl p-3 border border-[#B600A8]/30">
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-[#D946EF] flex items-center gap-1"><RefreshCw size={12} className="animate-spin" /> Uploading...</span>
                <span className="font-bold">{progress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#B600A8] to-[#7621B0] transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {/* Title */}
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Video title *" required
            className="w-full bg-[#16161D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm focus:border-[#B600A8] focus:outline-none" />

          {/* Category + Brand (side by side) */}
          <div className="grid grid-cols-2 gap-3">
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="bg-[#16161D] border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-[#B600A8] focus:outline-none">
              {CATEGORIES.map(c => <option key={c.id} value={c.id} className="bg-[#16161D]">{c.number} · {c.name}</option>)}
            </select>
            <input type="text" value={brand} onChange={e => setBrand(e.target.value)} placeholder="Brand name"
              className="bg-[#16161D] border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-[#B600A8] focus:outline-none" />
          </div>

          {/* Description (optional) */}
          <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description (optional)"
            className="w-full bg-[#16161D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm placeholder:text-white/30 focus:border-[#B600A8] focus:outline-none" />

          {/* Link (optional) */}
          <input type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="Instagram / YouTube link (optional)"
            className="w-full bg-[#16161D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm placeholder:text-white/30 focus:border-[#B600A8] focus:outline-none" />

          {error && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={13} /> {error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={uploading} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm">Cancel</button>
            <button type="submit" disabled={uploading} className="flex-1 glow-btn py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
              {uploading ? <><RefreshCw size={14} className="animate-spin" /> Uploading...</> : "Upload & Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════
// EDIT MODAL — dead simple
// ══════════════════════════════════════════════
function EditModal({ item, onDone, onClose }) {
  const [title, setTitle] = useState(item.title || "");
  const [category, setCategory] = useState(item.card_id);
  const [brand, setBrand] = useState(item.brand || "");
  const [description, setDescription] = useState(item.description || "");
  const [link, setLink] = useState(item.link || "");

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...item, title: title.trim(), card_id: category, brand: brand.trim() || null, description: description.trim() || null, link: link.trim() || null };
    axios.put(`${BACKEND_URL}/work-items/${item.id}`, updated, { headers: { "x-admin-key": ADMIN_KEY }, timeout: 4000 }).catch(() => {});
    onDone(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg bg-[#0F0F14] border border-white/10 rounded-2xl p-6 my-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold">Edit Video</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70"><X size={14} /></button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required
            className="w-full bg-[#16161D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm focus:border-[#B600A8] focus:outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="bg-[#16161D] border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-[#B600A8] focus:outline-none">
              {CATEGORIES.map(c => <option key={c.id} value={c.id} className="bg-[#16161D]">{c.number} · {c.name}</option>)}
            </select>
            <input type="text" value={brand} onChange={e => setBrand(e.target.value)} placeholder="Brand name"
              className="bg-[#16161D] border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-[#B600A8] focus:outline-none" />
          </div>
          <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Description"
            className="w-full bg-[#16161D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm focus:border-[#B600A8] focus:outline-none" />
          <input type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="Instagram / YouTube link"
            className="w-full bg-[#16161D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm focus:border-[#B600A8] focus:outline-none" />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm">Cancel</button>
            <button type="submit" className="flex-1 glow-btn py-2.5 rounded-xl text-sm font-semibold">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
