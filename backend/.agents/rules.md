# Backend Rules

1. **Routing**: Keep routes separated by domain concern. Do not bloat `server.js`.
2. **Middleware**: Always use `helmet` and `cors` for new endpoints.
3. **Async**: Do not use `Promise.then` chaining. Use `async/await` exclusively.
4. **Error Handling**: Do not swallow errors. Always pass them to a global error handler or `res.status(500)`.
