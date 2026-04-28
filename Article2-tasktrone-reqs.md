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

In manufacturing, Kanban boards track the flow of materials and tasks across phases. The core idea is to visualize work, limit WIP (work‑in‑progress), and ensure just‑in‑time production. The exact phases vary by factory setup, but Tasktrone supports both a standard core set and configurable specialized phases.

### B.1 Core Manufacturing Phases (MVP Focus)

| Kanban Phase | Description / Tasktrone Behavior |
|--------------|----------------------------------|
| Raw Materials / Pending | Materials requested but not yet available. Prevents premature task starts; triggers procurement chain. |
| Production / Assembly | Active work where components are being assembled or processed against the work order. |
| Quality Check / Inspection | Items undergo testing against standards. Failed items route to Rework; passed items advance. |
| Approved / Ready for Packaging | Products cleared by QC and waiting for packaging resources. |
| Packaging / Labeling | Goods are boxed, labeled, and prepared for outbound logistics. |
| Warehouse / Inventory | (Optional) Finished goods held in storage pending shipment scheduling. |
| Shipped / Completed | Final stage — product leaves the facility and order is closed in the system. |

### Specialized / Industry‑Specific Phases

| Phase | Description |
|-------|-------------|
| Maintenance / Repair | Equipment downtime tasks. Blocks dependent production tasks automatically. |
| Blocked / On Hold | Items paused due to supply chain issues, pending approvals, or dependencies. |
| Rework | Products that failed inspection and need correction before re‑entering the QC gate. |
| Logistics / Distribution | Tracking delivery milestones to end customers or next‑tier facilities. |

### Why These Phases Matter

| Benefit | Manufacturing Impact |
|---------|----------------------|
| Visibility | Supervisors immediately see bottlenecks — e.g., too many tasks stuck in QC phases. |
| Efficiency | WIP limits reduce overproduction, idle inventory, and context‑switching waste. |
| Collaboration | Teams coordinate across procurement, production, and logistics using the same board. |
| Continuous Improvement | Tasktrone’s audit trail and derived metrics highlight waste and systemic delays over time. |

**Recommended External References** (as noted in the document)
- Kaizen Institute — Kanban in Lean Manufacturing: Toyota’s origins of Kanban and pull production principles.
- ProjectManager.com — Kanban in Manufacturing: Boards tracking To Do → Doing → Done with inventory examples.
- Streamline Production — Kanban Boards in Industry 5.0: WIP management, inventory control, and QA in modern factories.
- Unleashed Software — 8 Examples of Kanban in Lean Manufacturing: Stations as mini‑businesses in a pull system.
- EdrawMind — 5 Examples of Kanban Boards in Lean Manufacturing: Templates for task management and operations.

---
### B.2 Abstract Workflow Phases (Domain Agnostic Core)
To enable the same platform logic for both Manufacturing and Construction/MEP, Tasktrone defines a set of abstract phases that describe the high level status of any work item. Each tenant (MFG or MEP) maps these abstract phases to their own concrete phase names and workflows. The platform enforces transition rules, WIP limits, and dependency blocking based on the abstract phase; the displayed labels are tenant configurable enums.
Abstract Phase Definitions
Abstract Phase	Logical Meaning	Typical Entry Condition	Exit Condition
Pending	Work item is defined but not yet ready to start. Waiting for prerequisites (materials, permits, approvals, or predecessor tasks).	Created by authorized role.	All dependencies resolved, prerequisites satisfied.
Active	Work is in progress. Resources are allocated, and execution has begun.	Moved from Pending or Blocked.	Worker marks progress complete, or quality check initiated.
Review / Inspection	Output requires verification against standards. Can pass or fail.	Moved from Active.	Pass → next phase; Fail → Rework.
Rework	Failed inspection, requires correction. Loops back to Active after fixes.	Failed from Review / Inspection.	Corrections made; moves back to Review.
Approved	Work has passed all checks and is accepted. Ready for next stage.	Passed Review / Inspection.	None – terminal for the task’s quality lifecycle. 
Blocked	Cannot proceed due to external issue (missing material, permit rejection, equipment down). No work happening.	Manual flag or automatic dependency failure.	Issue resolved → returns to previous abstract phase (Pending or Active).
Done / Closed	Work item is complete and no further action required. Terminal state.	After Approved and all handoffs done.	None – archival.
Concrete Mapping to Vertical Specific Phases
Abstract Phase	Manufacturing (MFG) Concrete Phase	Construction / MEP Concrete Phase
Pending	Raw Materials / Pending	Permit Application / Procurement
Active	Production / Assembly	Installation / Rough in
Review / Inspection	Quality Check / Inspection	AHJ Inspection / Commissioning Test
Rework	Rework (manufacturing correction)	Punch List / Non compliance rework
Approved	Approved / Ready for Packaging	Inspection Passed / Ready for Handover
Blocked	Blocked / On Hold	Blocked (stop work order / permit denial)
Done / Closed	Shipped / Completed	Closeout / Certificate of Occupancy
Platform Behavior Based on Abstract Phases
Behavior	Implemented Once on Abstract Phase
WIP Limits	Applied at the Active abstract phase (regardless of what it’s called locally).
Dependency blocking	A task in Pending or Blocked cannot be moved to Active until dependencies clear.
Audit Trail	All transitions between abstract phases are logged in task_history.
Quality Gate	Exit from Review/Inspection to Approved requires a passed quality check (or override).
Escalation rules	Time in Blocked > threshold alerts Project Owner.
This abstraction guarantees that the same backend logic, RLS policies, and analytics (e.g., cycle time = time in Active) work for both verticals. Only the UI labels and tenant specific enum values change.

