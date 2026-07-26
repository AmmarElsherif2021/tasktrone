*Tasktrone Platform Requirements — Rev. 1.0 | Manufacturing MVP + MEP Compatibility*
---

# TASKTRONE Platform Requirements Document  

## Manufacturing Workflow — MVP Phase (With MEP Paradigm Compatibility Considerations for Post-MVP)

Document Scope & Reading Guide

This document defines Tasktrone’s requirements for the Manufacturing (MFG) vertical — the primary focus of the MVP phase. All role definitions, workflow phases, and feature priorities are written from a manufacturing‑first perspective.

### MEP Paradigm Note (Post‑MVP):
 Where marked with an asterisk (*), abstract roles and concepts are intentionally designed to be domain‑agnostic so that the same RBAC framework, database schema, and RLS policies can later serve Construction / MEP (Mechanical, Electrical, Plumbing) tenants with minimal reconfiguration — primarily label changes and tenant‑specific enum definitions. MEP‑exclusive roles (Regulatory / Permit) are documented for forward compatibility but are **not** part of the MVP build.

---

## Understanding Tasktrone Requirements

Tasktrone is oriented mainly to handle interaction between real physical processes occurring along the manufacturing process — and, by design, is also compatible with the MEP development paradigm. To understand its requirements we must examine the multiple layers involved, the workflow phases, and the factors affecting each process. This naturally leads to exploring the different roles of actors involved across the project lifecycle.

The platform sits at the intersection of physical operations (making and building things) and digital systems (managing the data and intelligence). Tasktrone uses data engineering — ETL pipelines, audit trails, derived metrics — to provide reliable intelligence about mechanical operations: WIP limits, task dependencies, and equipment utilization.

---

## A. Layers of Tasktrone

The platform is structured across three hierarchical layers, each with its own scope of authority and data boundary.

| Layer | Name | Purpose |
|-------|------|---------|
| 1 | Organization (Org) | Top‑level tenant representing a company or business entity. Houses all projects, users, billing, and global configuration. Platform Owner operates at this layer. |
| 2 | Project | A bounded manufacturing engagement (e.g., a product line launch, a client order). Contains boards, tasks, members, and metrics. Project Owner operates here. |
| 3 | Product Line | A recurring production type or SKU category within a project. Provides reusable templates for board structure, WIP limits, and phase definitions. |

---

## B. Workflow Phases

Tasktrone uses an **abstract phase model**: the database stores only abstract states (`pending`, `active`, `review`, `rework`, `approved`, `blocked`, `done`). Every board, column, and task references an abstract phase. Tenant‑specific phase labels (e.g., “Welding”, “Rough‑in”) are stored as configuration data in `organizations.phase_labels` (JSONB) and displayed by the UI. All backend rules, RLS policies, and analytics operate purely on the abstract enum values, making the platform inherently multi‑vertical.

### B.1 Abstract Phase Definitions

| Abstract Phase | Meaning | Typical Entry Condition | Exit Condition |
|----------------|---------|--------------------------|----------------|
| **Pending** | Work item defined but not yet ready to start. Waiting for prerequisites (materials, permits, approvals, or predecessor tasks). | Created by authorized role. | All dependencies resolved, prerequisites satisfied. |
| **Active** | Work is in progress. Resources are allocated, and execution has begun. | Moved from Pending or Blocked. | Worker marks progress complete, or quality check initiated. |
| **Review / Inspection** | Output requires verification against standards. Can pass or fail. | Moved from Active. | Pass → next phase; Fail → Rework. |
| **Rework** | Failed inspection, requires correction. Loops back to Active after fixes. | Failed from Review / Inspection. | Corrections made; moves back to Review. |
| **Approved** | Work has passed all checks and is accepted. Ready for next stage. | Passed Review / Inspection. | None – terminal for the task’s quality lifecycle. |
| **Blocked** | Cannot proceed due to external issue (missing material, permit rejection, equipment down). No work happening. | Manual flag or automatic dependency failure. | Issue resolved → returns to previous abstract phase (Pending or Active). |
| **Done / Closed** | Work item is complete and no further action required. Terminal state. | After Approved and all handoffs done. | None – archival. |

### B.2 Concrete Phase Labels for Manufacturing MVP

The following table shows the tenant‑specific labels that the MFG MVP will use, mapped to the abstract phases. MEP labels are shown for future compatibility.

| Abstract Phase | Manufacturing (MFG) Concrete Phase | Construction / MEP Concrete Phase (post‑MVP) |
|----------------|-----------------------------------|---------------------------------------------|
| Pending | Raw Materials / Pending | Permit Application / Procurement |
| Active | Production / Assembly | Installation / Rough‑in |
| Review / Inspection | Quality Check / Inspection | AHJ Inspection / Commissioning Test |
| Rework | Rework (correction) | Punch List / Non‑compliance rework |
| Approved | Approved / Ready for Packaging | Inspection Passed / Ready for Handover |
| Blocked | Blocked / On Hold | Blocked (stop work order / permit denial) |
| Done / Closed | Shipped / Completed | Closeout / Certificate of Occupancy |

### Platform Behavior Based on Abstract Phases

