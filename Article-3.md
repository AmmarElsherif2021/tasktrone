# I have finished version 0.0 of Tasktrone entities relationships diagram:
### ERD Diagram:
``` mermaid
    erDiagram
    users {
        uuid id PK
        text username UK
        text email UK
        text full_name
        text department
        text phone
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
        abstract_role_enum abstract_role
        abstract_team_enum abstract_team
        text job_title
    }

    organizations {
        uuid id PK
        text name
        domain_type_enum domain_type
        jsonb phase_labels
        jsonb role_labels
        jsonb team_labels
        boolean is_active
        uuid created_by FK
        timestamptz created_at
        timestamptz updated_at
    }

    projects {
        uuid id PK
        text title
        text description
        text customer
        timestamptz start_date
        timestamptz target_completion_date
        timestamptz actual_completion_date
        priority_level priority
        project_status status
        numeric budget
        uuid created_by FK
        uuid project_manager FK
        timestamptz created_at
        timestamptz updated_at
        abstract_phase_enum current_abstract_phase
        domain_type_enum domain_type
        uuid org_id FK
        jsonb phase_config
    }

    boards {
        uuid id PK
        uuid project_id FK
        text name
        text description
        board_type_enum board_type
        boolean is_active
        integer wip_limit
        timestamptz created_at
        timestamptz updated_at
        abstract_phase_enum abstract_phase
    }

    board_columns {
        uuid id PK
        uuid board_id FK
        text name
        integer position
        integer wip_limit
        column_type_enum column_type
        timestamptz created_at
    }

    swimlanes {
        uuid id PK
        uuid board_id FK
        text name
        text description
        jsonb criteria
        text color
        integer position
        timestamptz created_at
    }

    tasks {
        uuid id PK
        uuid project_id FK
        uuid board_id FK
        uuid column_id FK
        text title
        text description
        text task_number
        task_category_enum task_category
        task_status status
        priority_level priority
        numeric estimated_hours
        numeric actual_hours
        timestamptz due_date
        timestamptz start_date
        timestamptz completion_date
        integer lead_time
        integer cycle_time
        integer position
        uuid parent_task_id FK
        uuid created_by FK
        uuid assigned_to FK
        timestamptz created_at
        timestamptz updated_at
        abstract_phase_enum abstract_phase
    }

    project_members {
        uuid project_id FK
        uuid user_id FK
        timestamptz joined_at
        project_abstract_role_enum abstract_role
    }

    task_members {
        uuid task_id FK
        uuid user_id FK
        task_assignment_role_enum role
        timestamptz assigned_at
    }

    task_dependencies {
        uuid id PK
        uuid predecessor_task_id FK
        uuid successor_task_id FK
        dependency_type_enum dependency_type
        integer lag_time
        timestamptz created_at
    }

    task_requirements {
        uuid id PK
        uuid task_id FK
        requirement_type_enum requirement_type
        text description
        text[] file_types
        boolean is_mandatory
        boolean is_completed
        timestamptz completed_at
        timestamptz created_at
    }

    task_swimlanes {
        uuid task_id FK
        uuid swimlane_id FK
        timestamptz assigned_at
    }

    task_equipment {
        uuid id PK
        uuid task_id FK
        uuid equipment_id FK
        timestamptz start_time
        timestamptz end_time
        integer setup_time
        integer run_time
        text notes
        timestamptz created_at
    }

    task_history {
        uuid id PK
        uuid task_id FK
        uuid changed_by FK
        text field_name
        text old_value
        text new_value
        change_type_enum change_type
        timestamptz changed_at
    }

    attachments {
        uuid id PK
        uuid task_id FK
        uuid project_id FK
        uuid requirement_id FK
        text file_name
        text original_name
        file_type_enum file_type
        file_category_enum file_category
        bigint file_size
        text storage_path
        integer version
        boolean is_latest
        uuid uploaded_by FK
        timestamptz uploaded_at
    }

    comments {
        uuid id PK
        uuid task_id FK
        uuid project_id FK
        uuid author_id FK
        text content
        boolean is_system_generated
        uuid[] mentioned_users
        timestamptz created_at
        timestamptz updated_at
    }

    equipment {
        uuid id PK
        text name
        text model
        text manufacturer
        text serial_number UK
        text location
        equipment_status_enum status
        timestamptz last_maintenance
        timestamptz next_maintenance
        timestamptz created_at
        timestamptz updated_at
    }

    operational_metrics {
        uuid id PK
        uuid project_id FK
        uuid task_id FK
        metric_type_enum metric_type
        numeric value
        text unit
        timestamptz measurement_date
        uuid measured_by FK
        text notes
        timestamptz created_at
    }

    quality_checks {
        uuid id PK
        uuid task_id FK
        uuid inspector_id FK
        qc_check_type_enum check_type
        qc_status_enum status
        text notes
        jsonb measurements
        integer defects_found
        timestamptz checked_at
        timestamptz created_at
    }

    %% Relationships

    organizations ||--o{ projects : "org_id"
    users ||--o{ organizations : "created_by"

    users ||--o{ projects : "created_by"
    users ||--o{ projects : "project_manager"

    projects ||--o{ boards : "project_id"
    boards ||--o{ board_columns : "board_id"
    boards ||--o{ swimlanes : "board_id"

    projects ||--o{ tasks : "project_id"
    boards ||--o{ tasks : "board_id"
    board_columns ||--o{ tasks : "column_id"
    tasks ||--o{ tasks : "parent_task_id"
    users ||--o{ tasks : "created_by"
    users ||--o{ tasks : "assigned_to"

    projects ||--o{ project_members : "project_id"
    users ||--o{ project_members : "user_id"

    tasks ||--o{ task_members : "task_id"
    users ||--o{ task_members : "user_id"

    tasks ||--o{ task_dependencies : "predecessor_task_id"
    tasks ||--o{ task_dependencies : "successor_task_id"

    tasks ||--o{ task_requirements : "task_id"

    tasks ||--o{ task_swimlanes : "task_id"
    swimlanes ||--o{ task_swimlanes : "swimlane_id"

    tasks ||--o{ task_equipment : "task_id"
    equipment ||--o{ task_equipment : "equipment_id"

    tasks ||--o{ task_history : "task_id"
    users ||--o{ task_history : "changed_by"

    tasks ||--o{ attachments : "task_id"
    projects ||--o{ attachments : "project_id"
    task_requirements ||--o{ attachments : "requirement_id"
    users ||--o{ attachments : "uploaded_by"

    tasks ||--o{ comments : "task_id"
    projects ||--o{ comments : "project_id"
    users ||--o{ comments : "author_id"

    projects ||--o{ operational_metrics : "project_id"
    tasks ||--o{ operational_metrics : "task_id"
    users ||--o{ operational_metrics : "measured_by"

    tasks ||--o{ quality_checks : "task_id"
    users ||--o{ quality_checks : "inspector_id"
    ```
    