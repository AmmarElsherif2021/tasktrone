# Controllers

Thin HTTP layer — controllers validate the request via DTOs and delegate straight to a service.
No business logic lives here. Services are obtained from [`../bootstrap.ts`](../bootstrap.ts) via
Nest DI (see the `APP_SERVICES` factory provider in [`../app.module.ts`](../app.module.ts)), not
constructed directly by the controller.

## Routes

| Method | Path | DTO | Delegates to |
|---|---|---|---|
| `POST` | `/boards` | `CreateBoardDto` | `BoardService.createBoard` |
| `GET` | `/boards/:id` | — | `BoardService.getBoardById` |
| `POST` | `/tasks` | `CreateTaskDto` | `TaskService.createTask` |
| `GET` | `/tasks?boardId=` | `ListTasksQueryDto` (query) | `TaskService.getTasksByBoard` |
| `PATCH` | `/tasks/:id` | `UpdateTaskDto` | `TaskService.updateTask` |

## Validation

A global `ValidationPipe` ([`../main.ts`](../main.ts): `whitelist: true, transform: true,
forbidNonWhitelisted: true`) validates every `@Body()`/`@Query()` DTO. A failed validation
returns a consistent `400`:

```json
{ "statusCode": 400, "message": ["title should not be empty"], "error": "Bad Request" }
```

## Domain errors

`TaskService`/`BoardService` throw plain `NotFoundError`/`ValidationError`
([`../errors/domain-errors.ts`](../errors/domain-errors.ts)) for domain-level failures (e.g. "board
not found"). A global exception filter maps these to `404`/`400` with the same JSON shape DTO
validation errors use — see [`../errors/README.md`](../errors/README.md) for the full mapping.
Controllers don't catch these themselves; they just let them propagate.
