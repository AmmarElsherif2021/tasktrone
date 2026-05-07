# Tasktrone story simplified:

Tasktrone is a platform that sits at the intersection of **physical operations** (making and building things) and **digital systems** (managing the data and intelligence).

Let's break down the key technical terms from both worlds using simple story points.

Imagine you are managing the production of a **custom electric scooter** (Mechanical) and the data system that tracks it all (Data Engineering).

---

### Story Point 1: The Task & Its Journey

#### Mechanical Term: **Lead Time & Cycle Time**
- **The Story:** You get an order for a scooter on Monday. The team finishes building it on Friday. That's a **Lead Time** (5 days). The actual work—cutting metal, welding, painting—only took 2 days. That's the **Cycle Time**. The 3-day gap? Waiting for parts. Tasktrone tracks both to find those expensive delays.
- **Simple Point:** Lead time is the *customer's* wait. Cycle time is the *maker's* work.

#### Data Engineering Term: **ETL Pipeline (Extract, Transform, Load)**
- **The Story:** Raw data is messy. Your machinist writes "welded" in a note, another uses "weld done," and a sensor logs "op:447." An ETL pipeline is an automated kitchen that **Extracts** all this messy data, **Transforms** it (cleans it up into a standard format like "ACTION: WELD_COMPLETE"), and **Loads** it into a clean, organized table so a report or AI can easily read it.
- **Simple Point:** It's a data janitor that turns a pile of dirty dishes into a neatly organized cupboard.

### Story Point 2: Keeping Work Flowing (Without Bottlenecks)

#### Mechanical Term: **WIP Limit (Work In Progress)**
- **The Story:** Your welding booth can only handle 3 scooters at once. A **WIP Limit** is a rule in your kanban board that prevents anyone from moving a 4th scooter into the "Welding" column. It forces the team to finish something before starting something new.
- **Simple Point:** It's a "max capacity" sign for a stage of work, preventing gridlock.

#### Data Engineering Term: **Event Sourcing & Audit Trail (`task_history`)**
- **The Story:** Instead of just saving the *current* status of a task, the database saves *every single change* as a story. "Monday 9:05 AM: Task status changed from 'Design' to 'Welding' by Alice." "Monday 9:06 AM: WIP limit violated." This **Audit Trail** is an immutable, perfect recording of everything that happened.
- **Simple Point:** It's a black box flight recorder for a task, not just a speedometer.

### Story Point 3: The Stuff That Does the Work

#### Mechanical Term: **Equipment Registry & Utilization**
- **The Story:** The $100,000 CNC machine is a key "actor." Tasktrone's **Equipment Registry** tracks it like an employee: its serial number, maintenance schedule, and which tasks it's assigned to. **Utilization** answers: "Was the machine actually cutting metal for 7 of 8 hours today?"
- **Simple Point:** Treating machines like employees to know if they are working or just idle.

#### Data Engineering Term: **Structured vs. Unstructured Data**
- **The Story:** A number like `actual_hours: 4.5` is **structured data**—it fits neatly into a spreadsheet column. A PDF blueprint, a photo of a weld, or a foreman's note "Looks a bit crooked" is **unstructured data**. Tasktrone stores files as unstructured data but uses AI to *extract* structured facts from them (e.g., "crooked weld" → `defect_type: alignment`).
- **Simple Point:** Structured data is a filing cabinet. Unstructured is a messy box of documents and photos.

### Story Point 4: Connecting the Dots

#### Mechanical Term: **Dependency Graph & Lag Time**
- **The Story:** You can't paint the scooter (Task B) until after it's welded (Task A). That's a **Dependency** (Finish-to-Start). You also need the paint to dry for 4 hours before moving it. That waiting period is **Lag Time**. A graph maps all these "waits for" and "happens after" links.
- **Simple Point:** It's a recipe that says "Do step 2 four hours *after* step 1 is fully done."

#### Data Engineering Term: **Derived Metrics (from `manufacturing_metrics`)**
- **The Story:** You don't store "efficiency" directly because it changes constantly. Instead, you store the raw ingredients: `good_parts_count = 95` and `bad_parts_count = 5`. A **Derived Metric** is a calculation run on demand or by a scheduled job: `95 / (95+5) = 95% efficiency`. This keeps raw data clean and calculations fresh.
- **Simple Point:** Storing flour, eggs, and sugar, not a baked cake. You bake the cake (calculate the metric) when you're ready to eat it.

### Story Point 5: Who Can Do What

