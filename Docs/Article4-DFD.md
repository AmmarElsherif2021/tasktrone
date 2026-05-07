# Data Flow Diagram

---

## Level 0 — Context Diagram

The context diagram shows the system boundary and the external actors that interact with Tasktrone.

**Actors:**

- **Platform Owner**
- **Project Owner**
- **Design Lead**
- **Planner / Scheduler**
- **Execution Worker**
- **Quality Gatekeeper**
- **Logistics / Handoff**
- **Maintenance**
- **Regulatory / Permit** *(MEP only, post‑MVP)*
- **Equipment Custodian** *(MFG only)*

Each actor sends and receives specific data flows — tasks, approvals, metrics, configuration changes — through the system.

---

## Level 1 — System Diagram

### Platform Owner:
## 1. Tenant (Organization) Lifecycle Management

The Platform Owner is the sole authority for creating, configuring, and retiring the organizations that house all projects and users.

| Process | Detail |
|---------|--------|
| **Create / Onboard Organization** | Register a new company tenant – assign a name, domain type (MFG or MEP), and initial configuration. |
| **Suspend / Deactivate Org** | Temporarily or permanently disable an entire tenant (e.g., non‑payment, contract end). |
| **Transfer Org Ownership** | Reassign the top‑level administrative authority of an organization to another user. |
| **Delete Org** | Permanently remove an organization and all its data, subject to retention policies. |
| **Manage Billing & Subscription** | Set subscription tiers, oversee usage‑based billing, and adjust plan limits per tenant. |
| **Configure Org‑Wide Settings** | Apply default security policies, feature flags (e.g., enable AI assistant), and storage quotas per tenant. |

---

## 2. User & Role Administration (System‑Wide)

Platform Owners manage who has access to the platform itself and what system‑level “hat” they wear, independent of any project.

| Process | Detail |
|---------|--------|
| **Approve / Revoke Platform Access** | Grant or deny login rights to the whole Tasktrone instance. |
| **Create & Manage Users** | Provision new user accounts for any organization. |
| **Assign System‑Wide Roles** | Set the `user_role` enum (e.g., Platform Owner, Project Owner, Execution Worker) that defines cross‑tenant base permissions. |
| **Define Role Permissions** | Configure the RBAC matrix – which system actions each role can perform (e.g., ability to override QC). |
| **Manage API Integration Users** | (Future) Create dedicated `api_integration` role accounts with scoped access for external systems. |

---

## 3. Global Configuration & Enum Management

Since the platform uses an abstract phase/role model that tenants only label, the Platform Owner owns the **base definitions** and their transition logic.

| Process | Detail |
|---------|--------|
| **Define Abstract Phase Lifecycle** | Set the core phases (Pending, Active, Review, Rework, Approved, Blocked, Done) and the valid transitions between them. |
| **Configure Phase Behaviours** | Define rules such as “WIP limits apply at the Active phase” and “dependency blocking prevents entry to Active.” |
| **Manage Global Enums** | Create/edit/remove domain‑agnostic enumerations: `task_category`, `quality_check_type`, `dependency_type`, `abstract_role_enum`, etc. |
| **Set Tenant‑Configurable Labels** | (If supported) Allow tenants to map their own localized names onto the abstract phases/roles. |
| **Define Default Templates** | Publish default board structures, swimlane criteria, and project templates that tenants can clone. |
| **Configure Authentication Methods** | Choose and enforce SSO methods, password policies, and session durations. |

---

## 4. Security & Compliance Oversight

The Platform Owner is accountable for the entire system’s security posture and regulatory readiness.

| Process | Detail |
|---------|--------|
| **Define Security Policy Framework** | Set rules for MFA, IP whitelisting, rate limiting, and audit log retention. |
| **Override Row‑Level Security (RLS)** | As the highest authority, temporarily bypass RLS policies to investigate data integrity issues. |
| **Monitor Compliance** | Ensure the platform meets ISO 27001 / SOC 2 controls – generate compliance reports, review access logs. |
| **Manage Data Retention & Deletion** | Set global retention periods, purge old audit trails, and enforce data‑sovereignty rules per tenant. |
| **Incident Response** | Coordinate response to security breaches, lock compromised accounts, and audit affected data. |

---

## 5. Audit & Monitoring

The Platform Owner can see every action taken by every user across every organization – a true god‑eye view.

