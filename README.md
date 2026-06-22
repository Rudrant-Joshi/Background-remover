# SnapCut AI — Production Ready Background Removal SaaS

SnapCut AI is a high-performance background removal SaaS platform. It leverages a serverless design utilizing n8n cloud webhook pipelines to request AI background removals, Supabase for authentication and profile quotas, and temporary Cloudinary buckets.

## Tech Stack Overview

- **Frontend**: React (Vite), JavaScript, Tailwind CSS.
- **Database & Auth**: Supabase Cloud (PostgreSQL + RLS policies).
- **Backend Orchestrations**: n8n Webhook workflow engine.
- **Image CDN Storage**: Cloudinary (auto-delete tags enabled).
- **Payments Gateway**: Razorpay (Orders API & signature verification callbacks).

---

## Installation & Setup

1. **Scaffold Local Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment variables**:
   Duplicate `.env.example` to `.env` and fill out client configuration values:
   ```bash
   cp .env.example .env
   ```

3. **Install Supabase Tables**:
   Copy the content of `supabase/schema.sql` and run it in the SQL editor of your Supabase dashboard workspace.

4. **Import n8n Webhook Pipelines**:
   Load the template workflow export from `n8n/workflows.json` into your n8n workspace dashboard.

5. **Start Dev Server**:
   ```bash
   npm run dev
   ```
