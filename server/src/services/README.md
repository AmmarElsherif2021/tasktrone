# Services

Business logic and use-cases for Tasktrone, a production Kanban system for modern
manufacturing. Each service takes repository instances (not adapters, not `pg`) in its
constructor, so unit tests mock the repository interfaces directly — no database involved.

The service layer spans two domains:

- **Task board** (`BoardService`, `TaskService`) — the original Kanban board/task layer, with
  3D placement metadata for the board visualization prototype.
- **Manufacturing (NPI)** (`ProductService`, `BOMItemService`) — the Product/BOM domain that
  enforces the business rules a manufacturing line actually needs: a product can't be pushed
  into production without a costed bill of materials, and can't reach manufacturing without a
  validated design asset.

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

## ProductService ([`ProductService.ts`](./ProductService.ts))

A `Product` represents an item moving through Tasktrone's manufacturing pipeline — from design
through development, manufacturing, quality, and shipping (`current_stage`). This service owns
the CRUD lifecycle for that record.

- `createProduct` — requires `boardId`, `name`, and `skuName`; a product is always scoped to a
  board so it stays visible on the Kanban view it belongs to.
- `findProductById` / `findProductsByBoard` — `findProductById` throws `NotFoundError` when
  missing; `findProductsByBoard` surfaces every product a board owns.
- `updateProduct` — confirms the product exists before writing, so a caller gets a clean
  `NotFoundError` rather than a silent no-op.
- `deleteProduct` — throws `NotFoundError` if there's nothing to delete.

**Not yet wired into this file:** the phase-gate logic that is Tier 3 of Epic 3 — blocking a
stage transition unless the BOM is non-empty and `Σ(quantity × unit_cost)` is within the
product's `target_budget`, and blocking manufacturing entry unless `active_3d_model_url` is set.
That logic runs inside a single `DBAdapter.transaction()` alongside the repository update and the
`AuditLog` write, and raises `PhaseGateViolationError`, `BudgetExceededError`/`BomEmptyError`, or
`MissingAssetError`. Track it against Tier 3 rather than assuming it's covered by the methods
above.

## BOMItemService ([`BOMItemService.ts`](./BOMItemService.ts))

A `BOMItem` is one line entry in a `Product`'s Bill of Materials — a required component or
material, with a quantity and a unit cost. This service is what turns a BOM from a list of parts
into the number the phase gate checks against a product's budget.

- `createBOMItem` — requires `name`, `partNumber`, and `productId`.
- `findBOMItenById` / `findBOMItemsByProduct` — `findBOMItenById` throws `NotFoundError` when
  missing; `findBOMItemsByProduct` returns every line item for a product's BOM.
- `getCumulativeCost` — sums `totalPrice` across a product's BOM items; this is the figure
  `ProductService`'s phase gate checks against `target_budget`, and it's exposed directly via
  `GET /products/:productId/bom/total`. Throws `ValidationError` if any line item is missing
  `totalPrice`, since an incomplete BOM can't be trusted for a budget decision.
- `updateBOMItem` — confirms the item exists before writing.
- `deleteBOMItem` — throws `NotFoundError` if there's nothing to delete.

## Errors

All four services throw the plain (framework-agnostic) errors in
[`../errors/domain-errors.ts`](../errors/domain-errors.ts): `NotFoundError` and `ValidationError`.
None of the services know about HTTP — status-code mapping is the HTTP layer's job (global error
mapping middleware, Epic 1). Manufacturing-specific errors (`PhaseGateViolationError`,
`BudgetExceededError`, `BomEmptyError`, `MissingAssetError`) belong to the phase-gate logic noted
above and aren't raised by the services as currently written.
