# Domain

Plain TypeScript entities and DTOs — no ORM decorators, no framework coupling. Entities describe
what's persisted; DTOs describe what the HTTP API accepts and are validated with `class-validator`.

## Entities

| File                                         | Fields                                                                                                                                                                                                                                                                                                          |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`task.entity.ts`](./task.entity.ts)         | `id`, `boardId`, `title`, `description?`, `status` (`todo` \| `in_progress` \| `review` \| `done`), `position3d?` (`{x,y,z}`), `modelRef?`, `createdAt`, `updatedAt`                                                                                                                                            |
| [`board.entity.ts`](./board.entity.ts)       | `id`, `organizationId`, `name`, `createdAt`, `updatedAt`                                                                                                                                                                                                                                                        |
| [`user.entity.ts`](./user.entity.ts)         | `id`, `organizationId`, `email`, `displayName`, `role` (`admin` \| `member` \| `viewer`), `createdAt`                                                                                                                                                                                                           |
| [`product.entity.ts`](./product.entity.ts)   | `id`, `boardId`, `name`, `skuName`, `description?`, `currentStage` (`draft` \| `in-progress` \| `completed` \| `archived`), `active_3d_model_url?` (nullable URL), `targetBudget?` (non-negative decimal), `ownerId?`, `version?`, `archivedAt?` (nullable timestamp for soft delete), `createdAt`, `updatedAt` |
| [`bom-item.entity.ts`](./bom-item.entity.ts) | `id`, `productId` (FK to `Product`), `partNumber`, `name`, `quantity` (non-negative integer), `unitCost?` (non-negative decimal), `totalPrice?` (= `quantity × unitCost`), `createdAt`, `updatedAt`                                                                                                             |

`position3d` (or, alternatively, a `modelRef` pointing at a CAD/3D asset) is what the 3D board
prototype (Epic 3) renders a task's location from. `active_3d_model_url` plays the same role for
products — it points at the 3D asset the board renders for a given product.

`PRODUCT_STAGES` (`["draft", "in-progress", "completed", "archived"]`) is exported from
`product.entity.ts` as a `const` tuple, with `ProductStage` derived from it via
`(typeof PRODUCT_STAGES)[number]`. Both product DTOs below reference it for `@IsIn(...)`
validation, so the allowed stages live in exactly one place.

A `BomItem` is one line entry in a `Product`'s Bill of Materials — a required component or
material, with a quantity and unit cost. It isn't cosmetic data: it's what `ProductService`'s
phase-gate logic (issue #41) reads to block a stage transition unless a product's BOM is
non-empty, and to compute `Σ(quantity × unitCost)` against the product's `targetBudget`, raising
`BudgetExceededError` when it's over. So a `BomItem` is both a completeness gate and a cost-control
unit as a product moves through Kanban stages.

## DTOs (`./dto`)

Each write operation has its own DTO validated via `class-validator` (`@Type()` + `ValidateNested()`
handles the nested `position3d` object, and `@Transform()` coerces decimal strings like `"44.06"`
into numbers for `targetBudget`):

- `CreateTaskDto` / `UpdateTaskDto` — includes optional `position3d`
- `CreateBoardDto` / `UpdateBoardDto`
- `CreateUserDto`
- `CreateProductDto` — requires `boardId`, `name`, `skuName`; optional `description`,
  `currentStage`, `active_3d_model_url`, `targetBudget` (`@IsNumber()` + `@Min(0)`),
  `ownerId`
- `UpdateProductDto` — all fields optional **except** `updatedAt` (required `Date`, used for
  optimistic concurrency); mirrors `CreateProductDto` and adds `version` and `archivedAt`
- `CreateBOMItemDTO` — requires `productId`, `partNumber` (max 50 chars), `name` (max 50 chars),
  `quantity` (`@Min(0)`); optional `unitCost`, `totalPrice`
- `UpdateBOMItemDTO` — requires `productId` (a BOM item update is still scoped to the product it
  belongs to — it isn't reassignable between products via this DTO); `name`, `quantity`,
  `unitCost`, `totalPrice` are optional

These aren't wired into any HTTP routes yet — that lands with the Thin HTTP API task, which will
apply Nest's `ValidationPipe` using these classes.