| Process | Detail |
|---------|--------|
| **View Consolidated Audit Trails** | Search and filter `task_history` and system‑event logs globally, across all orgs. |
| **Monitor System Health** | Access platform‑wide dashboards for API uptime, error rates, and background job queues. |
| **Track Resource Usage** | Review per‑tenant consumption of storage, compute, and API calls for capacity planning. |
| **Export Forensic Reports** | Generate detailed logs for external audits or legal requests. |

---

## 6. Process & Workflow Governance

Because Tasktrone’s value hinges on consistent workflows, the Platform Owner defines the playbook that all tenants operate within.

| Process | Detail |
|---------|--------|
| **Define Core Process Definitions** | Decide what a “task” fundamentally looks like – required fields, lifecycle states, and mandatory relationships. |
| **Set Global Escalation Rules** | For example, “if a task stays in Blocked for > X hours, alert the Project Owner.” |
| **Approve New Workflow Patterns** | When a new vertical (e.g., a future pharmaceutical tenant) needs a custom phase or role, the Platform Owner reviews and integrates it into the abstract model. |
| **Publish Best‑Practice Templates** | Distribute pre‑configured board layouts, WIP limits, and checklists derived from high‑performing projects. |

---

## 7. System‑Level Operations (Beyond Tenants)

A few processes don’t fit neatly into categories but are critical for running the platform.

| Process | Detail |
|---------|--------|
| **Override Quality Checks** | For any task in any project, manually pass a failed QC check with justification. |
| **Access All Data** | View any record (tasks, boards, attachments, metrics) irrespective of org or project membership. |
| **Manage AI Layer Configuration** | (Post‑MVP) Enable/disable the AI assistant, set prompt templates, or manage OpenAI API keys. |
| **Trigger Global ETL Jobs** | Manually start a platform‑wide analytics refresh if the scheduled pipeline lags. |

---

### Project Owner:
## 1. Project Configuration & Lifecycle Management

The Project Owner has full authority over the project’s definition and its lifecycle.

| Process | Detail |
|---------|--------|
| **Create Project** | Initiate a new project under an organization, assigning a title, description, customer, and initial `current_abstract_phase`. |
| **Edit Project Metadata** | Update project’s title, description, customer, budget, priority, status, target dates. |
| **Advance Project Phase** | Manually move `current_abstract_phase` (if not automated) — triggers phase handoff automations and validations. |
| **Archive or Delete Project** | Archive a completed/cancelled project or permanently delete it (subject to retention policies). |

---

## 2. Membership & Role Governance

The Project Owner controls who can see and act on the project.

| Process | Detail |
|---------|--------|
| **Add Project Members** | Link existing platform users to the project via `project_members`, assigning a `project_abstract_role`. |
| **Remove Members** | Revoke a member’s access to the project, removing all associated task assignments and permissions. |
| **Change Member Roles** | Update a member’s `project_abstract_role` (e.g., promote to Design Lead). Role changes log to audit trail. |

---

## 3. Board & Workflow Design

The Project Owner configures the visual and logical structure of work tracking.

| Process | Detail |
|---------|--------|
| **Create & Configure Boards** | Define Kanban boards scoped to an `abstract_phase`, set board‑level WIP limits. |
| **Design Columns** | Add/reorder columns with types (todo, in_progress, review, done, custom) and column‑level WIP limits. |
| **Define Swimlanes** | Create swimlanes with JSONB criteria, colors, and positions to split a board by team or category. |
| **Customise Phase Mapping** | Map abstract phases to tenant‑specific labels and enforce transition rules at board level. |

---

## 4. Task Management & Oversight

The Project Owner has unrestricted control over tasks within the project.

| Process | Detail |
|---------|--------|
| **Create / Edit / Delete Tasks** | Create any task, assign it to a board/column, set title, category, priority, estimated_hours. |
| **Override Task Dependencies** | Manually adjust or bypass dependency constraints (e.g., force‑unblock a successor task). |
| **Assign & Reassign** | Assign a primary `assigned_to` user and additional `task_members` with specific roles. |
| **Approve or Reject QC Sign‑off** | Override a quality gatekeeper’s decision if the task requires managerial approval. |
| **Force Task Closure** | Mark a task `done` even if requirements are not completely satisfied (logs override reason). |

---

## 5. Metrics, Reporting & Audit

The Project Owner accesses all project analytics and historical data.

| Process | Detail |
|---------|--------|
| **View Operational Metrics** | Access `operational_metrics` (cycle time, lead time, defect rate, etc.) filtered by project. |
| **Generate Status Reports** | Create summary reports of task completion, WIP trends, and phase progress for stakeholders. |
| **Export Audit Trail** | Export `task_history` records for compliance reviews or external audits. |

