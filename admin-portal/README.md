# Tanmay Visuals — Admin Studio Portal 🎬

A standalone content management portal built for Tanmay to upload, manage, reorder, and update work videos and their split-panel project descriptions on his live portfolio website.

---

## ✨ Features

- **Direct Cloudinary Video Upload**: Drag & drop `.mp4`, `.mov`, `.webm` videos straight to Cloudinary's fast streaming CDN with live 0% → 100% progress tracking.
- **Split-Panel "Know More" Descriptions**: Add rich descriptions of Tanmay's on-set role, client context, and custom links (Instagram/YouTube) that show up in the live website's fullscreen viewer.
- **Collection Categorization**: Organize videos into:
  - `01 · Brand Campaigns` (Himalaya, AMD, Lenovo, Arpanvester, etc.)
  - `02 · Growth & Strategy` (Cafes, Bakeries, Real Estate, Viral Content)
  - `03 · Video Editing` (Spotify, Spiderman, Party, etc.)
- **Interactive Video Preview**: Hover or click to preview any video right in the dashboard.
- **Reorder & Reposition**: Move videos up/down to change their exact order in the portfolio grid.
- **Secure Access**: Protected with Tanmay's studio admin key (`tanmay-admin-2026`).

---

## 🚀 Quick Start (Local Development)

```bash
cd admin-portal
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## ☁️ Cloudinary Free Setup (Takes 2 minutes)

1. Sign up for a free account at [cloudinary.com](https://cloudinary.com).
2. Go to **Settings** (gear icon) → **Upload**.
3. Scroll down to **Upload presets** and click **Add upload preset**.
4. Set **Signing Mode** to **Unsigned**.
5. Give it a name (e.g., `tanmay_portfolio`) and click **Save**.
6. In the Admin Portal, click the **Settings** gear icon and enter:
   - **Cloud Name**: (Found in your Cloudinary Dashboard)
   - **Upload Preset**: `tanmay_portfolio`
7. Click **Save Configuration**. You're done! Now you can drag and drop videos up to 100MB+ directly into the portal.

---

## 🌐 Deploy to Vercel (Independent Website)

To deploy this admin portal as a separate website (e.g., `https://tanmay-admin.vercel.app`):

### Option A: Via Vercel CLI
```bash
cd admin-portal
vercel --prod
```

### Option B: Push to a New GitHub Repo
```bash
cd admin-portal
git init
git add .
git commit -m "Initial commit of Tanmay Admin Portal"
gh repo create tanmay-admin --public --source=. --remote=origin --push
```
Then import the repository on [vercel.com](https://vercel.com) and deploy!