#### Mechanical Term: **RBAC (Role-Based Access Control) & RLS (Row Level Security)**
- **The Story:** A **Role** is a hat. The "QC Inspector" hat allows you to see the "Defect Report" column. The "Machinist" hat does not. **RBAC** is the rulebook that says "Hats have powers." **RLS** is the bouncer at the database door that looks at your hat and only lets you see the specific rows (e.g., tasks in the "Welding" phase) you are allowed to see.
- **Simple Point:** Roles are hats with keys. RLS is the security guard checking your hat at every single door.

#### Data Engineering Term: **Enum (Enumerated Type)**
- **The Story:** To prevent chaos, you don't let users type "Weld," "weld," "WELD" or "Welding." You give them a dropdown menu with fixed choices: `[DESIGN, WELD, PAINT, QC]`. That list is an **Enum**. It lives in the database schema itself to ensure perfect data consistency.
- **Simple Point:** A fixed dropdown list instead of a free-text box, hardcoded into the database's DNA.

### The Bridge Story: How They Connect

- **The Mechanical Workflow** (scooter moves through Weld → Paint → QC) **creates the raw data** (time stamps, who did it, was it good?).
- **The Data Engineering Layer** (event logs, ETL, derived metrics) **consumes that raw data** to clean it, store it perfectly, and calculate insights (average wait time at QC, machine utilization rate).

**In one sentence:** Tasktrone uses **data engineering** (ETL, audit trails, derived metrics) to give you perfect, reliable intelligence about your **mechanical operations** (WIP, dependencies, equipment). The data model is the blueprint; the mechanical workflow is the building itself.

---

## And now let's introduce our story heroes:

*As our system is mainly RBAC enforcement based, here we explore each abstract role and its equivalent nominal role in both MEP and MFG scopes:*

---

### Platform Owner

The platform owner essentially sits at the top of the permission hierarchy with the highest level of authority in the system. Their key responsibilities typically include:

1. **Tenant & Subscription Management:** Creating/onboarding organizations (tenants), overseeing billing and subscriptions, and potentially transferring ownership of an entire instance to another user if needed.
2. **User & Role Management:** Approving or revoking platform access for any user. Centrally defining system roles (`user_role`) which control global-level permissions across the platform, and assigning other system administrators.
3. **System-Wide Configuration:** Final word on technical aspects like authentication methods; can directly manage and edit all platform data.
4. **Security & Compliance:** Setting security policy framework, ensuring compliance with standards like ISO 27001 or SOC 2.
5. **Audit & Oversight:** Reviewing sensitive information logs, such as detailed audit trails of user activities and system events.
6. **Process & Workflow Governance:** Defining and overseeing core process definitions (like manufacturing phases) and security policies used across the platform.

Ultimately, the platform owner holds supreme authority over the entire system, responsible for its technical health, security, and governance across all organizations.

---

### Project Owner

**Authorities (What they can do):**

The Project Owner has **full control over a single project** and its nested resources (boards, tasks, members, metrics). Their authorities include:

1. **Project Configuration:** Edit project metadata (name, description, customer, budget, priority, status, current phase). Set the project’s `current_phase` – which may trigger phase handoff automation. Archive or delete the project (subject to platform-level retention policies).
2. **Membership Management:** Add or remove members to/from the project (via `project_members`). Assign or change project-level roles for other members. **Cannot** change the Project Owner’s own role within the project – that requires another Project Owner or platform owner.
3. **Board & Workflow Governance:** Create, edit, or delete Kanban boards. Configure WIP limits at board and column levels. Define swimlanes (custom JSONB criteria, colors, positions). Add, remove, or reorder columns.
4. **Task Oversight:** Create, edit, or delete **any task** in the project. Override task dependencies, priorities, or phase tags. Reassign tasks to different members or teams. Approve or reject quality checks that require managerial sign-off.
5. **Metrics & Reporting:** View all `manufacturing_metrics` for the project (including sensitive analytics like defect rates, cycle times). Generate project-level reports. Export audit trail (`task_history`) for the project.
6. **Equipment & File Management:** Link/unlink equipment to/from project tasks. Access and manage all versioned file attachments within the project (even those restricted to specific task roles).

**Responsibilities (What they are accountable for):**