## C. Abstract Roles vs. Actual Roles

Tasktrone is built on RBAC (Role‑Based Access Control) with Row‑Level Security (RLS). Roles are abstract by design — the same permission structure, schema, and security policies serve multiple verticals. For the MVP phase, role labels and behaviors are tuned for manufacturing. Post‑MVP, the same abstract roles map cleanly to MEP job titles with only tenant‑level configuration changes.

**Design Principle: Domain‑Agnostic RBAC**  
Abstract roles are “hats” — they define what a person can see and do, not their job title. A “Quality Gatekeeper” in manufacturing is a QC Inspector; the same role in MEP is a Commissioning Engineer or AHJ Inspector. The hat stays the same; the name on the badge changes. This means the MVP codebase already supports MEP tenants — only enum labels and phase definitions require tenant‑level customization.

---

### C.1 Roles at a Glance

| Abstract Role | Domain Scope | Create Tasks? | Approve QC? | Equipment Authority | Reports To |
|---------------|--------------|---------------|-------------|---------------------|------------|
| Platform Owner | MFG + MEP* | ✅ All Orgs | ✅ Override | ✅ All Registry | Board |
| Project Owner | MFG + MEP* | ✅ | ✅ | ✅ Link / Unlink | Platform Owner |
| Design Lead | MFG + MEP* | ✅ Design Ph. | ✅ Design Rev. | ✅ Design Tools | Project Owner |
| Planner / Scheduler | MFG + MEP* | ✅ Top‑level | ❌ | ❌ | Project Owner |
| Execution Worker | MFG + MEP* | ❌ Assigned | ❌ | ❌ Logs usage | Team Lead |
| Quality Gatekeeper | MFG + MEP* | ✅ QC Tasks | ✅ All QC | ❌ | Project Owner |
| Logistics / Handoff | MFG + MEP* | ✅ Inventory | ❌ | ❌ | Project Owner |
| Maintenance | MFG + MEP* | ✅ Maint. Tasks | ❌ | ✅ Status Change | Project Owner |
| Regulatory / Permit | MEP only* | ✅ Permit Tasks | ✅ Permits | ❌ | Project Owner |
| Equipment Custodian | MFG only | ❌ Registers | ❌ | ✅ Assignment | Project Owner |

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

#### Platform Owner
**Domain Scope:** Manufacturing + MEP* (both verticals, post‑MVP)  
**MFG Job Title(s):** System Administrator  
**MEP Title(s):** System Administrator  

**Key Authorities**
- Tenant & Subscription Management: create/onboard organizations, oversee billing, transfer ownership.
- User & Role Management: approve/revoke platform access, define system‑wide `user_role` enums.
- System‑Wide Configuration: final authority on authentication methods, global enums (e.g., manufacturing phases).
- Security & Compliance: set security policy framework, ensure compliance with ISO 27001 / SOC 2.
- Audit & Oversight: review all audit trails of user activities and system events across all orgs.
- Process & Workflow Governance: define and oversee core process definitions used across the platform.

