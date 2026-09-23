## **SCOPE CHANGE — Design-Phase-Only Pivot**

**Decision:** Tasktrone v1 is scoped to design-phase workflows only. No physical production
tracking (equipment, work-in-progress batches, shop-floor stations) ships in this version.

**What this means concretely:**

- The product lifecycle this app models ends at design sign-off, not physical delivery. A
  working-draft target flow: `Concept → Detailed Design (CAD/BOM) → Internal Review →
Floor/DFM Feedback → Revision → Design Released`. **These stage names are not finalized** —
  treat this as a starting point for #48, not a locked enum.
- **`WIPBatch` and `current_station` (Machining, Welding, Assembly, Inspection, Packaging,
  Shipped) are out of scope for v1.** There's no physical batch to track a station for when
  nothing physical is being produced yet.
- **`BOMItem`, `AuditLog`, and `EngineeringComment` are unaffected, and become more central, not
  less.** A Bill of Materials, an immutable change history, and spatial floor-feedback comments
  are all design-phase artifacts already — none of them assumed physical production.
- **`ProductService`'s phase-gate logic is unaffected in shape** (BOM non-empty, budget check,
  3D-asset-present check). Only its terminal meaning changes: from "cleared for production" to
  "cleared for design release."

**Why:** physical shop-floor tracking needs real equipment/production telemetry to be a credible
model — faking it risks `WIPBatch` reading as relabeled Kanban columns rather than an actual
manufacturing system. Design collaboration + BOM management + DFM review + a release gate is an
independently coherent scope, and it's exactly where this app's strongest existing pieces (3D
model viewer, spatial `EngineeringComment`s, phase-gate logic) are already concentrated.

**Issue impact (Epic 3: Hybrid Kanban-NPI Backend milestone):**

| Issue | Title                                                                  | Disposition                                                                                                          |
| ----- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| #38   | Create WIPBatch entity, DTO, repository, and service                   | **Closed, not planned** — cut entirely                                                                               |
| #45   | Create WIPBatchController with routes for WIP CRUD and station updates | **Closed, not planned** — cut entirely                                                                               |
| #49   | Update database schema for all five new tables                         | Open, scope note added — drop the `wip_batches` table                                                                |
| #50   | Update AppModule and bootstrap() for new services/repositories         | Open, scope note added — drop WIPBatchRepository/WIPBatchService wiring                                              |
| #48   | Define current_stage and current_station enums                         | Open, scope note added — drop `CurrentStation`; `CurrentStage` needs new design-sub-phase values (not yet finalized) |
| #61   | Create comprehensive API contract tests for new endpoints              | Open, scope note added — drop `wip-batch.schema.json`                                                                |
| #65   | Build ProductDetail panel (BOM, WIP, audit, comments tabs)             | **Not yet actioned** — drop the "WIP" tab whenever frontend Tier 10 work actually starts                             |
| #67   | Create 3D model viewer (spatial comments)                              | Unaffected — becomes more central under this scope                                                                   |

**Not yet decided:** the final `CurrentStage` sub-phase values for #48, and the exact wording for
#65's tab removal (lower urgency — frontend Tier 9+ hasn't started).

**Note on the rest of this document:** the tiered plan below (Tiers 1–14, the dependency map, the
sprint plan) still refers to WIPBatch/current_station in several places (Tier 1.3, Tier 2.1,
Tier 5.3, Tier 7.1, the dependency diagram, Sprint 1/3) and hasn't been rewritten line-by-line to
match this pivot yet — that's a larger pass than this scope note covers. Read those references
in light of the table above rather than at face value until the full plan gets reconciled.

---

## **Dependency-Based Priority Matrix**

Here's the complete issue prioritization with **blocking relationships** for 57 open issues:

---

## **TIER 1: Critical Foundation (Must Complete First)**

These issues **block all downstream work**. No parallel development possible.