1. **Project Delivery:** Ensuring the project meets its timeline, budget, and quality targets. Approving phase transitions (if not fully automated). Resolving blockers when tasks are stuck.
2. **Role & Access Governance:** Ensuring only authorized people have project access. Removing members who leave the project. Auditing that task-level roles are correctly assigned.
3. **Data Integrity:** Making sure required fields are filled for critical tasks. Validating that quality checks are completed before a phase is closed. Maintaining accurate `actual_hours` and `completion_date`.
4. **Compliance & Audit Support:** Providing audit trail extracts when requested. Ensuring that project-level RLS policies are not bypassed.
5. **Communication & Coordination:** Acting as primary point of contact for cross-team coordination. Using `@mention` in comments to escalate issues.

**Platform Owner vs Project Owner:**

| Capability | Platform Owner | Project Owner |
|------------|----------------|----------------|
| Create/delete organizations (tenants) | ✅ | ❌ |
| View all projects across orgs | ✅ | ❌ (only assigned projects) |
| Assign system-wide roles (`user_role`) | ✅ | ❌ |
| Delete a project permanently | ✅ (any project) | ✅ (only own project) |
| Override RLS policies | ✅ | ❌ |
| Access another project’s metrics | ✅ | ❌ (unless also member there) |
| Set global enums (e.g., manufacturing phases) | ✅ | ❌ |

---

### Design Lead

> In Tasktrone’s role hierarchy, the **Design Lead** is typically a **team-level role** (member of the `Design` team) with **project-level authority** over design-related tasks, quality, and resources. They are not a project owner, but they own the design phase of a project.

**Authorities (What they can do):**

Within a project (or across multiple projects they are assigned to), the Design Lead has:

1. **Design Task Management:** Create, update, or delete any task tagged with `manufacturing_phase = 'Concept & Design'` or `'Prototyping'` (if design-related). Assign design subtasks to individual designers or CAD technicians. Set and modify `estimated_hours`, `due_date`, and priority for design tasks. Move design tasks across board columns even if WIP limits are close – they can override with justification.
2. **Design Review & Approval:** Approve or reject design deliverables (e.g., CAD models, drawings, BOMs) via the task requirement checklist. Mark a design task as `done` – which may trigger a phase transition to Prototyping or trigger dependent tasks. Request changes and assign rework.
3. **Resource & Tool Access:** Assign equipment (e.g., 3D printer, CAD workstations) to design tasks via `task_equipment`. Access all design-related file attachments (blueprints, STEP files, renderings) even if created by other designers.
4. **Team Coordination:** Add or remove members from the `Design` team *within the project* (if enabled). Change a designer’s `task_assignment_role`. Create design‑specific checklists or requirement templates.
5. **Quality & Metrics:** Review quality checks that relate to design correctness (`check_type = 'design_review'` or `'tolerance_analysis'`). View derived metrics for the design phase: average review cycle time, rework rate, design task throughput.

**Responsibilities (What they are accountable for):**

1. **Design Quality & Completeness:** Ensuring all design tasks meet technical and regulatory standards before leaving the Concept or Prototyping phase. Verifying that required documents are attached and versioned correctly. Preventing design‑related defects from reaching production.
2. **Team Productivity:** Balancing workload among designers. Ensuring designers log `actual_hours` accurately. Reviewing and approving timesheets (when integrated).
3. **Cross‑Phase Handoff:** Signing off that the design is ready for `Pre-Production Planning` or `Manufacturing`. Communicating design assumptions and open issues to Manufacturing Engineers or QC.
4. **Compliance & Documentation:** Maintaining an audit trail of design decisions. Ensuring that design files are stored with correct `is_latest` flags.
5. **Coaching & Mentoring:** Helping junior designers understand Tasktrone’s domain model. Enforcing team conventions.

**Relationship with Other Roles:**

| Role | Interaction with Design Lead |
|------|------------------------------|
| **Project Owner** | Receives design phase status reports. Escalates blockers. |
| **Manufacturing Lead** | Hands off approved designs. Collaborates on DFM feedback. |
| **QC Inspector** | May be asked to clarify design intent for a failed quality check. |
| **Platform Owner** | Indirect – only if design data policies are violated. |

**Simple Story (Scooter Example):**

> The **Design Lead** is like the **chief engineer** for the electric scooter’s blueprint. They decide which designer draws the motor mount, which one does the battery box, and when the CAD model is ready for prototyping. They can’t order raw materials (that’s Manufacturing) or approve the final shipping (that’s the Project Owner). But if the drawing has a mistake, the Design Lead is responsible – and they have the authority to stop the line until it’s fixed.

---

### Planner / Scheduler

> The **Planner / Scheduler** is the **master schedule keeper**. They don’t do the work – they decide when work happens, in what order, and how much can be in progress at once.

**Authorities (What they can do):**