| Behavior | Implemented Once on Abstract Phase |
|----------|-----------------------------------|
| WIP Limits | Applied at the Active abstract phase (regardless of local label). |
| Dependency blocking | A task in Pending or Blocked cannot be moved to Active until dependencies clear. |
| Audit Trail | All transitions between abstract phases are logged in `task_history`. |
| Quality Gate | Exit from Review/Inspection to Approved requires a passed quality check (or override). |
| Escalation rules | Time in Blocked > threshold alerts Project Owner. |

This abstraction guarantees that the same backend logic, RLS policies, and analytics (e.g., cycle time = time in Active) work for both verticals. Only the UI labels and tenant‑specific enum values change.

### B.3 Abstract Task Categories

Task categories define the *nature of the work*, independent of industry. They are stored as an abstract enum (`task_category_enum`) and mapped to tenant‑specific labels. Roles are scoped to create and manage specific abstract categories; phases contain certain categories; and derived metrics are calculated across abstract categories.

| Abstract Task Category | MFG Concrete Categories | MEP Concrete Categories |
|------------------------|--------------------------|--------------------------|
| **Design_Artifact** | CAD Models, Design Specifications, BOM | BIM Models, MEP Drawings, Submittal Logs |
| **Production_Execution** | Welding, Assembly, CNC Programming | Rough‑in, Installation, Termination |
| **Quality_Verification** | Dimensional Inspection, Weld Check, Pressure Test | Commissioning Test, AHJ Walk‑through, Continuity Test |
| **Material_Handling** | Pick & Kit, Raw Material Delivery, Inventory Reorder | Procurement, Material Submittal Approval, Equipment Rental |
| **Equipment_Service** | Preventive Maintenance, Calibration, Repair | Facility Equipment Check, Generator Test (post‑handover) |
| **Regulatory_Compliance** | — (not in MFG) | Permit Application, Inspection Scheduling, Code Compliance |
| **Logistics_Handoff** | Shipping, Receiving, Packaging | Closeout Documentation, Owner Training, Certificate of Occupancy |

**Alignment with roles and phases:**

- **Roles** are scoped to specific abstract categories (e.g., Design Lead creates `Design_Artifact` tasks; Quality Gatekeeper creates `Quality_Verification` tasks).
- **Phases** naturally contain certain abstract categories (e.g., `Active` phase holds `Production_Execution` tasks, `Review / Inspection` holds `Quality_Verification` tasks).
- **Derived metrics** are calculated across abstract categories (e.g., “Design cycle time” measures only `Design_Artifact` tasks), not hard‑coded to a vertical.

---

## C. Abstract Roles vs. Actual Roles

Tasktrone is built on RBAC (Role‑Based Access Control) with Row‑Level Security (RLS). Roles are abstract by design — the same permission structure, schema, and security policies serve multiple verticals. For the MVP phase, role labels and behaviors are tuned for manufacturing. Post‑MVP, the same abstract roles map cleanly to MEP job titles with only tenant‑level configuration changes.

**Design Principle: Domain‑Agnostic RBAC**  
Abstract roles are “hats” — they define what a person can see and do, not their job title. A “Quality Gatekeeper” in manufacturing is a QC Inspector; the same role in MEP is a Commissioning Engineer or AHJ Inspector. The hat stays the same; the name on the badge changes. This means the MVP codebase already supports MEP tenants — only enum labels and phase definitions require tenant‑level customization.

---

### C.1 Roles at a Glance

| Abstract Role | Domain Scope | Create Tasks? | Approve QC? | Equipment Authority | Reports To | Typical Task Categories |
|---------------|--------------|---------------|-------------|---------------------|------------|--------------------------|
| Platform Owner | MFG + MEP* | ✅ All Orgs | ✅ Override | ✅ All Registry | Board | All (system‑wide) |
| Project Owner | MFG + MEP* | ✅ | ✅ | ✅ Link / Unlink | Platform Owner | All (project‑scope) |
| Design Lead | MFG + MEP* | ✅ Design_Artifact | ✅ Design reviews | ✅ Design Tools | Project Owner | Design_Artifact |
| Planner / Scheduler | MFG + MEP* | ✅ Top‑level | ❌ | ❌ | Project Owner | Any (scheduling) |
| Execution Worker | MFG + MEP* | ❌ Assigned | ❌ | ❌ Logs usage | Team Lead | Any (execution) |
| Quality Gatekeeper | MFG + MEP* | ✅ Quality_Verification | ✅ All QC | ❌ | Project Owner | Quality_Verification |
| Logistics / Handoff | MFG + MEP* | ✅ Material_Handling, Logistics_Handoff | ❌ | ❌ | Project Owner | Material_Handling, Logistics_Handoff |
| Maintenance | MFG + MEP* | ✅ Equipment_Service | ❌ | ✅ Status Change | Project Owner | Equipment_Service |
| Regulatory / Permit | MEP only* | ✅ Regulatory_Compliance | ✅ Permits | ❌ | Project Owner | Regulatory_Compliance |
| Equipment Custodian | MFG only | ❌ Registers | ❌ | ✅ Assignment | Project Owner | (equipment administration) |

