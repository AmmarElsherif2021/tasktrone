# Tasktrone

> **AI-powered workflow & analytics platform for industrial operations.**

Tasktrone is a production-grade task management and process intelligence system purpose-built for high-complexity operational environments — starting with **mechanical assembly manufacturing** and extending to **construction & MEP** workflows. It goes beyond kanban by combining structured task orchestration, domain-aware role management, equipment tracking, quality control, and a data layer designed for AI and analytics.

---

## Why Tasktrone

Most workflow tools are built for software teams. Tasktrone is built for the factory floor — where tasks span multiple engineering disciplines, documents carry regulatory weight, machines are first-class entities, and a missed dependency can halt an entire production line.

**Key differentiators:**

- Domain-specific task model (manufacturing phases, QC checks, equipment usage, BOM-linked workflows)
- Multi-level access control (system roles + project roles + task roles)
- Full audit trail via immutable `task_history` — every field change is recorded
- Rich dependency graph (finish-to-start, lag time) and subtask hierarchies
- Metrics schema designed for ETL pipelines and analytics dashboards
- Architecture prepared for AI integration (LLM task generation, document parsing, workflow assistant)

---

## Use Cases

### Manufacturing — Mechanical Assembly

Manage the full machine lifecycle from concept design through shipping and maintenance. Teams across design, CNC programming, machining, QC, inventory, and logistics collaborate on a shared task graph, with each role receiving scoped views, file requirements, and phase-appropriate workflows.

### Construction & MEP (Mechanical, Electrical, Plumbing)

Apply the same phase-driven task model to MEP project delivery — from design coordination and permit documentation through installation, commissioning, and handover. The domain model maps cleanly: phases become project stages, manufacturing roles map to trade disciplines, and QC checks become inspection milestones.

---

## Core Features

### Task Management

Every task in Tasktrone is a rich domain object — not just a card with a title.

| Capability | Detail |
|---|---|
| Unique task numbering | Human-readable `task_number` per task |
| Phase tagging | Tasks are scoped to a `manufacturing_phase` enum |
| Priority & status | `high / medium / low` priority; configurable status lifecycle |
| Time tracking | `estimated_hours`, `actual_hours`, `start_date`, `due_date`, `completion_date` |
| Cycle & lead time | `cycle_time` and `lead_time` stored per task for analytics |
| Multi-member assignment | Primary assignee + additional members via `task_members`, each with a scoped `task_assignment_role` |
| Subtask hierarchies | Self-referencing `parent_task_id` for unlimited depth |
| Task requirements | Per-task checklist of mandatory/optional deliverables with file-type enforcement |
| Dependency graph | `task_dependencies` table: predecessor/successor pairs with `dependency_type` and `lag_time` |
| Audit trail | `task_history` logs every field change (old value, new value, who, when) |
| File attachments | Versioned attachments linkable to a task, project, or specific requirement |

**Task categories:** Design · Manufacturing operations · Quality control · Maintenance · Inventory · Logistics

### Manufacturing Phases

Each project tracks its active `current_phase`. Boards and tasks are scoped to a phase, enabling phase-based filtering, reporting, and handoff workflows.

| # | Phase | Primary Teams |
|---|---|---|
| 1 | Concept & Design | Design Engineers, CAD Technicians |
| 2 | Prototyping | Manufacturing Engineers, CNC Programmers, Machinists, QC Inspectors |
| 3 | Pre-Production Planning | Production Planners, Inventory Managers, Supervisors |
| 4 | Production | Machine Operators, Supervisors, QC Inspectors |
| 5 | Quality Control | QC Inspectors, Metrology Engineers |
| 6 | Assembly & Testing | Assembly Technicians, Test Engineers |
| 7 | Packaging & Shipping | Logistics Coordinators, Inventory Managers |
| 8 | Maintenance & Support | Maintenance Technicians, Support Teams |

### Kanban Boards

Boards are phase-scoped visual workspaces with production-grade controls:

- **WIP limits** enforced at both board level and individual column level
- **Swimlanes** for team/category separation (custom JSONB criteria, color, position)
- **Standard column types**: `todo → in_progress → review → done` + custom columns
- **Column ordering** via explicit `position` field
- **Drag-and-drop card placement** with `position` tracking within columns
- **Comments** with `@mention` support (stored as `mentioned_users uuid[]`)

### User Roles & Teams

Role assignment happens at three independent levels:

