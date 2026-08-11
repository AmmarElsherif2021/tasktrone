# Domain

Plain TypeScript entities and DTOs — no ORM decorators, no framework coupling. Entities describe
what's persisted; DTOs describe what the HTTP API accepts and are validated with `class-validator`.

## Entities

| File | Fields |
|---|---|
| [`task.entity.ts`](./task.entity.ts) | `id`, `boardId`, `title`, `description?`, `status` (`todo` \| `in_progress` \| `review` \| `done`), `position3d?` (`{x,y,z}`), `modelRef?`, `createdAt`, `updatedAt` |
| [`board.entity.ts`](./board.entity.ts) | `id`, `organizationId`, `name`, `createdAt`, `updatedAt` |
| [`user.entity.ts`](./user.entity.ts) | `id`, `organizationId`, `email`, `displayName`, `role` (`admin` \| `member` \| `viewer`), `createdAt` |

`position3d` (or, alternatively, a `modelRef` pointing at a CAD/3D asset) is what the 3D board
prototype (Epic 3) renders a task's location from.

## DTOs (`./dto`)

Each write operation has its own DTO validated via `class-validator` (`@Type()` + `ValidateNested()`
handles the nested `position3d` object):

- `CreateTaskDto` / `UpdateTaskDto` — includes optional `position3d`
- `CreateBoardDto` / `UpdateBoardDto`
- `CreateUserDto`

These aren't wired into any HTTP routes yet — that lands with the Thin HTTP API task, which will
apply Nest's `ValidationPipe` using these classes.
