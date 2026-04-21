# Tasktrone Manufacturing Kanban Tool - Entity Relationship Diagram

## Tables and Relationships

### Core User Management

#### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| username | TEXT | UNIQUE, NOT NULL |
| email | TEXT | UNIQUE, NOT NULL |
| full_name | TEXT | |
| role | user_role | NOT NULL |
| team | team_type | NOT NULL |
| department | TEXT | |
| phone | TEXT | |
| projects | UUID[] | FK → boards(id), CASCADE | (This should store the projects the user has joined is this necessary/ right?)
| is_active | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

---

### Project Management

#### projects
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| title | TEXT | NOT NULL |
| description | TEXT | |
| project_number | TEXT | UNIQUE |
| customer | TEXT | |
| start_date | TIMESTAMPTZ | |
| target_completion_date | TIMESTAMPTZ | |
| actual_completion_date | TIMESTAMPTZ | |
| current_phase | manufacturing_phase | DEFAULT 'concept_design' |
| priority | priority_level | DEFAULT 'medium' |
| wip_limit | INTEGER | NOT NULL, DEFAULT 5 |
| status | TEXT | DEFAULT 'active' |
| budget | DECIMAL(12,2) | |
| created_by | UUID | FK → users(id), NOT NULL |
| project_manager | UUID | FK → users(id) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

---

### Kanban Board System

#### boards
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| project_id | UUID | FK → projects(id), CASCADE |
| name | TEXT | NOT NULL |
| description | TEXT | |
| is_default | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

#### board_columns (Is this necessary to be handled in a separate column?)
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| board_id | UUID | FK → boards(id), CASCADE |
| name | TEXT | NOT NULL |
| position | INTEGER | NOT NULL |
| wip_limit | INTEGER | |
| column_type | TEXT | DEFAULT 'standard' |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

#### swimlanes (also this should be retrieved using backend functionalities or wrapped in other columns)
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| board_id | UUID | FK → boards(id), CASCADE |
| name | TEXT | NOT NULL |
| description | TEXT | |
| criteria | JSONB | |
| color | TEXT | |
| position | INTEGER | NOT NULL |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

---

### Task Management

#### tasks
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| project_id | UUID | FK → projects(id), NOT NULL |
| board_id | UUID | FK → boards(id) |
| column_id | UUID | FK → board_columns(id) |
| title | TEXT | NOT NULL |
| description | TEXT | |
| task_number | TEXT | |
| task_category | TEXT | CHECK constraint |
| phase | manufacturing_phase | |
| status | task_status | DEFAULT 'todo' |
| priority | priority_level | DEFAULT 'medium' |
| estimated_hours | DECIMAL(8,2) | |
| actual_hours | DECIMAL(8,2) | |
| due_date | TIMESTAMPTZ | |
| start_date | TIMESTAMPTZ | |
| completion_date | TIMESTAMPTZ | |
| lead_time | INTEGER | |
| cycle_time | INTEGER | DEFAULT 0 |
| position | INTEGER | |
| parent_task_id | UUID | FK → tasks(id) |
| created_by | UUID | FK → users(id), NOT NULL |
| assigned_to | UUID | FK → users(id) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

#### task_dependencies
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| predecessor_task_id | UUID | FK → tasks(id), CASCADE |
| successor_task_id | UUID | FK → tasks(id), CASCADE |
| dependency_type | TEXT | DEFAULT 'finish_to_start' |
| lag_time | INTEGER | DEFAULT 0 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| | | UNIQUE(predecessor_task_id, successor_task_id) |

#### task_requirements
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| task_id | UUID | FK → tasks(id), CASCADE |
| requirement_type | TEXT | CHECK constraint |
| description | TEXT | NOT NULL |
| file_types | TEXT[] | |
| is_mandatory | BOOLEAN | DEFAULT true |
| is_completed | BOOLEAN | DEFAULT false |
| completed_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

---

### Many-to-Many Relationships

#### project_members
| Column | Type | Constraints |
|--------|------|-------------|
| project_id | UUID | PK, FK → projects(id), CASCADE |
| user_id | UUID | PK, FK → users(id), CASCADE |
| role | TEXT | |
| joined_at | TIMESTAMPTZ | DEFAULT NOW() |

#### task_members
| Column | Type | Constraints |
|--------|------|-------------|
| task_id | UUID | PK, FK → tasks(id), CASCADE |
| user_id | UUID | PK, FK → users(id), CASCADE |
| role | TEXT | |
| assigned_at | TIMESTAMPTZ | DEFAULT NOW() |

#### task_swimlanes
| Column | Type | Constraints |
|--------|------|-------------|
| task_id | UUID | PK, FK → tasks(id), CASCADE |
| swimlane_id | UUID | PK, FK → swimlanes(id), CASCADE |
| assigned_at | TIMESTAMPTZ | DEFAULT NOW() |

---

### File Management

#### attachments
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| task_id | UUID | FK → tasks(id) |
| project_id | UUID | FK → projects(id) |
| requirement_id | UUID | FK → task_requirements(id) |
| file_name | TEXT | NOT NULL |
| original_name | TEXT | NOT NULL |
| file_type | TEXT | NOT NULL |
| file_category | TEXT | CHECK constraint |
| file_size | BIGINT | NOT NULL |
| storage_path | TEXT | NOT NULL |
| version | INTEGER | DEFAULT 1 |
| is_latest | BOOLEAN | DEFAULT true |
| uploaded_by | UUID | FK → users(id), NOT NULL |
| uploaded_at | TIMESTAMPTZ | DEFAULT NOW() |

