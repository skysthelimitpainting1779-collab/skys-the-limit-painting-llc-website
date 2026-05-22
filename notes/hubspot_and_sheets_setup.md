# HubSpot and Google Sheets Integration Guide 🧬

This document details the configuration for routing leads from social media channels and the website contact form into **HubSpot CRM** and a master backup **Google Sheet** (connected via Composio connection `googlesheets_mensal-unpure`).

---

## 1. HubSpot Welcome List Configuration 🧬

### A. Dynamic List: "New Twin Cities Prospects"
- **Filter Criteria**:
  * `Contact Property: Lead Source` = "Website Form" OR "Facebook Lead Ad" OR "Instagram DM"
  * `Contact Property: State` = "MN" (Minnesota)
  * `Contact Property: Status` = "New" OR "Contacted"
- **Properties Requested**:
  * First Name, Last Name
  * Email, Phone Number
  * Service Type (Residential, Commercial, Striping)
  * City (Twin Cities Metro Area)

---

## 2. Automated Responder Email Template 🧬

### Subject Line: Your Twin Cities Painting Project — Sky's the Limit Painting LLC

```
Hi {{contact.firstname}},

Thank you for reaching out to Sky's the Limit Painting LLC! We've received your request for a painting and coatings estimate in {{contact.city}}.

We pride ourselves on professional execution, beautiful finishes, and absolute accountability:
- Meticulous surface prep and clean lines.
- Certificate of Insurance (COI) available instantly upon request.
- Fully insured and verified operations.

One of our project managers will call or email you within 2 business hours to schedule your site walkthrough or collect bid details.

To help us prepare, you can reply to this email with:
1. Photos of the areas/surfaces to be painted.
2. Your target dates for project completion.

We look forward to helping you transform and protect your property!

Best regards,

Johnny Blotto
Sky's the Limit Painting LLC
Minneapolis & St. Paul Metro Area
```

---

## 3. Google Sheets Integration Map 🧬
Every lead routed through the website form or Facebook lead capture will automatically populate a new row in Google Sheet `Skys_The_Limit_Painting_Leads` via the Composio integration.

### Column Mapping:
1. **Timestamp**: Date/time lead captured
2. **First Name**: `{{contact.firstname}}`
3. **Last Name**: `{{contact.lastname}}`
4. **Email**: `{{contact.email}}`
5. **Phone**: `{{contact.phone}}`
6. **City**: `{{contact.city}}`
7. **Service**: `{{contact.service_type}}`
8. **Notes**: Initial project description
9. **Status**: Set defaults to "New"
