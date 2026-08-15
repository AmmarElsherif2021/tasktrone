# Tasktrone

> **Production Kanban for modern manufacturing.**
> Give your shop floor the visibility, control, and compliance it deserves — without adding process overhead.

---

## The problem

Assembly lines lose **10–20 % of total cycle time** to invisible bottlenecks, unplanned rework loops and untracked machine utilisation.  
Spreadsheets and generic project tools can’t enforce WIP limits, trace quality decisions, or keep equipment history — so you keep losing hours you can’t get back.

---

## The solution

Tasktrone is a **purpose‑built Kanban system for discrete manufacturing**.  
It brings lean manufacturing principles directly into your browser:

- **Phase‑scoped boards** mirror your actual production stages (Raw Materials → Production → QC → Packaging → Shipped).
- **WIP limits** at board and column level prevent overloading and highlight constraints.
- **Quality gatekeeping** with pass/fail authority, mandatory justifications, and automated rework loops.
- **Equipment registry & usage logging** turns every machine into a trackable resource.
- **Immutable audit trail** logs every field change — ready for ISO 27001 / SOC 2 evidence.
- **Role‑based access control** ensures welders only see welding tasks and inspectors only see QC checklists.

The result: you stop fire‑fighting and start **managing by data**.

*Tasktrone was built for engineers who understand that a factory workflow is not a software sprint, it’s a physical system that deserves industrial‑grade digital tooling.*

---

## Why manufacturers choose Tasktrone

| Capability | Business impact |
|------------|------------------|
| **Real‑time Kanban with WIP enforcement** | Reduces lead time by surfacing bottlenecks before they delay shipments. |
| **Structured quality checks** | Lowers defect rate by making inspections mandatory, traceable, and un‑skippable. |
| **Equipment tracking & utilisation** | Eliminates idle‑machine blindness — know exactly which assets are working, waiting, or down. |
| **Full audit trail (`task_history`)** | Satisfies customer audits and regulatory reviews with a single click. |
| **Multi‑team, multi‑phase workflows** | Keeps design, production, QC, and logistics aligned on one platform — no more tribal knowledge. |
| **Enterprise‑grade security** | Row‑Level Security isolates tenant data; RBAC restricts actions to authorised roles only. |

---

## See it in action

> **Live demo is being prepared.**
> Below: a glimpse of the phase‑scoped board with WIP counters and swimlanes.

![Tasktrone board mockup](https://via.placeholder.com/800x400?text=Tasktrone+Production+Board)

---

## Under the hood (for your tech team)

Tasktrone is designed as a **multi‑tenant SaaS** from day one:

- **React** frontend (Vite, React Router, TanStack Query) with drag‑and‑drop Kanban boards — built and working today.
- **Node.js (NestJS) backend** (`server/`) with a hexagonal adapter/repository/service layering over Postgres — implemented for tasks and boards: `POST/GET /boards`, `POST/GET/PATCH /tasks`, with DTO validation and consistent error responses. See [server/README.md](server/README.md) for how to run it and [DECISION_LOG.md](DECISION_LOG.md) for why it's built this way.
- **PostgreSQL (Supabase)** still backs everything else — auth, project details, posts, users — while that part of the client is incrementally migrated onto the new backend. The frontend talks to both today; see [DECISION_LOG.md](DECISION_LOG.md#5-incremental-migration-new-backend-owns-tasksboards-supabase-keeps-everything-else) for the split.
- **Abstract role & phase model** mapped to concrete manufacturing labels — the same core can later serve construction/MEP without a rewrite.

Audit trail, RBAC enforcement, and the manufacturing‑specific domain model (phases, WIP limits, QC gates, equipment registry) described above are still the direction the product is heading, not shipped functionality yet — the current backend covers only the Task/Board/User foundation.

---

## Getting started

```bash
git clone https://github.com/AmmarElsherif2021/tasktrone.git
cd tasktrone/client
npm install
cp .env.example .env   # add your Supabase project credentials
npm run dev
```

The `server/` package (NestJS backend) is not yet implemented — the frontend currently talks to Supabase directly. Database schema and RLS policies are managed through Supabase migrations.

---

## Roadmap

| Phase | Delivery |
|-------|----------|
| **Current** | Project/task Kanban boards, auth, and activity feed on React + Supabase. |
| **Next** | NestJS backend (`server/`), manufacturing domain model (phases, WIP limits), RBAC, audit trail, equipment tracking. |
| **Later** | AI‑powered task generation from CAD/BOM documents, natural‑language “What’s blocking production?” assistant, analytics dashboard. |
| **Long‑term** | Construction / MEP vertical — same platform, different labels. |

---

## License

MIT © Tasktrone Contributors

---

