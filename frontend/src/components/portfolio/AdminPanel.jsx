import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, LogOut, Plus, ArrowLeft } from "lucide-react";
import { API } from "../../lib/track";
import { TEST_IDS, WORK_CARDS } from "../../constants";

const STORAGE_KEY = "tanmay_admin_key";

export default function AdminPanel() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState({
    card_id: "campaign",
    title: "",
    url: "",
    kind: "video",
    position: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) verifyKey(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyKey = async (k) => {
    try {
      await axios.post(
        `${API}/admin/verify`,
        {},
        { headers: { "x-admin-key": k } }
      );
      setKey(k);
      setAuthed(true);
      sessionStorage.setItem(STORAGE_KEY, k);
      loadAll(k);
    } catch {
      setError("Invalid admin key.");
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  const loadAll = async (k) => {
    const headers = { "x-admin-key": k };
    const [wi, c, s] = await Promise.all([
      axios.get(`${API}/work-items`),
      axios.get(`${API}/contacts`, { headers }).catch(() => ({ data: [] })),
      axios
        .get(`${API}/analytics/summary`, { headers })
        .catch(() => ({ data: null })),
    ]);
    setItems(wi.data || []);
    setContacts(c.data || []);
    setSummary(s.data);
  };

  const login = (e) => {
    e.preventDefault();
    verifyKey(key.trim());
  };

  const logout = () => {
    setAuthed(false);
    setKey("");
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) return;
    try {
      const res = await axios.post(`${API}/work-items`, form, {
        headers: { "x-admin-key": key },
      });
      setItems((prev) => [...prev, res.data]);
      setForm({ card_id: form.card_id, title: "", url: "", kind: "video", position: 0 });
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to add");
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`${API}/work-items/${id}`, {
        headers: { "x-admin-key": key },
      });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      setError("Failed to delete");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center px-5">
        <form
          onSubmit={login}
          className="w-full max-w-md space-y-6 p-8 rounded-2xl border border-[#D7E2EA]/10 bg-[#111]"
        >
          <div>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#D7E2EA]/60 hover:text-[#D7E2EA]"
            >
              <ArrowLeft size={14} /> Back to site
            </a>
          </div>
          <h1 className="hero-heading font-black uppercase text-3xl">Admin</h1>
          <input
            data-testid={TEST_IDS.adminKeyInput}
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Admin key"
            className="w-full rounded-xl bg-transparent border border-[#D7E2EA]/20 text-[#D7E2EA] px-4 py-3 outline-none focus:border-[#D7E2EA]/50"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            data-testid={TEST_IDS.adminLogin}
            className="w-full btn-gradient text-white rounded-full py-3 font-medium"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] py-10 md:py-16 px-5 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="hero-heading font-black uppercase text-3xl md:text-5xl">
            Studio Admin
          </h1>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-xs uppercase tracking-[0.24em] text-[#D7E2EA]/60 hover:text-[#D7E2EA]"
            >
              ← Site
            </a>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#D7E2EA]/60 hover:text-[#D7E2EA]"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>

        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            <Stat label="Total events" value={summary.total_events} />
            <Stat label="Total leads" value={summary.total_contacts} />
            {summary.by_event?.slice(0, 2).map((e) => (
              <Stat key={e.event} label={e.event} value={e.count} />
            ))}
          </div>
        )}

        <section className="mb-14">
          <h2 className="text-lg font-medium mb-4">Add work item</h2>
          <form
            onSubmit={addItem}
            className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end"
          >
            <select
              value={form.card_id}
              onChange={(e) => setForm({ ...form, card_id: e.target.value })}
              className="rounded-xl bg-transparent border border-[#D7E2EA]/20 px-3 py-2.5 text-sm md:col-span-1"
            >
              {WORK_CARDS.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#111]">
                  {c.category}
                </option>
              ))}
            </select>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              className="rounded-xl bg-transparent border border-[#D7E2EA]/20 px-3 py-2.5 text-sm md:col-span-1"
            />
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="Media URL (mp4 / jpg)"
              className="rounded-xl bg-transparent border border-[#D7E2EA]/20 px-3 py-2.5 text-sm md:col-span-2"
            />
            <select
              value={form.kind}
              onChange={(e) => setForm({ ...form, kind: e.target.value })}
              className="rounded-xl bg-transparent border border-[#D7E2EA]/20 px-3 py-2.5 text-sm md:col-span-1"
            >
              <option value="video" className="bg-[#111]">
                Video
              </option>
              <option value="image" className="bg-[#111]">
                Image
              </option>
            </select>
            <button
              data-testid={TEST_IDS.adminAddItem}
              className="btn-gradient text-white rounded-full py-2.5 text-sm font-medium inline-flex items-center justify-center gap-2 md:col-span-1"
            >
              <Plus size={14} /> Add
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </section>

        <section className="mb-14">
          <h2 className="text-lg font-medium mb-4">Work items ({items.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center gap-3 rounded-xl border border-[#D7E2EA]/10 p-3"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#1a1a1a] shrink-0">
                  {it.kind === "video" ? (
                    <video src={it.url} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={it.url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{it.title}</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/50">
                    {it.card_id} · {it.kind}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(it.id)}
                  className="p-2 text-[#D7E2EA]/60 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-sm text-[#D7E2EA]/50">No items yet.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium mb-4">Leads ({contacts.length})</h2>
          <div className="space-y-3">
            {contacts.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-[#D7E2EA]/10 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {c.name}
                    {c.brand ? ` · ${c.brand}` : ""}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/50">
                    {new Date(c.created_at).toLocaleString()}
                  </p>
                </div>
                <p className="text-xs text-[#D7E2EA]/60 mt-1">{c.phone}</p>
                <p className="text-sm text-[#D7E2EA]/80 mt-2 whitespace-pre-wrap">
                  {c.message}
                </p>
              </div>
            ))}
            {contacts.length === 0 && (
              <p className="text-sm text-[#D7E2EA]/50">No leads yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-[#D7E2EA]/10 p-4">
      <p className="text-[10px] uppercase tracking-[0.24em] text-[#D7E2EA]/50">
        {label}
      </p>
      <p className="mt-1 text-2xl font-medium">{value}</p>
    </div>
  );
}