---

### Manufacturing Specific

#### equipment
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| name | TEXT | NOT NULL |
| model | TEXT | |
| manufacturer | TEXT | |
| serial_number | TEXT | UNIQUE |
| location | TEXT | |
| status | TEXT | DEFAULT 'operational' |
| last_maintenance | TIMESTAMPTZ | |
| next_maintenance | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

#### task_equipment
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| task_id | UUID | FK → tasks(id), CASCADE |
| equipment_id | UUID | FK → equipment(id) |
| start_time | TIMESTAMPTZ | |
| end_time | TIMESTAMPTZ | |
| setup_time | INTEGER | |
| run_time | INTEGER | |
| notes | TEXT | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

#### quality_checks
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| task_id | UUID | FK → tasks(id), NOT NULL |
| inspector_id | UUID | FK → users(id), NOT NULL |
| check_type | TEXT | NOT NULL |
| status | TEXT | DEFAULT 'pending' |
| notes | TEXT | |
| measurements | JSONB | |
| defects_found | INTEGER | DEFAULT 0 |
| checked_at | TIMESTAMPTZ | DEFAULT NOW() |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

#### manufacturing_metrics
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| project_id | UUID | FK → projects(id) |
| task_id | UUID | FK → tasks(id) |
| metric_type | TEXT | NOT NULL, CHECK constraint |
| value | DECIMAL(12,4) | NOT NULL |
| unit | TEXT | |
| measurement_date | TIMESTAMPTZ | DEFAULT NOW() |
| measured_by | UUID | FK → users(id) |
| notes | TEXT | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

---

### Communication & Audit

#### comments
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| task_id | UUID | FK → tasks(id) |
| project_id | UUID | FK → projects(id) |
| author_id | UUID | FK → users(id), NOT NULL |
| content | TEXT | NOT NULL |
| is_system_generated | BOOLEAN | DEFAULT false |
| mentioned_users | UUID[] | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

#### task_history
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| task_id | UUID | FK → tasks(id), CASCADE |
| changed_by | UUID | FK → users(id), NOT NULL |
| field_name | TEXT | NOT NULL |
| old_value | TEXT | |
| new_value | TEXT | |
| change_type | TEXT | CHECK constraint |
| changed_at | TIMESTAMPTZ | DEFAULT NOW() |

---

## Key Relationships Summary

### One-to-Many Relationships:
- **users** → **projects** (created_by, project_manager)
- **users** → **tasks** (created_by, assigned_to)
- **users** → **attachments** (uploaded_by)
- **users** → **comments** (author_id)
- **users** → **quality_checks** (inspector_id)
- **users** → **manufacturing_metrics** (measured_by)
- **users** → **task_history** (changed_by)
- **projects** → **boards**
- **projects** → **tasks**
- **boards** → **board_columns**
- **boards** → **swimlanes**
- **board_columns** → **tasks**
- **tasks** → **tasks** (parent_task_id - self-reference)
- **tasks** → **task_requirements**
- **tasks** → **attachments**
- **tasks** → **task_equipment**
- **tasks** → **quality_checks**
- **tasks** → **comments**
- **tasks** → **task_history**
- **equipment** → **task_equipment**
- **task_requirements** → **attachments**

### Many-to-Many Relationships:
- **projects** ↔ **users** (via project_members)
- **tasks** ↔ **users** (via task_members)
- **tasks** ↔ **swimlanes** (via task_swimlanes)

### Self-Referencing Relationships:
- **tasks** → **tasks** (parent-child hierarchy)
- **tasks** ↔ **tasks** (via task_dependencies)

---

## Enum Types

### user_role
- design_engineer
- cad_technician
- cnc_programmer
- manufacturing_engineer
- machinist
- machine_operator
- production_supervisor
- qc_inspector
- metrology_engineer
- inventory_manager
- production_planner
- maintenance_technician
- hr_personnel
- logistics_coordinator

### team_type
- design_team
- manufacturing_team
- quality_control_team
- support_teams

### priority_level
- low
- medium
- high
- critical

### manufacturing_phase
- concept_design
- prototyping
- pre_production_planning
- production
- quality_control
- assembly_testing
- packaging_shipping
- maintenance_support

### task_status
- todo
- in_progress
- review
- done

---

## Indexes for Performance

- idx_tasks_project_id ON tasks(project_id)
- idx_tasks_assigned_to ON tasks(assigned_to)
- idx_tasks_status ON tasks(status)
- idx_tasks_due_date ON tasks(due_date)
- idx_attachments_task_id ON attachments(task_id)
- idx_comments_task_id ON comments(task_id)
- idx_task_history_task_id ON task_history(task_id)
- idx_manufacturing_metrics_project_task ON manufacturing_metrics(project_id, task_id)

---

## Notes for Draw.io Implementation

1. **Primary Keys**: All tables use UUID as primary keys
2. **Foreign Keys**: Clearly marked with FK → target_table(column)
3. **Cascade Deletes**: Marked where applicable for referential integrity
4. **Check Constraints**: Enum types and value restrictions noted
5. **Unique Constraints**: Username, email, project_number, serial_number
6. **Default Values**: Timestamps, boolean flags, and enum defaults specified
7. **Array Types**: TEXT[] for file_types and mentioned_users
8. **JSON Types**: JSONB for flexible data storage (criteria, measurements)

This structure supports the complete manufacturing workflow from concept to delivery with proper audit trails, quality control, and performance metrics tracking.