---

## 6. Equipment & File Management

The Project Owner manages the resources attached to the project.

| Process | Detail |
|---------|--------|
| **Link Equipment to Tasks** | Create `task_equipment` assignments (specify start/end time or leave for worker to fill). |
| **Manage File Attachments** | View, delete, or restore versioned files; ensure `is_latest` flag integrity across attachments. |
| **Set File Requirements** | Define mandatory `task_requirements` with enforced file types for phase gates. |

---

### Design Lead:
## 1. Design Task Operations

The Design Lead manages the full lifecycle of design‑phase tasks.

| Process | Detail |
|---------|--------|
| **Create Design Tasks** | Create tasks in `Concept & Design` or `Prototyping` phases with appropriate categories (cad_models, design_specifications, bom). |
| **Assign Designers** | Set `assigned_to` and additional `task_members` (reviewer, supporter) from the Design team. |
| **Set Estimates & Deadlines** | Provide `estimated_hours`, `due_date`, and priority for design deliverables. |
| **Move Tasks Across Columns** | Drag design tasks through the board, with authority to override column WIP limits with justification. |

---

## 2. Design Review & Approval

The Design Lead is the gatekeeper for design quality before handoff.

| Process | Detail |
|---------|--------|
| **Review Design Deliverables** | Inspect attached CAD models, drawings, BOMs against project specifications. |
| **Approve / Reject** | Mark the design task as approved (allowing phase transition) or reject it, triggering a rework and notifying the designer. |
| **Request Changes** | Add comments with @mentions specifying required modifications; may log a design review QC check. |

---

## 3. Equipment Assignment (Design Tools)

| Process | Detail |
|---------|--------|
| **Assign Design Equipment** | Link equipment like 3D printers or CAD workstations to design tasks through `task_equipment`. |

---

## 4. Team Management

| Process | Detail |
|---------|--------|
| **Manage Design Team** | Add or remove designers from the project’s Design team; change a designer’s project‑level role if needed. |

---

## 5. Design Quality & Metrics

| Process | Detail |
|---------|--------|
| **Review Design Metrics** | View design phase cycle time, rework rate, and review turnaround. |
| **Monitor Design QC Checks** | See quality checks tagged as `design_review` or related to design output; respond to defects reported downstream. |

---

### Planner / Scheduler:
## 1. Master Scheduling

The Planner builds and maintains the project’s timeline.

| Process | Detail |
|---------|--------|
| **Set Task Dates** | Assign `start_date` and `due_date` on all top‑level tasks; override default cycle time estimates. |
| **Reorder Tasks** | Change task `position` within columns or reorder tasks on the board to optimise flow. |
| **Reschedule Disrupted Tasks** | When delays occur, adjust dates and dependencies across the affected task graph. |

---

## 2. Dependency & Critical Path Management

| Process | Detail |
|---------|--------|
| **Define Dependencies** | Create `task_dependencies` records (predecessor → successor) with `dependency_type` and `lag_time`. |
| **Identify Critical Path** | Analyse the dependency graph to highlight tasks that directly impact project completion. |
| **Communicate Critical Tasks** | Notify Project Owner and Team Leads of critical path items and potential bottlenecks. |

---

## 3. WIP Policy Enforcement

| Process | Detail |
|---------|--------|
| **Set Board‑Level WIP Limits** | Configure total WIP for a board to match team or machine capacity. |
| **Set Column‑Level WIP Limits** | Enforce per‑column limits (e.g., max 3 tasks in “Welding” column) to prevent overloading. |
| **Review WIP Exception Requests** | When a Design Lead asks to exceed a limit, the Planner can approve or deny with notes. |

---

## 4. Capacity Planning & Analytics

| Process | Detail |
|---------|--------|
| **View Capacity Metrics** | Access machine utilisation, operator hours, and throughput metrics. |
| **Perform Load Balancing** | Redistribute tasks across teams or shifts based on real‑time capacity data. |
| **Generate Weekly Progress Reports** | Provide schedule adherence and lead time reports to the Project Owner. |

---

### Execution Worker:
## 1. Task Execution

The Execution Worker performs the work and updates the system.

| Process | Detail |
|---------|--------|
| **Accept & Start Task** | Change task `status` from `todo` to `in_progress`, which may log a timestamp. |
| **Log Time** | Enter `actual_hours` against the task after completion (or incrementally). |
| **Complete Task** | Move status to `review` or directly to `done` if no approval gate is configured. |