> *MEP only* roles are documented for post‑MVP forward compatibility and are not part of the MVP build.

---

### C.2 Role‑to‑Job Mapping

| Abstract Role | Manufacturing Job Titles (MVP Focus) | Construction / MEP Titles (Post‑MVP*) |
|---------------|----------------------------------------|-----------------------------------------|
| Platform Owner | System Administrator | System Administrator |
| Project Owner | Project Manager | Project Manager / Owner Rep |
| Design Lead | Design Engineer, CAD Technician | MEP Design Coordinator, BIM Technician |
| Planner / Scheduler | Production Planner, Supervisor | Construction Manager, Site Superintendent |
| Execution Worker | Machinist, CNC Programmer, Welder | Electrician, Plumber, HVAC Tech |
| Quality Gatekeeper | QC Inspector, Metrology Engineer | Commissioning Engineer, AHJ Inspector |
| Logistics / Handoff | Inventory Manager, Logistics Coordinator | Procurement Lead, Closeout Coordinator |
| Maintenance | Maintenance Technician | Facility Manager (post‑handover) |
| Regulatory / Permit | — (not applicable in MFG MVP) | Permit Expediter, AHJ Liaison |
| Equipment Custodian | Equipment / Machine Owner, Tool Crib Manager | — (assets tracked differently in MEP) |

---

### C.3 Role Definitions — Manufacturing MVP (with MEP Compatibility Notes)

*(The following role definitions incorporate abstract task categories into their authorities.)*

#### Platform Owner
… (no change to authorities, but note that they can manage all task categories globally) …

#### Project Owner
… (authorities include creating/editing any task category within the project) …

#### Design Lead
**Key Authorities** (updated)
- **Design Task Management:** Create/update/delete tasks of abstract category `Design_Artifact` (CAD models, BOMs, design specifications). Assign design subtasks to specific designers.
- **Design Review & Approval:** Approve/reject design deliverables; mark design tasks done, triggering phase transitions.
- **Resource & Tool Access:** Assign design‑specific equipment (3D printers, CAD workstations) via `task_equipment`.
- **Team Coordination:** Add/remove designers from the Design team within the project.
- **Quality & Metrics:** Review design‑related quality checks and phase‑level derived metrics for `Design_Artifact` tasks.

**Accountabilities** remain unchanged.

#### Planner / Scheduler
(No change, but implicitly works across task categories for scheduling.)

#### Execution Worker
(No change – they execute whatever task they are assigned, regardless of abstract category.)

#### Quality Gatekeeper
**Key Authorities** (updated)
- **Check Management:** Create/edit/delete `quality_checks` for any task; also create and manage tasks of abstract category `Quality_Verification`.
- **Pass/Fail Authority:** Mark QC checks pass/fail; override with justification.
- **Data Access:** View all defect data across the project.
- **Team Management:** Add/remove QC inspectors from project‑level QC tasks.

**Accountabilities** unchanged.

#### Logistics / Handoff
**Key Authorities** (updated)
- **Inventory & Logistics Tasking:** Create tasks of abstract categories `Material_Handling` and `Logistics_Handoff` (ordering, picking, kitting, shipping).
- **Stock Linking:** Link material stock records to tasks; deduct quantities.
- **Dependency Approval:** Approve/reject dependencies requiring stock levels.
- **Budget & BOM:** Edit project budget for material costs; manage versioned BOMs.

**Accountabilities** unchanged.

#### Maintenance
**Key Authorities** (updated)
- **Maintenance Tasks:** Create preventive/corrective tasks of abstract category `Equipment_Service` for any equipment.
- **Maintenance Scheduling:** Set `next_maintenance_date` after completion.
- **Equipment Status:** Mark equipment down/active; block production tasks.
- **Utilization & Root Cause:** View utilization metrics; report recurring failures.

**Accountabilities** unchanged.

#### ⚠ Post‑MVP Role — MEP Vertical Only
#### Regulatory / Permit
**Key Authorities** (updated)
- **Permit Tasks:** Create tasks of abstract category `Regulatory_Compliance`.
- **Documents & Milestones:** Attach permit drawings, record AHJ inspection milestones.
- **Checklist & Compliance:** Define permit‑specific checklists; manage code compliance.

**Accountabilities** unchanged.

#### Equipment Custodian (MFG only)
(No change — they administer equipment, not task categories.)

---

## Summary

The RBAC framework, RLS policies, and database schema are intentionally domain‑agnostic. The 8 core abstract roles (Platform Owner through Equipment Custodian) will serve both MFG and MEP tenants post‑MVP. Only two roles require special handling:

- **Regulatory / Permit:** enabled exclusively for MEP tenants (post‑MVP). Inactive for MFG.
- **Equipment Custodian:** active for MFG. MEP tenants track assets via a different schema path.

All other roles share the same code, same permissions structure, and same RLS enforcement — just different hats.

Now integrated with **abstract task categories**, the platform’s scope of authority for each role is defined by *what kind of work* they can create, not just which phase. Together with abstract phases and abstract roles, the model is fully industry‑agnostic — manufacturing terminology is only a tenant‑level label away. 