**Accountabilities**
- Supreme authority over technical health, security, and governance across all organizations.
- Responsible for ensuring no platform tenant bypasses RLS policies.
- Accountable for system uptime, data retention policies, and global security standards.

**Story**  
The Platform Owner is the building’s landlord. They don’t manage individual scooter orders — they own the factory building, set the security codes, and decide who can start a new company inside it.

---

#### Project Owner
**Domain Scope:** Manufacturing + MEP* (both verticals)  
**MFG Job Title(s):** Project Manager  
**MEP Title(s):** Project Manager / Owner Representative  

**Key Authorities**
- Project Configuration: edit metadata, set current_phase, archive or delete the project.
- Membership Management: add/remove members, assign project‑level roles.
- Board & Workflow Governance: create/edit Kanban boards, configure WIP limits, define swimlanes.
- Task Oversight: create/edit/delete any task, override dependencies, approve or reject QC sign‑offs.
- Metrics & Reporting: view all manufacturing_metrics, export audit trail (task_history).
- Equipment & File Management: link/unlink equipment to tasks, manage versioned file attachments.

**Accountabilities**
- Project Delivery: ensure timeline, budget, and quality targets are met across all phases.
- Role & Access Governance: ensure only authorized members have access; audit task‑level roles.
- Data Integrity: validate required fields, QC completion before phase closure, accurate actual_hours.
- Compliance & Audit Support: provide audit trail extracts; ensure RLS policies are not bypassed.
- Communication & Coordination: primary contact for cross‑team coordination and escalation.

**Story**  
The Project Owner is the factory floor manager for a specific product launch. They don’t operate the CNC machine — they decide who can, when each phase starts, and whether the output meets the delivery commitment.

---

#### Design Lead
**Domain Scope:** Manufacturing + MEP* (team‑level role with project‑level authority over design phases)  
**MFG Job Title(s):** Design Engineer, CAD Technician  
**MEP Title(s):** MEP Design Coordinator, BIM Technician  

**Key Authorities**
- Design Task Management: create/update/delete tasks tagged to Concept & Design or Prototyping phases.
- Design Review & Approval: approve/reject design deliverables (CAD models, drawings, BOMs).
- Resource & Tool Access: assign equipment (3D printers, CAD workstations) to design tasks.
- Team Coordination: add/remove designers from the Design team within the project.
- Quality & Metrics: review design‑related quality checks; view phase‑level derived metrics.

**Accountabilities**
- Design Quality: ensure all design tasks meet technical and regulatory standards before phase exit.
- Cross‑Phase Handoff: sign off readiness for Pre‑Production Planning or Manufacturing phases.
- Compliance & Documentation: maintain audit trail of design decisions; manage file versioning.
- Team Productivity: balance workload among designers; ensure accurate actual_hours logging.

**Story**  
The Design Lead is the chief engineer for the electric scooter’s blueprint. They decide who draws the motor mount, when the CAD model is ready for prototyping, and can stop the line if a drawing has a critical error.

---

#### Planner / Scheduler
**Domain Scope:** Manufacturing + MEP* (master schedule keeper)  
**MFG Job Title(s):** Production Planner, Supervisor  
**MEP Title(s):** Construction Manager, Site Superintendent  

**Key Authorities**
- Schedule Management: set start_date and due_date on top‑level tasks; override estimated cycle times.
- Dependency Control: define task_dependencies and lag_time for the entire project.
- WIP Governance: set WIP limits at board and column level based on capacity analysis.
- Analytics Access: view all manufacturing_metrics for capacity planning (lead time, throughput).

**Accountabilities**
- Realistic Timeline: ensure the project schedule is achievable with available resources.
- Critical Path Management: identify and communicate critical path tasks to team leads.
- Delay Recovery: reschedule tasks when disruptions occur (equipment breakdown, material delay).
- Workload Balancing: balance workload across Design, Manufacturing, and QC teams.
- Progress Reporting: provide weekly progress reports to Project Owner.

**Story**  
The Planner is the air traffic controller for the scooter factory. They don’t weld or paint — they decide that welding comes before painting, that only 3 scooters can be welded at once, and that a CNC breakdown should trigger a model switch to keep other lines moving.

---

#### Execution Worker
**Domain Scope:** Manufacturing + MEP* (task‑level role — assigned, not project‑wide)  
**MFG Job Title(s):** Machinist, CNC Programmer, Welder, Assembler  
**MEP Title(s):** Electrician, Plumber, HVAC Technician  