1. **Schedule Management:** Create and adjust the project’s master schedule by setting `start_date` and `due_date` on top‑level tasks. Override estimated cycle times for reporting (with justification).
2. **Dependency Control:** Define task dependencies (`task_dependencies` table) and `lag_time` for the entire project. Reorder tasks within a phase to optimize flow.
3. **WIP Governance:** Set WIP limits at board and column level based on capacity analysis.
4. **Analytics Access:** View all `manufacturing_metrics` for capacity planning (e.g., average lead time per task type, throughput).

**Responsibilities (What they are accountable for):**

1. **Realistic Timeline:** Ensuring the project schedule is achievable with available resources.
2. **Critical Path Management:** Identifying critical path tasks and communicating them to team leads.
3. **Delay Recovery:** Rescheduling tasks when delays occur (e.g., equipment breakdown) to minimize impact.
4. **Workload Balancing:** Balancing workload across teams (Design, Manufacturing, QC) to prevent overloading.
5. **Progress Reporting:** Providing weekly progress reports to Project Owner.

**Simple Story (Scooter Example):**

> The **Planner** is the **air traffic controller** for the scooter factory. They don’t weld or paint – they decide that welding comes before painting, that only 3 scooters can be welded at once, and that if the CNC machine breaks, the assembly team should switch to a different scooter model until it’s fixed.

---

### Execution Worker

> The **Execution Worker** is a **task‑level role** – the person who actually turns the wrench, writes the code, or operates the machine. They are assigned to specific tasks, not to the whole project.

**Authorities (What they can do – within their assigned task only):**

1. **Time Logging:** Log `actual_hours` against the task.
2. **Status Updates:** Change task status (e.g., `in_progress` → `review` → `done`) if no approval gate is configured.
3. **Communication:** Add comments and @mention other task members.
4. **File Attachments:** Upload required attachments (e.g., photos of completed work, inspection forms).
5. **Equipment Logging:** Record equipment `start_time`, `end_time`, `setup_time`, `run_time` for the task.
6. **Defect Reporting:** Report a defect via a quality check (creates a new `quality_check` record with `status = 'fail'`).

**Responsibilities (What they are accountable for – within their assigned task):**

1. **Task Completion:** Completing the task according to specifications and within `estimated_hours`.
2. **Accurate Records:** Accurately logging time and materials used.
3. **Compliance:** Following safety and quality procedures.
4. **Escalation:** Notifying the task lead (e.g., Manufacturing Lead) if blocked or unable to meet due date.
5. **Quality Gate:** Not marking a task `done` until all required checklist items are satisfied.

**Simple Story (Scooter Example):**

> The **Execution Worker** is the **welder** who actually joins the scooter’s frame. They can mark “welding done” in the system, upload a photo of the finished weld, and log that it took 2 hours. If the weld is crooked, they can flag it as a defect. But they can’t approve the design or order more metal – they just do the task they were assigned.

---

### Quality Gatekeeper

> The **Quality Gatekeeper** (QC Lead) decides what “good” means and whether a task passed or failed. They are the **judge**, not the player.

**Authorities (What they can do):**

1. **Check Management:** Create, edit, or delete `quality_checks` for any task in the project. Set `check_type` (e.g., `dimension`, `weld_inspection`, `pressure_test`) and required measurements.
2. **Pass/Fail Authority:** Mark a quality check as `fail` – which can automatically block dependent tasks or trigger a rework task. Override a failed QC check to `pass` (with mandatory justification) if the deviation is acceptable.
3. **Data Access:** View all `defects_found` counts and `measurements` JSONB data across the project.
4. **Team Management:** Add or remove QC inspectors from project‑level QC tasks.
5. **Attachment Access:** Access all task attachments (e.g., weld photos, CMM reports) even if originally restricted.

**Responsibilities (What they are accountable for):**

1. **Standards Enforcement:** Ensuring every manufactured or assembled component meets specified tolerances and standards.
2. **Defect Rate Control:** Maintaining defect rate below project target (e.g., < 2%).
3. **Reporting:** Generating QC reports for phase‑gate reviews (e.g., before Packaging & Shipping).
4. **Training:** Training QC inspectors on how to record measurements correctly in Tasktrone.
5. **Process Improvement:** Flagging recurring defect patterns to Manufacturing Lead for process improvement.
6. **Audit Readiness:** Ensuring QC checks are completed before a task is marked `done`.

**Simple Story (Scooter Example):**

