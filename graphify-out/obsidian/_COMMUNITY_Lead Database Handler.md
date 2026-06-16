---
type: community
cohesion: 0.19
members: 20
---

# Lead Database Handler

**Cohesion:** 0.19 - loosely connected
**Members:** 20 nodes

## Members
- [[asText()]] - code - api/leads.ts
- [[buildAutoReplyHtml()]] - code - api/leads.ts
- [[buildLeadHtml()]] - code - api/leads.ts
- [[buildLeadId()]] - code - api/leads.ts
- [[escapeHtml()]] - code - api/leads.ts
- [[executeDbQuery()]] - code - api/leads.ts
- [[getSafeValue()]] - code - api/leads.ts
- [[handler()]] - code - api/leads.ts
- [[ipCache]] - code - api/leads.ts
- [[isPayload()]] - code - api/leads.ts
- [[leads.ts]] - code - api/leads.ts
- [[rateLimit()]] - code - api/leads.ts
- [[requiredFields]] - code - api/leads.ts
- [[saveLeadEventToDb()]] - code - api/leads.ts
- [[saveLeadToDb()]] - code - api/leads.ts
- [[sendAutoReplyToLead()]] - code - api/leads.ts
- [[sendLeadWebhook()]] - code - api/leads.ts
- [[sendToHubspot()]] - code - api/leads.ts
- [[sendWithResend()]] - code - api/leads.ts
- [[validate()]] - code - api/leads.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Lead_Database_Handler
SORT file.name ASC
```