---

## 2. Communication & Documentation

| Process | Detail |
|---------|--------|
| **Add Comments** | Post comments on the task, optionally @mentioning other users. |
| **Upload Attachments** | Attach files (e.g., photos of completed work, inspection forms) directly to the task; can link to a `task_requirement`. |

---

## 3. Equipment Usage Logging

| Process | Detail |
|---------|--------|
| **Record Equipment Times** | For linked equipment, fill `start_time`, `end_time`, `setup_time`, and `run_time` in `task_equipment`. |

---

## 4. Defect Reporting

| Process | Detail |
|---------|--------|
| **Flag a Quality Issue** | Create a `quality_check` record with `status = 'fail'` and a description of the defect, linking it to the task. |

---

### Quality Gatekeeper:
## 1. Quality Check Creation & Assignment

| Process | Detail |
|---------|--------|
| **Create QC Checks** | Define `quality_checks` for a task, specifying `check_type` (dimensional_check, weld_inspection, pressure_test…) and required measurements. |
| **Assign Inspectors** | Assign a user as `inspector_id` for each check, or allow any gatekeeper to execute. |

---

## 2. Inspection Execution & Pass/Fail

| Process | Detail |
|---------|--------|
| **Record Measurements** | Enter structured measurement data (JSONB) and `defects_found` count. |
| **Pass or Fail** | Mark check `status` as `passed`, `failed`, or `conditional`. A failure can auto‑block dependent tasks and create a rework requirement. |
| **Override with Justification** | Override a failed check to `passed` if the deviation is acceptable, with mandatory justification. |

---

## 3. Defect Tracking & Trend Analysis

| Process | Detail |
|---------|--------|
| **View Defect Rates** | Access aggregated defect statistics per task type, phase, or team. |
| **Generate QC Reports** | Produce phase‑gate compliance reports (e.g., all QC checks passed before Packaging & Shipping). |
| **Flag Recurring Defects** | Escalate patterns to the Project Owner or Design/Manufacturing leads for corrective action. |

---

## 4. Standards Enforcement

| Process | Detail |
|---------|--------|
| **Ensure Pre‑Phase Completion** | Verify that required `task_requirements` and quality checks are completed before a task can exit a review phase. |
| **Audit Trail Sign‑off** | All QC actions are written to `task_history` providing an immutable inspection record. |

---

### Logistics / Handoff:
## 1. Inventory & Material Tasking

| Process | Detail |
|---------|--------|
| **Create Inventory Tasks** | Create tasks for ordering, picking, kitting, and shipping materials (category: inventory_reports, order_processing). |
| **Assign Logistics Personnel** | Assign workers to logistics tasks; track completion. |
| **Record Receiving & Shipping** | Log quantities received/shipped; attach packing slips or photos. |

---

## 2. Stock Level Management

| Process | Detail |
|---------|--------|
| **Link Materials to Tasks** | Associate material stock records with tasks (future inventory table); automatically deduct quantities upon task completion. |
| **Monitor Stock Thresholds** | View current stock levels; flag when a material drops below reorder point, potentially generating a procurement task. |
| **Prevent Stockouts** | Alert affected tasks if a required material is unavailable, and raise a blocker. |

---

## 3. Dependency Gatekeeping

| Process | Detail |
|---------|--------|
| **Approve Material Dependencies** | When a task is blocked waiting for a material, approve that the material is now available, unblocking the task. |
| **Reject Unfulfilled Dependencies** | Reject a dependency if stock cannot be supplied, notifying the Planner for rescheduling. |

---

## 4. BOM & Budget Management

| Process | Detail |
|---------|--------|
| **Manage Bills of Materials** | Attach and version BOM documents to design or production tasks. |
| **Edit Material Budget** | If delegated by Project Owner, update the project `budget` field to reflect material cost changes. |

---

### Maintenance:
## 1. Preventive & Corrective Maintenance Tasking

| Process | Detail |
|---------|--------|
| **Create Maintenance Tasks** | Create tasks of category `maintenance_task` for any equipment, specifying corrective or preventive work. |
| **Schedule Preventive Maintenance** | Set `next_maintenance_date` after completing a PM; the system can auto‑generate tasks based on schedule. |
| **Assign Technicians** | Assign maintenance crew members to tasks. |

---

## 2. Equipment Status Management

