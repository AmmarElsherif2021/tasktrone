# Errors

Plain domain errors ([`domain-errors.ts`](./domain-errors.ts)) that services throw, and the global
Nest exception filter ([`domain-error.filter.ts`](./domain-error.filter.ts)) that maps them to HTTP
responses. Registered globally in [`../main.ts`](../main.ts) via `app.useGlobalFilters(...)`.

## Response shape

Every error response — domain error, DTO validation failure, or an unexpected exception — has the
same shape:

```json
{ "statusCode": 400, "error": "Bad Request", "message": "Title is required" }
```

`message` is a string for domain/generic errors, or an array of strings for DTO validation errors
(one entry per failed field — that's Nest's `ValidationPipe` default, left untouched).

## Mapping

| Thrown | Status | `error` |
|---|---|---|
| `NotFoundError` | 404 | `Not Found` |
| `ValidationError` | 400 | `Bad Request` |
| DTO validation failure (`ValidationPipe`) | 400 | `Bad Request` |
| anything else | 500 | `Internal Server Error` |

`DomainErrorFilter` is scoped to `@Catch(NotFoundError, ValidationError)` — it only maps those two,
deliberately leaving Nest's own `HttpException`s (from `ValidationPipe`) and truly unexpected errors
to Nest's default exception filter, which already produces a consistent 400/500 shape. This avoids
reimplementing Nest's built-in exception handling.

Controllers never catch these errors themselves — they let them propagate from the service, and the
filter does the mapping. That's what "controllers don't duplicate mapping logic" means in practice.
