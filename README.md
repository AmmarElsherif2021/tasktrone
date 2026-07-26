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


- This version presents Tasktrone as a production-ready manufacturing SaaS solution, with clear business value, professional tone, and subtle but compelling technical depth — no explicit recruiter mentions, just a confident product story.

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

Tasktrone is built as a **multi‑tenant SaaS** from day one:

- **React** frontend with real‑time drag‑and‑drop Kanban.
- **Node.js** backend with strict service/repository layers.
- **PostgreSQL (Supabase)** as the single source of truth — enums, JSONB, row‑level security.
- **Supabase Realtime** pushes board updates, comments, and QC results to all connected clients instantly.
- **Abstract role & phase model** mapped to concrete manufacturing labels — the same core can later serve construction/MEP without a rewrite.

*We designed it as if an external auditor would review the codebase. Audit trail, role enforcement, and data isolation are not afterthoughts — they’re the foundation.*

---

## Getting started

```bash
git clone https://github.com/your-org/tasktrone.git
cd tasktrone
npm install
cp .env.example .env   # add Supabase project credentials
npm run dev
```

Database schema and RLS policies are managed through Supabase migrations.

---

## Roadmap

| Phase | Delivery |
|-------|----------|
| **Current** | Core manufacturing task model, Kanban boards, RBAC, audit trail, equipment tracking. |
| **Q3 2026** | AI‑powered task generation from CAD/BOM documents, natural language “What’s blocking production?” assistant. |
| **Q4 2026** | ETL pipeline → analytics dashboard with lead time, throughput, and defect‑rate trends. |
| **2027** | Construction / MEP vertical — same platform, different labels. |

---

## License

MIT © Tasktrone Contributors

---

