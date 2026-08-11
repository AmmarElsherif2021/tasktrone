# Services

Business logic and use-cases. Each service takes repository instances (not adapters, not `pg`) in
its constructor, so unit tests mock the repository interfaces directly — no database involved.

## TaskService ([`TaskService.ts`](./TaskService.ts))

- `createTask` — rejects a blank title; rejects if `boardId` doesn't resolve to an existing board
  (cross-checks via `BoardRepository`); defaults `position3d` to `{x:0,y:0,z:0}` when omitted, so the
  3D board prototype (Epic 3) always has a placement to render rather than `null`.
- `getTaskById` / `getTasksByBoard` — `getTaskById` throws `NotFoundError` when missing.
- `updateTask` — enforces the task status state machine (`todo → in_progress → review → done`, with
  `review`/`in_progress` allowed to step back); an invalid transition throws `ValidationError`.

## BoardService ([`BoardService.ts`](./BoardService.ts))

- `createBoard` — rejects a blank name.
- `getBoardById` / `getBoardsByOrganization` — `getBoardById` throws `NotFoundError` when missing.
- `updateBoard` — throws `NotFoundError` if the board doesn't exist before attempting the write.

## Errors

Both throw the plain (framework-agnostic) errors in [`../errors/domain-errors.ts`](../errors/domain-errors.ts):
`NotFoundError` and `ValidationError`. Neither service knows about HTTP — status-code mapping is the
HTTP layer's job (global error mapping middleware, Epic 1).