> The **Quality Gatekeeper** is the **inspector** with the red pen. They create a checklist: “Weld depth ≥ 3mm, no cracks.” If the welder’s work fails, they mark it “fail” – and the scooter can’t move to painting until it’s fixed. They can also say “close enough” and pass a slightly off weld, but they must write why. They don’t weld – they judge.

---

### Logistics / Handoff

> The **Logistics / Handoff** role ensures that **materials, parts, and documents** arrive where they need to be, when they need to be there.

**Authorities (What they can do):**

1. **Inventory Task Management:** Create inventory‑related tasks (ordering, picking, kitting, shipping). Assign tasks to clerks or coordinators.
2. **Stock Linking:** Link material stock records (future `inventory` table) to tasks – e.g., deduct quantities when a task completes.
3. **Dependency Approval:** Approve or reject task dependencies that require specific stock levels (e.g., “waiting for bearings”).
4. **Budget Editing:** Edit project’s `budget` field for material costs (if delegated by Project Owner).
5. **Log Access:** Access all shipping and receiving logs attached to tasks.

**Responsibilities (What they are accountable for):**

1. **Material Availability:** Ensuring raw materials, components, and consumables are available when manufacturing tasks need them.
2. **Stockout Prevention:** Preventing stockouts that would halt production.
3. **Time Tracking:** Tracking `actual_hours` for picking, kitting, and shipping tasks.
4. **Inventory Accuracy:** Maintaining accurate inventory counts (cycle counts, receiving verification).
5. **Coordination:** Coordinating with Procurement for reorder points.
6. **BOM Management:** Managing versioned BOMs (bill of materials) attached to design tasks.

**Simple Story (Scooter Example):**

> The **Logistics Lead** is the **parts runner**. When the welder needs more steel tubing, the Logistics Lead creates a task “Pick and deliver 20ft of 2” tube.” They track that the steel arrived, deduct it from inventory, and mark the task done. Without them, the welder has nothing to weld – but they don’t do the welding themselves.

---

### Maintenance

> The **Maintenance** role keeps the **equipment** working. They are the mechanics for the machines.

**Authorities (What they can do):**

1. **Maintenance Tasks:** Create maintenance tasks (preventive or corrective) for any equipment in the `equipment` registry.
2. **Maintenance Scheduling:** Set `next_maintenance_date` on equipment records after completing a task.
3. **Technician Assignment:** Assign maintenance technicians to tasks.
4. **Equipment Downtime:** Mark equipment as `status = 'down'` (e.g., broken, awaiting service) – which blocks any production task using that machine.
5. **Utilization Viewing:** View equipment utilization metrics (`setup_time`, `run_time`) to prioritize maintenance.
6. **Estimate Override:** Override estimated hours for emergency repairs (with justification).

**Responsibilities (What they are accountable for):**

1. **Equipment Uptime:** Keeping critical equipment operational and within calibration.
2. **Preventive Maintenance:** Scheduling preventive maintenance to minimize unplanned downtime.
3. **Documentation:** Documenting repair actions and parts used in task comments or attachments.
4. **Root Cause Reporting:** Reporting recurring equipment failures to Manufacturing Lead.
5. **Compliance:** Ensuring maintenance tasks are completed before `next_maintenance_date` exceeds threshold.

**Simple Story (Scooter Example):**

> The **Maintenance Lead** is the **CNC machine mechanic**. They create a task: “Lubricate CNC spindle every 200 hours.” When the machine breaks, they mark it “down” – which immediately blocks all tasks that need that CNC. Once fixed, they change status back to “active.” They don’t make scooter parts; they keep the machines that make parts running.

---

### Regulatory / Permit (MEP only)

> **Note:** This role applies only to Construction/MEP verticals. Manufacturing tenants do not have this role.

The **Regulatory / Permit** role manages interactions with **external authorities** (AHJ – Authority Having Jurisdiction) for permits, inspections, and compliance documentation.

**Authorities (What they can do):**

1. **Permit Documents:** Attach permit drawings and compliance docs to tasks.
2. **Inspection Milestones:** Record inspection milestones by AHJ (e.g., “Electrical rough-in passed”).
3. **Checklist Management:** Create permit‑specific checklist items (e.g., “Fire marshal approval obtained”).
4. **Approval Authority:** Mark permit‑related tasks as `approved` or `rejected`.
5. **Audit Access:** View all regulatory audit trails.

**Responsibilities (What they are accountable for):**

