# API Directory Context

**Directory Path:** `api/`  
**Purpose:** Vercel serverless endpoint layer for lead capture, chatbot handoff, email delivery, CRM delivery, and webhook fanout.

> [!NOTE]
> ### 🧬 LLM CHEAT SHEET: API ENDPOINT QUICK REFERENCE
> *   `leads.ts` — Primary website lead endpoint for estimate requests submitted from the React lead form.
> *   `manychat.ts` — ManyChat webhook endpoint for Facebook/Instagram chatbot leads.
> *   Both handlers support Resend email delivery, optional lead webhooks, and HubSpot Forms API delivery when environment variables are configured.

---

## Functional Roles

*   **leads.ts** — Validates public website lead payloads, generates a lead ID, dispatches via Resend, optional webhook, and HubSpot, then returns delivery status.
*   **manychat.ts** — Normalizes ManyChat custom fields into the same lead shape, requires either phone or email, then dispatches through the same delivery channels.

## Reality Notes

*   These endpoints are deployed by Vercel from the `website/api/` directory.
*   Delivery depends on environment variables such as `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`, `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_SECRET`, and `HUBSPOT_FORM_ID`.
*   Never commit live secret values. Use local `.env` files and platform environment variables.

