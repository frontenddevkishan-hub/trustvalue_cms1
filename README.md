# TrustValue CMS — Standalone Content & Governance Platform

A high-performance, headless Content Management System custom-engineered for **TrustValue.ai**.

It empowers editors, researchers, admins, and superadmins to manage **Sectors**, **Blogs**, **SEO metadata**, and **Governance Chains** with immediate frontend synchronization.

---

## ⚡ Features at a Glance

1. **Independent Subdomain Architecture**:
   - Ready to run locally on port `3001` or deploy directly to `cms.trustvalue.ai` / `admin.trustvalue.ai`.
   - Clean separation of concerns from the consumer-facing Next.js frontend.
2. **First-Class Sector & Blog Management**:
   - **Sectors**: Full CRUD for 18+ industry taxonomies, custom auditing attributes, and category hierarchies.
   - **Blogs**: Markdown/rich-text writing desk, sector tagging, read-time calculation, and revision tracking.
3. **Deep Built-In SEO Suite**:
   - Live Google SERP snippet simulation (Desktop & Mobile).
   - Automated SEO scoring algorithm ($0-100$) evaluating title lengths, descriptions, keywords, and headings.
   - OpenGraph and Twitter card previews.
   - Automated Schema JSON-LD generation (`Article`, `GovernmentService`, `FAQPage`).
4. **Multi-Tier Editorial Chain (RBAC)**:
   - **👑 Super Admin**: Full system control, role permissions, schema designer, webhook endpoints, audit ledger.
   - **🛡️ Admin**: Content approval, one-click production publish, SEO overrides.
   - **✍️ Editor / Researcher**: Draft authoring, content optimization, submitting for review.
5. **Headless API & Instant Sync**:
   - Strapi-like REST API endpoints (`/api/v1/sectors`, `/api/v1/blogs`).
   - Webhook-driven On-Demand Revalidation (`revalidateTag`) to keep the frontend edge cache blazing fast.
6. **Dual Storage Adapter**:
   - **File-Store Mode (Local)**: Reads and writes directly to `content/` for zero-friction local development.
   - **Database Mode (Production)**: Pluggable to PostgreSQL + Prisma / Drizzle with zero code rewrites.

---

## 🚀 Quick Start

### 1. Run in Development Mode

From the project root:
```bash
# Navigate to cms folder
cd cms

# Install dependencies (or run using workspace root)
npm install

# Start the CMS dashboard server
npm run dev
```

Visit **`http://localhost:3001`** in your browser.

### 2. Available Credentials (Demo Role Switcher)

| Role | Username | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@trustvalue.ai` | `trustvalue#2026` | Level 0 Master Control |
| **Admin** | `admin@trustvalue.ai` | `admin#2026` | Approve & Publish |
| **Editor** | `editor@trustvalue.ai` | `editor#2026` | Draft & Propose Changes |

---

## 🌐 Deploying to a Subdomain (`cms.trustvalue.ai`)

Because this folder is completely modular and self-contained:

1. **Move Folder (Optional)**:
   You can either keep `/cms` inside this monorepo or move it to a dedicated repository/public folder.
2. **Deploy on Vercel / Railway / Docker**:
   - Root Directory: `cms`
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. **Configure DNS**:
   - Add a CNAME record: `cms` pointing to your deployment target (e.g., `cname.vercel-dns.com`).
4. **Set Environment Variables**:
   ```env
   PORT=3001
   NEXT_PUBLIC_APP_ENV=production
   FRONTEND_URL=https://trustvalue.ai
   REVALIDATION_SECRET=tv_reval_secret_token_secure_9876
   JWT_SECRET=super_secret_session_jwt_key_2026
   STORAGE_DRIVER=file # or "postgres"
   ```

---

## 📂 Directory Layout

```
cms/
├── ARCHITECTURE.md          # Full system architecture & Mermaid diagrams
├── README.md                # Quickstart and subdomain deployment guide
├── package.json             # Independent package manifest
├── tsconfig.json            # Independent TypeScript configuration
├── next.config.mjs          # Standalone Next.js configuration (Port 3001)
├── app/
│   ├── globals.css          # Sleek modern dark dashboard theme
│   ├── layout.tsx           # Dashboard root wrapper
│   ├── page.tsx             # Entry redirect
│   ├── login/page.tsx       # Auth portal with fast role switcher
│   ├── dashboard/
│   │   ├── page.tsx         # Overview: Stats, publication pipeline, quick actions
│   │   ├── sectors/         # Sectors index & dynamic editor
│   │   ├── blogs/           # Research articles index & dynamic editor
│   │   ├── seo/             # Sitewide SEO manager & meta auditor
│   │   ├── chain/           # Super Admin role manager & audit log ledger
│   │   └── settings/        # Webhook targets, database config & API keys
│   └── api/
│       └── v1/              # Headless REST endpoints (Sectors, Blogs, Sync, Audit)
├── components/              # Sidebar, Header, Live SERP Inspector, Publish Bar
└── lib/                     # Types, Storage Adapter, Auth Guards, SEO Engine
```