| Priority | Issue | Title                                                                  | Blocker For   | Est. Days |
| -------- | ----- | ---------------------------------------------------------------------- | ------------- | --------- |
| **1.1**  | #35   | Define Product entity, DTO, validation schema                          | #36, #41, #43 | 1–2       |
| **1.2**  | #37   | Create BOMItem entity, DTO, repository, service                        | #41, #44, #52 | 2–3       |
| **1.3**  | #38   | Create WIPBatch entity, DTO, repository, service                       | #45, #51      | 1–2       |
| **1.4**  | #39   | Create AuditLog entity, repository (append-only), transactional helper | #41, #42, #54 | 2–3       |
| **1.5**  | #40   | Create EngineeringComment entity, DTO, repository, service             | #47, #51      | 1–2       |
| **1.6**  | #48   | Define current_stage and current_station enums                         | #41, #81      | 0.5–1     |

**Cumulative Effort**: 8–13 days  
**Done When**: All entities, DTOs, enums, and validation schemas are defined and tested locally.  
**Go/No-Go**: Merge all into `develop` before moving to Tier 2.

---

## **TIER 2: Data Layer & Database (Sequential; depends on Tier 1)**

These create the **persistent data foundation**. Must be done before business logic.

| Priority   | Issue                        | Title                                                       | Blocker For                       | Dependencies            | Est. Days        |
| ---------- | ---------------------------- | ----------------------------------------------------------- | --------------------------------- | ----------------------- | ---------------- |
| **2.1**    | #49                          | Update database schema (migration/init) for all five tables | #36, #38, #39, #44, #45, #46, #47 | #35, #37, #38, #39, #40 | 1–2              |
| **2.2**    | #36                          | Create ProductRepository with CRUD methods                  | #41, #43, #50                     | #35, #49                | 1–2              |
| _Parallel_ | _(#37, #38, #39, #40 repos)_ | _Embedded in Tier 1 issues_                                 | —                                 | #35–#40                 | _Included above_ |

**Cumulative Effort**: 2–4 days (after Tier 1)  
**Go/No-Go**: Database migrations run locally; repositories can CRUD against test DB.

---

## **TIER 3: Core Business Logic & Transactions (Depends on Tier 2)**

This is the **engine** — phase-gate logic with atomicity & audit logging.

| Priority | Issue | Title                                               | Blocker For             | Dependencies       | Est. Days              |
| -------- | ----- | --------------------------------------------------- | ----------------------- | ------------------ | ---------------------- |
| **3.1**  | #41   | Implement ProductService with full phase-gate logic | #42, #43, #50, #52, #61 | #35, #37, #39, #49 | **3–5** ← **CRITICAL** |

**Key Requirements for #41**:

- Load BOMItems and verify non-empty for production/validation gates
- Compute Σ(quantity × unit_cost) vs `target_budget` with config-driven behavior
- Verify `active_3d_model_url` is non-null past Design
- **Wrap all checks + `repository.update()` + `AuditLog.write()` in single `DBAdapter.transaction()`**
- Throw typed errors: `PhaseGateViolationError`, `BudgetExceededError`, `MissingAssetError`
- Use `withAuditLog()` helper

**Cumulative Effort**: 3–5 days (after Tier 2)  
**Go/No-Go**: Phase-gate transitions atomic; audit log writes only on success; all three gate conditions independently testable.

---

## **TIER 4: Error Handling & Middleware (Depends on Tier 3)**

Map domain errors to HTTP responses.

| Priority | Issue | Title                                                              | Blocker For | Dependencies | Est. Days |
| -------- | ----- | ------------------------------------------------------------------ | ----------- | ------------ | --------- |
| **4.1**  | #42   | Wire phase-gate domain errors into global error-mapping middleware | #43         | #41          | 1–2       |

**Deliverables**: Global error handler intercepts `PhaseGateViolationError` → 422 Unprocessable Entity, `BudgetExceededError` → 402 Payment Required (or 400), `MissingAssetError` → 400 Bad Request.

---

## **TIER 5: API Controllers (Depends on Tier 4)**

Build HTTP endpoints consuming business logic.

| Priority | Issue | Title                                                  | Blocker For   | Dependencies  | Est. Days |
| -------- | ----- | ------------------------------------------------------ | ------------- | ------------- | --------- |
| **5.1**  | #43   | Create ProductController (CRUD + transitions)          | #61, #73, #81 | #41, #42, #49 | 2–3       |
| **5.2**  | #44   | Create BOMItemController (BOM CRUD)                    | #61, #73      | #37, #42, #49 | 1–2       |
| **5.3**  | #45   | Create WIPBatchController (WIP CRUD + station updates) | #61, #73      | #38, #42, #49 | 1–2       |
| **5.4**  | #46   | Create AuditLogController (read-only audit trails)     | #61, #73, #80 | #39, #42, #49 | 1–2       |
| **5.5**  | #47   | Create EngineeringCommentController (spatial comments) | #61, #67, #73 | #40, #42, #49 | 1–2       |

**Parallelizable**: All five controllers can be coded in parallel once #41–#42 are done.  
**Cumulative Effort**: 6–11 days (parallel).

---

## **TIER 6: Dependency Injection & Bootstrap (Depends on Tier 5)**

Wire up the application container.

| Priority | Issue | Title                                                          | Blocker For | Dependencies | Est. Days |
| -------- | ----- | -------------------------------------------------------------- | ----------- | ------------ | --------- |
| **6.1**  | #50   | Update AppModule and bootstrap() for new services/repositories | #59–#61     | #43–#47      | 0.5–1     |

**Cumulative Effort**: 0.5–1 day.

---

## **TIER 7: Backend Testing (Can start in parallel after Tier 3)**

Unit & integration tests for all layers.

| Priority | Issue | Title                                                                | Blocker For | Dependencies | Est. Days              |
| -------- | ----- | -------------------------------------------------------------------- | ----------- | ------------ | ---------------------- |
| **7.1**  | #51   | Database schema integration tests (create/transition/audit workflow) | —           | #36–#40, #49 | 2–3                    |
| **7.2**  | #52   | Phase-gate unit tests (all conditions independent)                   | —           | #41          | **2–3** ← **CRITICAL** |
| **7.3**  | #53   | BOM cost calculation unit tests and integration validation           | —           | #37, #41     | 1–2                    |
| **7.4**  | #54   | Audit-log immutability unit and integration tests                    | —           | #39, #41     | 1–2                    |
| **7.5**  | #61   | Comprehensive API contract tests for new endpoints                   | —           | #43–#47, #50 | 2–3                    |

**Parallelizable**: All can run simultaneously.  
**Cumulative Effort**: 8–13 days (parallel).  
**Gating**: Must complete #7.1–#7.4 before **Tier 9 (Frontend Testing)** for contract-driven development.

---

## **TIER 8: CI/CD & Documentation (Can run in parallel with Tier 5–7)**

Update pipelines and docs.

| Priority | Issue | Title                                                        | Blocker For | Dependencies | Est. Days |
| -------- | ----- | ------------------------------------------------------------ | ----------- | ------------ | --------- |
| **8.1**  | #58   | Update `.lintstagedrc.js` to include new server files        | #59         | #35–#47      | 0.5       |
| **8.2**  | #59   | Update CI workflow (server-lint-test.yml includes new tests) | —           | #52, #58     | 0.5–1     |
| **8.3**  | #60   | Add integration tests job to CI (main-only)                  | —           | #51, #59     | 0.5–1     |
| **8.4**  | #55   | Update server/src/db/README.md (entity patterns)             | —           | #36–#40, #49 | 0.5–1     |
| **8.5**  | #56   | Update server/README.md (factory conventions)                | —           | #52–#54      | 0.5–1     |
| **8.6**  | #57   | Update DECISION_LOG.md (Product migration strategy)          | —           | #35, #41     | 0.5–1     |

**Parallelizable**: All can run simultaneously.  
**Cumulative Effort**: 3–5 days (parallel).

---

## **TIER 9: Frontend Infrastructure (Depends on Tier 6 + early mock in Tier 7)**

Client-side setup & mocks; can start once backend API shapes are documented.

| Priority | Issue | Title                                                  | Blocker For        | Dependencies           | Est. Days                          |
| -------- | ----- | ------------------------------------------------------ | ------------------ | ---------------------- | ---------------------------------- |
| **9.1**  | #62   | Create centralized apiClient.js (axios/fetch helpers)  | #63, #73           | Backend API documented | 1–2                                |
| **9.2**  | #63   | Create ProjectContext (React Context) for state        | #64–#70, #73       | #62                    | 1–2                                |
| **9.3**  | #81   | Export CurrentStage & CurrentStation enums from server | #64, #82           | #48, #43               | 0.5                                |
| **9.4**  | #75   | Create MSW (Mock Service Worker) handlers              | #76, #77, #78, #79 | Backend API spec       | 2–3 ← **Unblock frontend testing** |
| **9.5**  | #73   | Create React Query hooks for CRUD                      | #64–#70            | #62, #63, #75          | 1–2                                |

**Cumulative Effort**: 5–9 days.  
**Go/No-Go**: Frontend can mock & test UI without backend running.

---

## **TIER 10: Frontend UI Components (Depends on Tier 9)**

Core components for product management.

| Priority | Issue | Title                                                      | Blocker For   | Dependencies       | Est. Days |
| -------- | ----- | ---------------------------------------------------------- | ------------- | ------------------ | --------- |
| **10.1** | #64   | Build Kanban board component                               | #68, #76, #79 | #63, #73, #75      | 2–3       |
| **10.2** | #65   | Build ProductDetail panel (BOM, WIP, audit, comments tabs) | #68, #77, #79 | #63, #73, #75      | 2–3       |
| **10.3** | #66   | Create BOM spreadsheet editor (live cost calculation)      | #65, #78      | #63, #73, #75      | 2–3       |
| **10.4** | #67   | Create 3D model viewer (spatial comments)                  | #65, #68, #79 | #63, #73, #75, #81 | 2–4       |
| **10.5** | #69   | Build ProductList (create/search/filter UI)                | #64, #68, #87 | #63, #73, #75      | 1–2       |
| **10.6** | #70   | Build CreateProductForm (validation + error feedback)      | #69, #90      | #63, #73, #75      | 1–2       |

**Parallelizable**: All can be coded in parallel (different feature branches).  
**Cumulative Effort**: 10–17 days (parallel).

---

## **TIER 11: Support UI Components & UX (Parallelizable with Tier 10)**

Error handling, loading, feedback.

| Priority | Issue | Title                                                  | Blocker For             | Dependencies | Est. Days |
| -------- | ----- | ------------------------------------------------------ | ----------------------- | ------------ | --------- |
| **11.1** | #71   | Implement error banner component (reason code mapping) | #64, #65, #69, #70, #79 | #62, #90     | 1         |
| **11.2** | #72   | Implement loading skeleton components                  | #64, #65, #69           | #63          | 1         |
| **11.3** | #84   | Create loading state for app bootstrap                 | #64, #82                | #63          | 1         |
| **11.4** | #85   | Implement notifications/toast system                   | #64–#70                 | #62, #71     | 1         |
| **11.5** | #87   | Build ProductSearch and ProductFilter components       | #69, #91                | #75          | 1–2       |

**Parallelizable**: All can run simultaneously.  
**Cumulative Effort**: 5–7 days (parallel).

---

## **TIER 12: Frontend Testing (Depends on Tier 10–11)**

Unit & E2E tests for client.

| Priority | Issue | Title                                               | Blocker For | Dependencies              | Est. Days                      |
| -------- | ----- | --------------------------------------------------- | ----------- | ------------------------- | ------------------------------ |
| **12.1** | #76   | Unit tests for KanbanBoard                          | —           | #64, #75                  | 1–2                            |
| **12.2** | #77   | Unit tests for ProductDetail                        | —           | #65, #75                  | 1–2                            |
| **12.3** | #78   | Unit tests for BOMEditor                            | —           | #66, #75                  | 1–2                            |
| **12.4** | #74   | Contract test suite (client/server response shapes) | —           | #75, #61                  | 2–3 ← **Gated by Backend #61** |
| **12.5** | #79   | E2E tests with Playwright (happy path)              | —           | #64–#70, #75, all Tier 10 | 2–3                            |

**Parallelizable**: #76–#78 can run in parallel with #12.4–#12.5.  
**Cumulative Effort**: 7–12 days (parallel).

---

## **TIER 13: Frontend Integration (Depends on Tier 12)**

Wire context to components, navigation, final UI polish.

| Priority | Issue | Title                                                           | Blocker For                | Dependencies       | Est. Days |
| -------- | ----- | --------------------------------------------------------------- | -------------------------- | ------------------ | --------- |
| **13.1** | #68   | Wire ProductContext to KanbanBoard & ProductDetail (happy path) | #82, #79                   | #64, #65, #63, #73 | 1–2       |
| **13.2** | #82   | Integrate React Router (multi-page navigation)                  | #79, #80, #83–#86, #89–#91 | #65, #69           | 1         |
| **13.3** | #83   | Add auth/user context (placeholder for Supabase)                | —                          | #82                | 1         |
| **13.4** | #86   | Add analytics/telemetry hooks (placeholder)                     | —                          | #82                | 0.5       |
| **13.5** | #88   | Create CSV export (future-friendly)                             | —                          | #65, #75           | 1–2       |
| **13.6** | #90   | Align apiClient errors with server contracts                    | #71                        | #62, #42, #61      | 1         |
| **13.7** | #91   | Implement responsive design & mobile tweaks                     | —                          | #64–#70            | 1–2       |

**Parallelizable**: All can run in parallel.  
**Cumulative Effort**: 6–10 days (parallel).

---

## **TIER 14: CI/CD & Documentation (Final Polish)**

Frontend pipeline & docs.

| Priority | Issue | Title                                   | Blocker For | Dependencies          | Est. Days |
| -------- | ----- | --------------------------------------- | ----------- | --------------------- | --------- |
| **14.1** | #89   | Update CI (run client lint/test on PRs) | —           | All Tier 12           | 0.5–1     |
| **14.2** | #80   | Update client/README.md (feature docs)  | —           | #64–#70, #62–#63, #73 | 0.5–1     |

**Cumulative Effort**: 1–2 days.

---

## **Critical Path Timeline**

```
Tier 1  (8–13d):   Entities & enums
  ↓
Tier 2  (2–4d):    Schema & repositories
  ↓
Tier 3  (3–5d):    ProductService + phase-gate logic ⭐ CRITICAL MILESTONE
  ↓
Tier 4  (1–2d):    Error middleware
  ↓
Tier 5  (6–11d):   Controllers (PARALLEL)
  ├─ Tier 7 (8–13d): Testing (PARALLEL)
  ├─ Tier 8 (3–5d):  CI/Docs (PARALLEL)
  └─ Tier 9 (5–9d):  Frontend setup (PARALLEL after Tier 6)
     ↓
  Tier 10 (10–17d): UI Components (PARALLEL)
  ├─ Tier 11 (5–7d): Support Components (PARALLEL)
  ├─ Tier 12 (7–12d): Testing (PARALLEL)
  └─ Tier 13 (6–10d): Integration (PARALLEL)
     ↓
  Tier 14 (1–2d):   Final CI/Docs

Total Critical Path: ~40–55 days
Total Parallel Work: ~25–35 days
```

---

## **Issue Dependency Map (Visual)**

```
┌─────────────────────────────────────────────────────────────────┐
│ TIER 1: Entities & Enums (BLOCKER)                              │
│ #35, #37, #38, #39, #40, #48                                    │
└────────────┬────────────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────────────┐
│ TIER 2: Schema & Repositories                                   │
│ #49 → #36, #37, #38, #39, #40 repos                            │
└────────────┬────────────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────────────┐
│ TIER 3: ProductService ⭐ CRITICAL                             │
│ #41 (phase-gate, transactions, audit)                           │
└────────────┬────────────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────────────┐
│ TIER 4: Error Middleware                                        │
│ #42                                                              │
└────────────┬────────────────────────────────────────────────────┘
             │
    ┌────────┴─────────┬──────────────┬─────────────────┐
    │                  │              │                 │
┌───▼────────┐  ┌─────▼──────┐  ┌────▼────────┐  ┌─────▼──────────┐
│ TIER 5:    │  │ TIER 7:    │  │ TIER 8:    │  │ TIER 9:       │
│ Controllers│  │ Testing    │  │ CI/Docs    │  │ Frontend Setup│
│ #43–#47    │  │ #51–#54,61 │  │ #55–#60    │  │ #62, #63, #75 │
│ #50        │  │            │  │            │  │ #73, #81      │
└────────────┘  └────────────┘  └────────────┘  └────────┬───────┘
                                                          │
                                    ┌─────────────────────┘
                                    │
                    ┌───────────────┴──────────────┐
                    │                              │
            ┌───────▼────────┐          ┌──────────▼──────┐
            │ TIER 10–11:    │          │ TIER 12:       │
            │ UI Components  │          │ Testing        │
            │ #64–#70, #87   │          │ #74, #76–#79   │
            │ #71–#72, #84–85│          │                │
            └───────┬────────┘          └────────────────┘
                    │                          │
                    └───────────────┬──────────┘
                                    │
                            ┌───────▼────────────┐
                            │ TIER 13:           │
                            │ Integration        │
                            │ #68, #82–#83, #86  │
                            │ #88, #90–#91       │
                            └───────┬────────────┘
                                    │
                            ┌───────▼────────────┐
                            │ TIER 14:           │
                            │ Final CI/Docs      │
                            │ #89, #80           │
                            └────────────────────┘
```

---

## **Sprint Planning (Example: 2-Week Sprints)**

### **Sprint 1 (Week 1–2): Foundation**

- Tier 1: Entities & enums (#35–#40, #48)
- Tier 2: Schema & repositories (#49, #36)

### **Sprint 2 (Week 3–4): Core Logic**

- Tier 3: ProductService (#41) ⭐
- Tier 4: Error middleware (#42)

### **Sprint 3 (Week 5–6): Backend API**

- Tier 5: Controllers (#43–#47, #50)
- Tier 7: Testing (#51–#54, #61) [parallel]
- Tier 8: CI/Docs (#55–#60) [parallel]

### **Sprint 4 (Week 7–8): Frontend Setup & Mocks**

- Tier 9: Frontend infrastructure (#62, #63, #75, #73, #81)

### **Sprint 5 (Week 9–10): Frontend UI**

- Tier 10–11: Components (#64–#72, #84–#87)
- Tier 12: Testing (#76–#79, #74) [parallel]

### **Sprint 6 (Week 11–12): Final Integration & Polish**

- Tier 13: Integration (#68, #82–#83, #86, #88, #90–#91)
- Tier 14: Docs & CI (#89, #80)

---

## **Key Insights**

1. **#41 (ProductService) is the critical path** — Everything downstream depends on its transaction & audit logic.
2. **Backend can ship Tier 1–6 independently** before frontend needs it.
3. **Frontend can mock (Tier 9–11) in parallel** with backend Tier 7–8, unblocking component development.
4. **Testing (Tier 7, 12) should run in parallel**, not sequentially.
5. **Contract tests (#61, #74) are the integration gate** — Must pass before E2E (#79).

---
