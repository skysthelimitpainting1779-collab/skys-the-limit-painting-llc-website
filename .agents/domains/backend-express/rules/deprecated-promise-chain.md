---
title: No Promise Chaining — Use async/await
impact: CRITICAL
impactDescription: Error propagation failures, unhandled rejections
tags: async, promises, deprecated, error-handling
---

## No Promise Chaining — Use async/await

`.then()/.catch()` chaining leads to inconsistent error propagation and fails to forward errors to Express's global error handler. Express 5 is designed for `async/await`.

**Incorrect:**

```javascript
router.get('/user/:id', (req, res, next) => {
  getUser(req.params.id)
    .then(user => res.json(user))
    .catch(err => next(err));
});
```

**Correct:**

```javascript
router.get('/user/:id', async (req, res) => {
  const user = await getUser(req.params.id); // Express 5 catches throws automatically
  res.json(user);
});
```

Reference: [Express 5 async error handling](https://expressjs.com/en/guide/error-handling.html)