| Process | Detail |
|---------|--------|
| **Mark Equipment Down** | Change equipment `status` to `down` or `pending_repair`, automatically blocking any production tasks that have that equipment assigned. |
| **Restore Equipment to Active** | After repair, set status back to `operational` or `active`, re‑enabling dependent tasks. |
| **Record Downtime** | Log the duration of downtime in `task_equipment` or via a maintenance report. |

---

## 3. Utilization & Root Cause Analysis

| Process | Detail |
|---------|--------|
| **View Equipment Utilization** | Access `run_time` and `setup_time` from task‑equipment logs to identify overused or underused machines. |
| **Report Recurring Failures** | Flag equipment with repeated failures and escalate to Manufacturing Lead or Equipment Custodian for replacement/upgrade decisions. |

---

## 4. Maintenance Documentation

| Process | Detail |
|---------|--------|
| **Document Repairs** | Add comments and attach repair reports, spare parts lists, or calibration certificates to maintenance tasks. |
| **Override Estimates for Emergencies** | For urgent repairs, override `estimated_hours` with justification logged in the task history. |

---

### Regulatory / Permit *(MEP only – post‑MVP)*
## 1. Permit Document Management

| Process | Detail |
|---------|--------|
| **Attach Permit Drawings** | Upload and version permit drawings and compliance documents to tasks, tagged with `file_category = 'permit'`. |
| **Monitor Expiration Dates** | Track permit expiry; trigger alerts and block tasks if a permit lapses before closure. |

---

## 2. Inspection Milestone Tracking

| Process | Detail |
|---------|--------|
| **Record AHJ Inspections** | Log inspection milestones (e.g., “Electrical rough‑in passed”) with date, inspector, and outcome. |
| **Update Permit Status** | Mark permit‑related tasks as `approved` or `rejected` based on AHJ feedback, updating abstract phase accordingly. |

---

## 3. Checklist & Compliance Management

| Process | Detail |
|---------|--------|
| **Create Permit‑Specific Checklists** | Define mandatory checklist items for permit tasks (e.g., “Fire marshal approval obtained”). |
| **Manage Code Compliance** | Attach code references and ensure all regulatory requirements are completed before phase transitions. |

---

## 4. Compliance Auditing

| Process | Detail |
|---------|--------|
| **Access Regulatory Audit Trail** | View all permit‑related `task_history` entries to demonstrate compliance to authorities. |

---

### Equipment Custodian *(MFG only)*
## 1. Equipment Registry Management

| Process | Detail |
|---------|--------|
| **Register New Equipment** | Create `equipment` records with name, model, manufacturer, serial number, location, and initial status. |
| **Update Equipment Details** | Modify records as assets move, get recalibrated, or are decommissioned; maintain audit trail of changes. |

---

## 2. Equipment Assignment & Reservation

| Process | Detail |
|---------|--------|
| **Assign to Tasks** | Link equipment to tasks via `task_equipment` (can be done directly or approved from reservation requests). |
| **Manage Reservations** | Approve or deny equipment reservations from other teams to prevent conflicts; set future availability windows. |

---

## 3. Utilization & Status Tracking

| Process | Detail |
|---------|--------|
| **Set Operational Status** | Change equipment `status` (active, down, calibration_due, maintenance, decommissioned) as the physical asset changes. |
| **Monitor Utilization** | View run‑time logs and utilization percentages across projects. |

---

## 4. Calibration & Maintenance Coordination

| Process | Detail |
|---------|--------|
| **Track Calibration Deadlines** | Ensure `next_maintenance` / `calibration_due` dates are current; work with Maintenance to schedule calibration tasks. |
| **Report Utilization to Planner** | Provide equipment availability and utilisation data for capacity planning. |

