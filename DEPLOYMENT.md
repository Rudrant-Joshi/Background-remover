# SnapCut AI — Commercial Deployment Guide

Follow this guide to host SnapCut AI on production architectures.

---

## 1. Cloudinary Asset Settings

Configure Cloudinary temp presets to delete raw assets automatically:

1. Sign in to your **Cloudinary Console**.
2. Go to **Settings** → **Upload Preset**.
3. Create an unsigned upload preset named `snapcut_temp`.
4. Under **Upload Transformations & Tags**, add the tags `temp` and `original`.
5. Create a clean-up rule or use the **n8n clean-up CRON job** to delete images tagged `temp` older than 24 hours.

---

## 2. Supabase Settings

Enable row-level security (RLS) policies by executing `supabase/schema.sql`.

* Ensure Google OAuth redirects are correctly white-listed in the **Authentication** settings pointing to your live production domain (e.g. `https://snapcut.ai/dashboard`).

---

## 3. Razorpay Gateway Setup

1. Log into your **Razorpay Dashboard**.
2. Navigate to **API Keys** and generate production credentials (Key ID and Secret Key).
3. Set up a webhook pointing to your n8n payment event listener:
   * **Webhook URL**: `https://your-n8n.cloud/webhook/razorpay-payment`
   * **Active Events**: `payment.authorized`, `order.paid`, `subscription.activated`.
   * **Secret**: Add a secure webhook secret key and verify signature check headers on n8n callbacks.

---

## 4. n8n workflow deployment

Ensure the webhook triggers are set to **Active** inside n8n. Provide the correct environment values for database queries:
* `SUPABASE_URL`
* `SUPABASE_SERVICE_ROLE_KEY`
* `REMOVEBG_API_KEY`
* `CLOUDINARY_API_KEY`
* `CLOUDINARY_API_SECRET`