**Key Authorities**
- Time Logging: log actual_hours against the assigned task.
- Status Updates: change task status (in_progress → review → done) if no approval gate is configured.
- Communication: add comments and @mention other task members.
- File Attachments: upload required attachments (work photos, inspection forms).
- Equipment Logging: record start_time, end_time, setup_time, run_time for the task.
- Defect Reporting: flag a quality check failure (creates quality_check record with status = fail).

**Accountabilities**
- Task Completion: complete the task to spec within estimated_hours.
- Accurate Records: accurately log time and materials used.
- Compliance: follow all safety and quality procedures without deviation.
- Escalation: notify the team lead immediately if blocked or unable to meet due date.
- Quality Gate: do not mark a task done until all required checklist items are satisfied.

**Story**  
The Execution Worker is the welder who joins the scooter’s frame. They mark “welding done,” upload a weld photo, log 2 hours, and flag a defect if the weld is crooked. They cannot approve designs or order metal — they execute.

---

#### Quality Gatekeeper
**Domain Scope:** Manufacturing + MEP* (the judge, not the player)  
**MFG Job Title(s):** QC Inspector, Metrology Engineer  
**MEP Title(s):** Commissioning Engineer, AHJ Inspector  

**Key Authorities**
- Check Management: create/edit/delete quality_checks for any task; set check_type (weld_inspection, pressure_test, etc.).
- Pass / Fail Authority: mark QC checks fail — auto‑blocking dependent tasks; override to pass with mandatory justification.
- Data Access: view all defects_found counts and measurements JSONB data across the project.
- Team Management: add/remove QC inspectors from project‑level QC tasks.
- Attachment Access: access all task attachments (weld photos, CMM reports) project‑wide.

**Accountabilities**
- Standards Enforcement: ensure every component meets specified tolerances before phase advancement.
- Defect Rate Control: maintain defect rate below project target (e.g., < 2%).
- Reporting: generate QC reports for phase‑gate reviews (e.g., before Packaging & Shipping).
- Training: train QC inspectors on correct measurement logging in Tasktrone.
- Process Improvement: flag recurring defect patterns to Manufacturing Lead.
- Audit Readiness: ensure all QC checks are completed before any task is marked done.

**Story**  
The Quality Gatekeeper is the inspector with the red pen. Their checklist: “Weld depth ≥ 3 mm, no cracks.” If the welder’s work fails, the scooter cannot move to painting until it’s fixed. They can pass a slightly off weld — but must document why. They judge; they don’t weld.

---

#### Logistics / Handoff
**Domain Scope:** Manufacturing + MEP* (materials, parts, and documents in the right place at the right time)  
**MFG Job Title(s):** Inventory Manager, Logistics Coordinator  
**MEP Title(s):** Procurement Lead, Closeout Coordinator  

**Key Authorities**
- Inventory Task Management: create inventory‑related tasks (ordering, picking, kitting, shipping).
- Stock Linking: link material stock records to tasks; deduct quantities when tasks complete.
- Dependency Approval: approve or reject task dependencies requiring specific stock levels.
- Budget Editing: edit project budget field for material costs (when delegated by Project Owner).
- Log Access: access all shipping and receiving logs attached to tasks.

**Accountabilities**
- Material Availability: ensure raw materials and consumables are available when needed.
- Stockout Prevention: prevent stockouts that would halt production lines.
- Inventory Accuracy: maintain accurate counts via cycle counts and receiving verification.
- BOM Management: manage versioned Bills of Materials attached to design tasks.
- Coordination: coordinate with Procurement for reorder points and lead time tracking.

**Story**  
The Logistics Lead is the parts runner. When the welder needs more steel tubing, Logistics creates task “Pick and deliver 20 ft of 2” tube,” tracks its arrival, deducts inventory, and marks it done. Without them, the welder has nothing to weld.

---

#### Maintenance
**Domain Scope:** Manufacturing + MEP* (keeps equipment working)  
**MFG Job Title(s):** Maintenance Technician  
**MEP Title(s):** Facility Manager (post‑handover phase)  