1. **Permit Acquisition:** Ensuring all permits are obtained before construction phases begin.
2. **Code Compliance:** Maintaining compliance with local codes.
3. **Timely Submittal:** Submitting documents to AHJ on time.
4. **Expiration Monitoring:** Flagging expiring permits.
5. **Inspection Coordination:** Scheduling and tracking AHJ inspections.

**Simple Story (Building a Factory – MEP Example):**

> The **Permit Expediter** is the **person who deals with the city**. They upload the electrical drawings, request an inspection, and mark “Electrical permit approved.” If the fire marshal rejects the sprinkler plan, they mark the task “rejected” and create a rework task for the design team. They don’t install pipes – they make sure the paperwork says it’s legal to install pipes.

---

### Equipment Custodian (Mfg only)

> **Note:** This role applies only to Manufacturing verticals. Construction/MEP tenants do not have this role.

The **Equipment Custodian** is responsible for the **equipment registry** – treating machines as first‑class assets with tracking, calibration, and assignment.

**Authorities (What they can do):**

1. **Equipment Records:** Create and update equipment records (serial number, location, calibration due date).
2. **Task Assignment:** Assign equipment to tasks.
3. **History & Utilization:** View maintenance history and utilization metrics.
4. **Status Control:** Set equipment operational status (`active`, `down`, `calibration_due`).
5. **Reservations:** Approve equipment reservations.

**Responsibilities (What they are accountable for):**

1. **Registry Accuracy:** Maintaining equipment registry accuracy.
2. **Calibration:** Ensuring calibration is current.
3. **Coordination:** Coordinating with Maintenance for repairs.
4. **Reporting:** Reporting utilization metrics to Planner/Scheduler.

**Simple Story (Scooter Example):**

> The **Equipment Custodian** is the **tool crib manager**. They know which CNC machine has a new spindle, which one is due for calibration next week, and which welder is assigned to Task #42. They don’t repair machines (that’s Maintenance) – they just know where every machine is, what state it’s in, and who is using it.

---

## Summary Table: Abstract Roles at a Glance

| Abstract Role | Domain | Can create tasks? | Can approve QC? | Equipment authority | Reports to |
|---------------|--------|-------------------|-----------------|---------------------|------------|
| Platform Owner | Both | ✅ (all orgs) | ✅ (override) | ✅ (all) | Board |
| Project Owner | Both | ✅ | ✅ | ✅ (link/unlink) | Platform Owner |
| Design Lead | Both | ✅ (design phases) | ✅ (design reviews) | ✅ (design tools) | Project Owner |
| Planner / Scheduler | Both | ✅ (top‑level) | ❌ | ❌ | Project Owner |
| Execution Worker | Both | ❌ (assigned only) | ❌ | ❌ (logs usage) | Team Lead |
| Quality Gatekeeper | Both | ✅ (QC tasks) | ✅ (all QC) | ❌ | Project Owner |
| Logistics / Handoff | Both | ✅ (inventory tasks) | ❌ | ❌ | Project Owner |
| Maintenance | Both | ✅ (maintenance tasks) | ❌ | ✅ (status change) | Project Owner |
| Regulatory / Permit | MEP only | ✅ (permit tasks) | ✅ (permit approvals) | ❌ | Project Owner |
| Equipment Custodian | Mfg only | ❌ (registers only) | ❌ | ✅ (assignment) | Project Owner |

---

## How to Map These Abstract Roles to Real Jobs

| Abstract Role | Manufacturing job titles | Construction/MEP job titles |
|---------------|--------------------------|-----------------------------|
| Platform Owner | System Administrator | System Administrator |
| Project Owner | Project Manager | Project Manager / Owner Rep |
| Design Lead | Design Engineer, CAD Technician | MEP Design Coordinator, BIM Technician |
| Planner / Scheduler | Production Planner, Supervisor | Construction Manager, Site Superintendent |
| Execution Worker | Machinist, CNC Programmer, Welder | Electrician, Plumber, HVAC Tech |
| Quality Gatekeeper | QC Inspector, Metrology Engineer | Commissioning Engineer, AHJ Inspector |
| Logistics / Handoff | Inventory Manager, Logistics Coordinator | Procurement Lead, Closeout Coordinator |
| Maintenance | Maintenance Technician | Facility Manager (post-handover) |
| Regulatory / Permit | — (not applicable) | Permit Expediter, AHJ Liaison |
| Equipment Custodian | Equipment / Machine Owner | — (assets tracked differently) |

---

**This completes the role definition for Tasktrone.** The platform is built on these abstract roles, with domain‑specific labels configurable per tenant. The same code, same database schema, same RLS policies – just different hats.