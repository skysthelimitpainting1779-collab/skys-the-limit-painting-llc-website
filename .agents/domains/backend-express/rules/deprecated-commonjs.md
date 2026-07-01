---
title: No CommonJS require() — Use ESM import
impact: CRITICAL
impactDescription: Runtime crash — project is "type":"module" in package.json
tags: esm, commonjs, deprecated, imports
---

## No CommonJS require() — Use ESM import

This project sets `"type": "module"` in `package.json`. Using `require()` causes an immediate runtime crash: `Error [ERR_REQUIRE_ESM]`.

**Incorrect:**

```javascript
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
module.exports = router;
```

**Correct:**

```javascript
import express from 'express';
import { createClient } from '@supabase/supabase-js';
export default router;
```

Reference: [Node.js ESM docs](https://nodejs.org/api/esm.html)