---
```mermaid
graph LR

  subgraph External_Entities
    POwner[Platform owner]
    PjOwner[Project owner]
    DLead[Design lead]
    Planner[Planner / scheduler]
    ExecWorker[Execution worker]
    QGatekeeper[Quality gatekeeper]
    Logistics[Logistics / handoff]
    Maintenance[Maintenance]
    RegPermit[Regulatory / permit MEP only]
    EquipCust[Equipment custodian MFG only]
  end

  subgraph DS["Data Stores"]
    DS1[(DS1 organizations)]
    DS2[(DS2 users)]
    DS3[(DS3 projects)]
    DS4[(DS4 project_members)]
    DS5[(DS5 boards / columns / swimlanes)]
    DS6[(DS6 tasks)]
    DS7[(DS7 task_members)]
    DS8[(DS8 task_dependencies)]
    DS9[(DS9 task_requirements)]
    DS10[(DS10 attachments)]
    DS11[(DS11 comments)]
    DS12[(DS12 equipment / task_equipment)]
    DS13[(DS13 quality_checks)]
    DS14[(DS14 operational_metrics)]
    DS15[(DS15 task_history - audit)]
  end

  subgraph Platform_Owner_Processes
    PO1["1. Tenant lifecycle<br/>create / suspend / delete org"]
    PO2["2. User & role admin<br/>approve access, assign roles"]
    PO3["3. Global config / enums<br/>phases, templates, auth"]
    PO4["4. Security & compliance<br/>RLS, policy, incidents"]
    PO5["5. Audit & monitoring<br/>task_history, system health"]
    PO6["6. Process governance<br/>escalation, templates"]
  end

  %% Platform Owner flows
  POwner -->|create/config org| PO1
  PO1 -->|write org record| DS2
  PO2 -->|provision user, assign system role| DS2
  PO3 -.->|global config| DS1
  PO4 -->|write audit event| DS15
  DS15 -.->|read audit| PO5
  PO5 -.->|health / tenant / security reports| POwner

  %% Project Owner flows
  PjOwner -->|project config| PjO1
  PjO1 -->|write project record| DS3
  PjO2 -->|write member + role| DS4
  PjO3 -->|write board/column/swimlane| DS5
  PjO4 -->|task CRUD| DS6
  PjO4 -.->|QC override| DS13
  DS14 -.->|metrics| PjO5
  PjO5 -.->|dashboards, phase views, metrics| PjOwner
  PjO6 -->|link equipment| DS12
  PjO6 -->|file requirements| DS9

  %% Design Lead flows
  DLead -->|task creation| DL1
  DL1 -->|write design task| DS6
  DL2 -->|update task status| DS6
  DL2 -.->|quality check| DS13
  DL2 -.->|comments| DS11
  DL3 -->|assign equipment| DS12
  DL4 -->|manage team| DS4
  DS14 -.->|metrics| DL5
  DL5 -.->|design queue, attachments, metrics| DLead

  %% Planner flows
  Planner -->|schedule changes| PL1
  PL1 -->|update due_date / position| DS6
  PL2 -->|write dependency| DS8
  PL3 -->|WIP limits| DS5
  DS14 -.->|metrics| PL4
  DS12 -.->|equipment usage| PL4
  PL4 -.->|critical path, capacity, workload reports| Planner

  %% Execution Worker flows
  ExecWorker -->|status updates| EW1
  EW1 -->|update task status / hours| DS6
  EW1 -->|write history| DS15
  EW2 -->|add comment| DS11
  EW2 -->|upload attachment| DS10
  EW3 -->|log equipment usage| DS12
  EW4 -->|flag defect| DS13
  DS6 -.->|read tasks| EW1

  %% Quality Gatekeeper flows
  QGatekeeper --> QC1
  QC1 -->|define checks| DS13
  QC2 -->|record inspection| DS13
  QC2 -->|audit inspection| DS15
  DS13 -.->|read defects| QC3
  QC4 -.->|standards requirement| DS9
  QC3 -.->|QC checklists, defect reports, quality metrics| QGatekeeper

  %% Logistics flows
  Logistics --> LG1
  LG1 -->|logistics task| DS6
  LG3 -->|material dependency| DS8
  LG4 -->|attach BOM| DS10
  LG4 -.->|project budget| DS3
  LG2 -.->|stock levels, BOM, availability alerts| Logistics

  %% Maintenance flows
  Maintenance --> MT1
  MT1 -->|maintenance task| DS6
  MT2 -->|equipment status| DS12
  DS12 -.->|read equipment| MT3
  MT4 -->|repair reports| DS11
  MT4 -->|calibration docs| DS10
  MT3 -.->|equipment registry, schedules, utilisation| Maintenance

  %% Regulatory / Permit flows
  RegPermit -.-> RP1
  RP1 -.->|upload permits| DS10
  RP2 -.->|create milestone tasks| DS6
  RP3 -.->|compliance requirements| DS9
  RP3 -.->|permit tasks, compliance checklists, expiry alerts| RegPermit

  %% Equipment Custodian flows
  EquipCust -.-> EC1
  EC1 -.->|equipment registry| DS12
  EC2 -.->|assign equipment| DS12
  EC3 -.->|status & utilisation| DS12
  DS12 -.->|calibration data| EC4
  EC4 -.->|full registry, calibration alerts| EquipCust
  ```