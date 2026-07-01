---
title: Always Forward Errors — Never Swallow
impact: HIGH
impactDescription: Silent failures — users receive no response, errors untracked
tags: error-handling, express, architecture
---

## Always Forward Errors — Never Swallow

Swallowed errors leave the HTTP request hanging (no response to client) and make debugging impossible. Always forward errors using `next(err)` or throw — Express 5 catches async throws automatically.

**Incorrect:**

```javascript
router.post('/contact', async (req, res) => {
  try {
    await sendEmail(req.body);
    res.json({ ok: true });
  } catch (err) {
    console.log(err); // swallowed — client hangs, no response
  }
});
```

**Correct:**

```javascript
router.post('/contact', async (req, res) => {
  await sendEmail(req.body); // Express 5: any throw goes to global error handler
  res.json({ ok: true });
});

// Global error handler in app.ts
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});
```

Reference: [Express 5 Error Handling](https://expressjs.com/en/guide/error-handling.html)