**Key Authorities**
- Maintenance Tasks: create preventive or corrective maintenance tasks for any equipment in the registry.
- Maintenance Scheduling: set next_maintenance_date on equipment records after task completion.
- Technician Assignment: assign maintenance technicians to specific tasks.
- Equipment Downtime: mark equipment status = down — immediately blocking all production tasks using that machine.
- Utilization Viewing: view equipment utilization metrics (setup_time, run_time) to prioritize maintenance.
- Estimate Override: override estimated hours for emergency repairs with justification.

**Accountabilities**
- Equipment Uptime: keep critical equipment operational and within calibration.
- Preventive Maintenance: schedule preventive maintenance to minimize unplanned downtime.
- Documentation: document repair actions and parts used in task comments and attachments.
- Root Cause Reporting: report recurring equipment failures to Manufacturing Lead.
- Compliance: ensure maintenance tasks are completed before next_maintenance_date threshold.

**Story**  
The Maintenance role is the CNC machine mechanic. When the machine breaks, they mark it “down” — which blocks all dependent tasks. Once fixed, they restore status to “active.” They don’t make scooter parts; they keep the machines that make parts running.

---

#### ⚠ Post‑MVP Role — MEP Vertical Only

The Regulatory / Permit role is documented here for forward compatibility. It is **NOT** part of the Manufacturing MVP build. Manufacturing tenants do not have this role. It will be activated for Construction / MEP tenants in a post‑MVP release.

##### Regulatory / Permit
**Domain Scope:** MEP / Construction only* (post‑MVP — not in MFG MVP)  
**MFG Job Title(s):** — Not applicable in Manufacturing MVP  
**MEP Title(s):** Permit Expediter, AHJ (Authority Having Jurisdiction) Liaison  

**Key Authorities**
- Permit Documents: attach permit drawings and compliance docs to tasks.
- Inspection Milestones: record AHJ inspection results (e.g., “Electrical rough‑in passed”).
- Checklist Management: create permit‑specific checklist items for regulatory approvals.
- Approval Authority: mark permit‑related tasks as approved or rejected.
- Audit Access: view all regulatory audit trails across the project.

**Accountabilities**
- Permit Acquisition: ensure all permits are obtained before construction phases begin.
- Code Compliance: maintain compliance with local building codes and regulations.
- Timely Submittal: submit documents to AHJ on schedule to avoid phase delays.
- Expiration Monitoring: flag expiring permits before they lapse.
- Inspection Coordination: schedule and track all AHJ inspections.

**Story**  
The Permit Expediter deals with the city. They upload electrical drawings, request inspections, and mark “Electrical permit approved.” If the fire marshal rejects the sprinkler plan, they mark it “rejected” and create a rework task. They don’t install pipes — they make the paperwork legal for pipes to be installed.

---

#### Equipment Custodian (MFG only)

**Domain Scope:** Manufacturing only (MFG MVP — assets tracked differently in MEP)  
**MFG Job Title(s):** Equipment / Machine Owner, Tool Crib Manager  
**MEP Title(s):** — Not applicable in MEP (assets managed via different schema)  

**Key Authorities**
- Equipment Records: create and update equipment records (serial number, location, calibration_due_date).
- Task Assignment: assign specific equipment to specific tasks via task_equipment.
- History & Utilization: view maintenance history and utilization metrics.
- Status Control: set equipment operational status (active, down, calibration_due).
- Reservations: approve equipment reservations from other teams or planners.

**Accountabilities**
- Registry Accuracy: maintain equipment registry accuracy for all production assets.
- Calibration: ensure calibration records are current and within tolerance.
- Coordination: coordinate with Maintenance role for repair scheduling.
- Reporting: report utilization metrics to Planner / Scheduler for capacity planning.

**Story**  
The Equipment Custodian is the tool crib manager. They know which CNC machine has a new spindle, which welder is due for calibration next week, and which asset is assigned to Task #42. They don’t repair machines — they track every machine’s location, state, and assignment.

---

## Summary

The RBAC framework, RLS policies, and database schema are intentionally domain‑agnostic. The 8 core abstract roles (Platform Owner through Equipment Custodian) will serve both MFG and MEP tenants post‑MVP. Only two roles require special handling:

- **Regulatory / Permit:** enabled exclusively for MEP tenants (post‑MVP). Inactive for MFG.
- **Equipment Custodian:** active for MFG. MEP tenants track assets via a different schema path.

All other roles share the same code, same permissions structure, and same RLS enforcement — just different hats.

---



