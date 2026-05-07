## 'abstract_phase_enum' :
 [
    'pending',
    'active',
    'review_inspection',
    'rework',
    'approved',
    'blocked',
    'done_closed'
  ],
  ## 'abstract_role_enum' :
   [
    'platform_owner',
    'project_owner',
    'design_lead',
    'planner_scheduler',
    'execution_worker',
    'quality_gatekeeper',
    'logistics_handoff',
    'maintenance',
    'regulatory_permit',
    'equipment_custodian'
  ],
  ## 'abstract_team_enum' :
   [
    'design',
    'execution',
    'quality',
    'logistics',
    'planning',
    'maintenance',
    'regulatory'
  ],
  ## 'board_type_enum' :
   [ 'standard', 'multi_team', 'specialized' ],
  ## 'change_type_enum' :
   [
    'created',
    'updated',
    'status_changed',
    'assigned',
    'deadline_changed',
    'priority_changed',
    'dependency_added',
    'phase_advanced',
    'abstract_phase_changed',
    'equipment_assigned',
    'equipment_unassigned',
    'qc_check_created',
    'qc_passed',
    'qc_failed',
    'task_blocked',
    'task_unblocked',
    'permit_submitted',
    'permit_approved',
    'permit_rejected'
  ],
  ## 'column_type_enum' :
   [ 'todo', 'in_progress', 'review', 'done', 'custom' ],
  ## 'dependency_type_enum' :
   [
    'finish_to_start',
    'start_to_start',
    'finish_to_finish',
    'start_to_finish'
  ],
  ## 'domain_type_enum' :
   [ 'mfg', 'mep' ],
  ## 'equipment_status_enum' :
   [
    'active',
    'down',
    'calibration_due',
    'operational',
    'maintenance',
    'decommissioned',
    'pending_repair'
  ],
  ## 'file_category_enum' :
   [
    'design',
    'manufacturing',
    'quality_control',
    'specification',
    'process',
    'instruction',
    'report',
    'inventory',
    'logistics',
    'permit',
    'compliance',
    'inspection_certificate',
    'bim_model',
    'closeout_document',
    'safety_plan',
    'contract',
    'procurement_doc'
  ],
  ## 'file_type_enum' :
   [
    'cad',      'cnc',
    'pdf',      'spreadsheet',
    'document', 'image',
    'other',    'bim',
    'video',    'archive'
  ],
  ## 'metric_type_enum' :
   [
    'cycle_time',
    'lead_time',
    'defect_rate',
    'machine_utilization',
    'throughput',
    'rework_rate',
    'on_time_delivery',
    'cost_variance',
    'inspection_pass_rate',
    'permit_cycle_time',
    'punch_list_closure_rate',
    'schedule_variance'
  ],
  ## 'priority_level' :
   [ 'low', 'medium', 'high', 'critical' ],
  ## 'project_abstract_role_enum' :
   [
    'platform_owner',
    'project_owner',
    'design_lead',
    'planner_scheduler',
    'execution_worker',
    'quality_gatekeeper',
    'logistics_handoff',
    'maintenance',
    'regulatory_permit',
    'equipment_custodian',
    'observer'
  ],
  ## 'project_status' :
   [ 'active', 'completed', 'on_hold', 'cancelled' ],
  ## 'qc_check_type_enum' :
   [
    'dimensional_check',
    'tolerance_verification',
    'functional_test',
    'visual_inspection',
    'material_verification',
    'calibration_check',
    'compliance_verification',
    'ahj_inspection',
    'commissioning_test',
    'pressure_test',
    'continuity_test',
    'load_test',
    'permit_compliance',
    'design_review'
  ],
  ## 'qc_status_enum' :
   [ 'pending', 'in_progress', 'passed', 'failed', 'conditional' ],
  ## 'requirement_type_enum' :
   [
    'input_file',
    'output_file',
    'specification',
    'documentation',
    'inspection_report',
    'test_result'
  ],
  ## 'task_assignment_role_enum' :
   [ 'primary_assignee', 'reviewer', 'supporter', 'approver' ],
  ## 'task_category_enum' :
   [
    'cad_models',          'design_specifications',
    'bom',                 'change_requests',
    'cnc_programming',     'tool_instructions',
    'process_plans',       'production_layouts',
    'improvement_reports', 'machined_parts',
    'tool_logs',           'production_output',
    'setup_documentation', 'production_schedules',
    'performance_records', 'inspections',
    'calibration_records', 'spc_charts',
    'inventory_reports',   'order_processing',
    'vendor_reports',      'capacity_planning',
    'maintenance_logs',    'equipment_schedules',
    'employee_records',    'shipment_schedules',
    'logistics_reports',   'design_task',
    'execution_task',      'quality_task',
    'logistics_task',      'planning_task',
    'maintenance_task',    'regulatory_task',
    'permit_submission',   'rfi',
    'submittal',           'commissioning_task',
    'punch_list_item',     'closeout_task'
  ],
  ## 'task_status' :
   [ 'todo', 'in_progress', 'review', 'done' ]