| Level | Table | Enum |
|---|---|---|
| System-wide role | `users.role` | `user_role` |
| Team membership | `users.team` | `team_type` |
| Project-level role | `project_members.role` | `project_member_role` |
| Task-level role | `task_members.role` | `task_assignment_role` |

**Teams:** Design · Manufacturing · Quality Control · Inventory · Planning · Maintenance · HR · Logistics

### Equipment & Quality Tracking

Equipment is a first-class entity in Tasktrone — not an afterthought.

**Equipment registry (`equipment` table):** Tracks serial number, operational status, last/next maintenance timestamps.

**Task-equipment usage (`task_equipment`):** Per-task equipment logs with `start_time`, `end_time`, `setup_time`, `run_time` — the raw data for utilization analytics.

**Quality checks (`quality_checks`):** Linked to tasks with `check_type`, `status`, structured `measurements` (JSONB), and `defects_found` count.

### Data & Metrics Layer

The `manufacturing_metrics` table stores timestamped numeric measurements (with unit) linked to projects and/or tasks. `metric_type` is enumerated, making this table the foundation for an ETL pipeline or analytics dashboard.

**Analytics already tracked:**
- Cycle time and lead time per task
- WIP per board and column
- Defect counts and QC check outcomes
- Equipment run time and setup time
- Estimated vs. actual hours

### Projects

Projects are the top-level container scoping boards, tasks, members, and metrics. Each project tracks customer, budget, current phase, priority, status, project manager, and full timestamps.

### Security & Access Control

- Row Level Security (RLS) on `users` table — users can read all profiles but only modify their own record
- Project and task access governed by membership (not just role)
- Versioned file attachments with `is_latest` flag for controlled document management

### Automation

`updated_at` auto-update triggers are active on: `users`, `projects`, `tasks`, `boards`, `comments`, `equipment`. Append-only tables (history, metrics, junction tables) are intentionally trigger-free.

---

## System Architecture

```
Frontend (React)
    └── Drag-and-drop board UI
    └── Phase-aware task views
    └── Role-scoped dashboards

Backend (Node.js)
    └── REST API (tasks, boards, projects, users)
    └── Auth middleware (role enforcement)
    └── File upload handling

Database (PostgreSQL / Supabase)
    └── Normalized schema with enums for domain integrity
    └── RLS policies for data isolation
    └── Trigger-managed audit fields

[Planned] AI Layer
    └── Task generator (subtasks, roles, effort from description)
    └── Document parser (PDF → structured JSON)
    └── Workflow assistant ("What's blocking production?")

[Planned] Data Pipeline
    └── Event log table (task lifecycle events)
    └── ETL (Python/pandas) → analytics tables
    └── Metrics dashboard (cycle time, WIP trends, bottlenecks)
```

---

## Schema Status

> ⚠️ **The database schema is currently under active refactoring.** The tables, enums, and relationships described in this document reflect the intended production design. Some fields or tables may be in transition.

**Planned schema extensions:**

- `organizations` table — multi-tenant support; users and boards scoped per org
- `events` table — granular event log for task lifecycle (created, moved, completed) feeding the analytics pipeline
- `task_metrics` table — derived metrics (cycle time, lead time) computed from events
- Background job support (BullMQ + Redis) for AI inference and ETL jobs
- Expanded `project_members` roles to support construction/MEP org structures

---

## Roadmap

| Phase | Focus | Status |
|---|---|---|
| 0 — Positioning | README, use case definition | ✅ Done |
| 1 — Backend Architecture | Service/repository layers, multi-tenancy, RBAC enforcement, background jobs | 🔄 In Progress |
| 2 — AI Layer | Task generator, document parser (PDF → JSON), workflow assistant (RAG) | 🔜 Planned |
| 3 — Data Engineering | Event tracking, ETL pipeline, analytics dashboard | 🔜 Planned |
| 4 — Cloud & Production | Docker, Vercel + Render deploy, CI/CD, logging | 🔜 Planned |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth (RLS) |
| File Storage | Supabase Storage |
| Background Jobs *(planned)* | BullMQ + Redis |
| AI Layer *(planned)* | OpenAI API (function calling + embeddings) |
| Data Pipeline *(planned)* | Python, pandas, PostgreSQL |
| Deployment *(planned)* | Docker, Vercel, Render |

---

## Contributing

Tasktrone is under active development. Architecture decisions, domain modeling, and AI feature design are the current priority. Contributions, feedback, and use-case discussions are welcome via issues.

---

*Built for engineers who understand that manufacturing workflows are not software sprints.*