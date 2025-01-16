# Tasktrone: Mechanical Assembly Factory Kanban Tool Documentation

## 1. Introduction

### 1.1 Purpose

This document provides comprehensive documentation for a Kanban tool specifically designed for mechanical assembly factory operations. The tool aims to improve productivity, workflow visualization, and overall operational efficiency in manufacturing environments.

### 1.2 Scope

This documentation covers the system architecture, features, user roles, data handling, and implementation guidelines for the Kanban tool.

## 2. System Overview

### 2.1 System Architecture

The Kanban tool, Tasktrone, is designed as a web-based application with mobile compatibility, featuring:

- Frontend interface with drag-and-drop functionality
- Backend server for data processing and storage
- Real-time updates system
- Integration capabilities with existing factory systems

### 2.2 User Groups and Roles

#### Primary User Groups:

1. Design Team

   - Design Engineers
   - CAD Technicians

2. Manufacturing Team

   - CNC Programmers
   - Manufacturing Engineers
   - Machinists
   - Machine Operators
   - Production Supervisors

3. Quality Control Team

   - Quality Control Inspectors
   - Metrology Engineers

4. Support Teams
   - Inventory Managers
   - Production Planners
   - Maintenance Technicians
   - HR Personnel
   - Logistics Coordinators

## 3. Core Features

### 3.1 Task Management

#### 3.1.1 Task Creation

- Title and description
- Priority levels (High, Medium, Low)
- Due dates and deadlines
- Assignment capabilities
- File attachment support

#### 3.1.2 Task Categories

- Design tasks
- Manufacturing operations
- Quality control checks
- Maintenance activities
- Inventory management
- Logistics operations

##### Tasks specifications:

| **Team**                       | **Task**             | **Deliverables**                                 | **Sent/Required Files**                                                  |
| ------------------------------ | -------------------- | ------------------------------------------------ | ------------------------------------------------------------------------ |
| **Design Engineers**           | CAD Models           | 3D Models, Design Validation Reports             | CAD Files (`.dwg`, `.stp`), Validation Reports (`.pdf`)                  |
|                                | Design Specs         | Detailed Design Specifications                   | Design Specification Documents (`.docx`, `.pdf`)                         |
|                                | BOM                  | Bill of Materials                                | BOM Documents (`.xls`, `.xlsx`)                                          |
|                                | Change Requests      | Design Change Requests                           | Change Request Forms (`.docx`, `.xlsx`)                                  |
| **CAD Technicians**            | CAD Drawings         | 2D Drawings, 3D Models, Assembly Instructions    | CAD Files (`.dwg`, `.stl`), Instruction Sheets (`.docx`)                 |
| **CNC Programmers**            | CNC Programming      | CNC Programming Files, Setup Sheets              | CNC Programs (`.nc`, `.cnc`), Setup Sheets (`.docx`)                     |
|                                | Tool Instructions    | Tooling Instructions                             | Tool Instruction Manuals (`.pdf`, `.docx`)                               |
| **Manufacturing Engineers**    | Process Plans        | Process Plans, Work Instructions                 | Process Plans (`.docx`, `.pdf`), Work Instructions (`.docx`)             |
|                                | Production Layouts   | Production Layouts, Engineering Change Requests  | Layout Diagrams (`.pdf`), Change Request Forms (`.docx`)                 |
|                                | Improvement Reports  | Process Improvement Reports                      | Improvement Reports (`.docx`, `.pdf`)                                    |
| **Machinists**                 | Machined Parts       | Machined Parts, Inspection Reports               | Inspection Reports (`.docx`, `.pdf`)                                     |
|                                | Tool Logs            | Tool Maintenance Logs                            | Maintenance Logs (`.docx`, `.pdf`)                                       |
| **Machine Operators**          | Production Output    | Production Records, Maintenance Logs             | Production Output Records (`.docx`, `.xlsx`), Maintenance Logs (`.docx`) |
|                                | Setup Documentation  | Machine Setup Documentation                      | Setup Sheets (`.docx`, `.pdf`)                                           |
| **Production Supervisors**     | Production Schedules | Production Schedules, Shift Reports              | Schedule Documents (`.xlsx`, `.docx`), Shift Reports (`.docx`)           |
|                                | Performance Records  | Employee Performance Records                     | Performance Records (`.docx`, `.xlsx`)                                   |
| **Quality Control Inspectors** | Inspections          | Inspection Reports, Non-Conformance Reports      | Inspection Reports (`.docx`, `.pdf`), Non-Conformance Reports (`.docx`)  |
| **Metrology Engineers**        | Calibration Records  | Calibration Records, Measurement Reports         | Calibration Logs (`.docx`, `.xlsx`), Measurement Reports (`.pdf`)        |
|                                | SPC Charts           | SPC Charts, MSA Reports                          | Statistical Charts (`.xlsx`, `.pdf`), MSA Reports (`.docx`, `.pdf`)      |
| **Inventory Managers**         | Inventory Reports    | Inventory Reports, Stock Level Documentation     | Inventory Reports (`.xlsx`, `.pdf`), Stock Level Sheets (`.xlsx`)        |
|                                | Order Processing     | Order Processing Documentation                   | Order Forms (`.docx`, `.xlsx`)                                           |
|                                | Vendor Reports       | Vendor Performance Reports                       | Vendor Reports (`.pdf`)                                                  |
| **Production Planners**        | Production Schedules | Production Schedules, Material Requirement Plans | Schedules (`.xlsx`), MRP Documents (`.xlsx`)                             |
|                                | Capacity Planning    | Capacity Planning Documentation                  | Capacity Plans (`.docx`, `.xlsx`)                                        |
| **Maintenance Technicians**    | Maintenance Logs     | Maintenance Logs, Work Orders                    | Maintenance Records (`.docx`, `.xlsx`), Work Orders (`.docx`)            |
|                                | Equipment Schedules  | Equipment Maintenance Schedules                  | Schedules (`.xlsx`, `.pdf`)                                              |
| **HR Personnel**               | Employee Records     | Employee Records, Training Schedules             | Employee Files (`.docx`, `.xlsx`), Training Schedule Sheets (`.xlsx`)    |
| **Logistics Coordinators**     | Shipment Schedules   | Shipment Schedules, Delivery Documentation       | Shipment Schedules (`.xlsx`, `.pdf`), Delivery Documents (`.pdf`)        |
|                                | Logistics Reports    | Logistics Reports, Inventory Movement Logs       | Logistic Reports (`.docx`, `.pdf`), Movement Logs (`.xlsx`)              |

###### Other multi-team tasks:

1. **Product Design Review**: Combines Design Engineers, CAD Technicians, Manufacturing Engineers, and Metrology Engineers to ensure the design is manufacturable and meets quality standards.

2. **Prototyping**: Combines Manufacturing Engineers, Machinists, CNC Programmers, and Quality Control Inspectors to produce and evaluate a prototype.

3. **Production Planning**: Involves Production Planners, Inventory Managers, and Production Supervisors for material planning, scheduling, and resource allocation.

4. **Equipment Maintenance**: Involves Maintenance Technicians, Machine Operators, and Production Supervisors for regular upkeep and troubleshooting.

5. **Continuous Improvement**: Utilizes inputs from Manufacturing Engineers, Quality Control Inspectors, Machinists, and Production Supervisors to implement process improvements and reduce waste.

6. **Training and Development**: HR Personnel, Production Supervisors, and Maintenance Technicians collaborate to develop and deliver training programs for employees.

7. **Inventory Management**: Involves Inventory Managers, Production Planners, and Logistics Coordinators to streamline stock levels and ensure timely deliveries.

#### Phases in Manufacturing Machine Timeline

| **Phase**                    | **Timeline**         | **Teams Involved**           | **Roles Involved**                 | **Deliverables**                                     | **Possible Events** |
| ---------------------------- | -------------------- | ---------------------------- | ---------------------------------- | ---------------------------------------------------- | ------------------- |
| **1. Concept & Design**      | Design Team          | – Design Engineers           | – Concept Designs                  | Initial brainstorming, design sketches, CAD modeling |
|                              |                      |                              | – CAD Technicians                  | – Design Specifications                              |                     |
|                              |                      |                              |                                    | – CAD Models                                         |                     |
| **2. Prototyping**           | Manufacturing Team   | – CNC Programmers            | – Prototypes                       | Building first prototypes, prototype testing         |
|                              |                      | Quality Control Team         | – Quality Control Inspectors       | – Prototype Testing Reports                          |                     |
|                              |                      |                              |                                    |                                                      |                     |
| **3. Production Planning**   | Manufacturing Team   | – Manufacturing Engineers    | – Production Plan                  | Finalizing production plan, creating BOM             |
|                              |                      | Support Teams                | – Production Planners              | – Bill of Materials (BOM)                            |                     |
|                              |                      |                              |                                    | – Process Layout                                     |                     |
| **4. Tooling Setup**         | Manufacturing Team   | – CNC Programmers            | – Tooling and Fixture Requirements | Tooling and fixture setup, trial runs                |
|                              |                      |                              | – Machinists                       | – Tooling Setup Sheets                               |                     |
|                              |                      |                              | – Machine Operators                |                                                      |                     |
| **5. Pilot Production**      | Manufacturing Team   | – Manufacturing Engineers    | – Pilot Run Reports                | Producing initial batch, validating processes        |
|                              |                      | Quality Control Team         | – Quality Control Inspectors       | – Process Validation                                 |                     |
|                              |                      |                              | – Production Supervisors           | – Production Workflow                                |                     |
| **6. Full-Scale Production** | Manufacturing Team   | – Machine Operators          | – Production Output Reports        | Full-scale manufacturing, quality checks             |
|                              |                      | Quality Control Team         | – Quality Control Inspectors       | – Quality Inspection Reports                         |                     |
|                              |                      |                              | – Machinists                       |                                                      |                     |
| **7. Quality Assurance**     | Quality Control Team | – Quality Control Inspectors | – Quality Assurance Reports        | Continuous quality monitoring, audits                |
|                              |                      |                              | – Metrology Engineers              | – Non-Conformance Reports                            |                     |
| **8. Maintenance**           | Support Teams        | – Maintenance Technicians    | – Maintenance Logs                 | Regular maintenance, equipment calibration           |
|                              |                      |                              | – Metrology Engineers              | – Equipment Calibration Records                      |                     |

### 3.2 Kanban Board Organization

#### 3.2.1 Board paramaters:

A Kanban board is a visual tool used to manage workflows and tasks in a project. Here are the main parameters and components commonly used on a Kanban board:

##### 1. **Cards**

- Represent individual tasks or work items .
- Contain details such as task name, description, assignees, due dates,team and attachments .

##### 2. **WIP Limits (Work In Progress Limits)**

- Restrictions on the number of tasks that can be in the "In Progress" column at any one time.
- Helps to prevent overloading and ensure focus on task completion.

##### 3. **Swimlanes**

- Horizontal lanes that separate tasks by different categories, teams, or priorities.
- Useful for distinguishing tasks by type, project, or team.

##### 4. **Labels/Tags**

- Color-coded labels or tags to categorize tasks.
- Helps in quickly identifying the type, priority, or status of tasks.

##### 4. **Due Dates**

- Dates by which tasks need to be completed.
- Helps in tracking deadlines and ensuring timely delivery.

##### 5. **Assignees**

- Team members responsible for each task.
- Clearly identifies who is working on what.

##### 6. **Task Details**

- Descriptions, checklists, and subtasks within each card.
- Helps in breaking down work and ensuring all aspects of a task are addressed.

##### 7. **Comments and Attachments**

- Space for team members to leave comments or attach files related to the task.
- Enhances collaboration and communication.

##### 8. **Metrics and Analytics**

- Data such as cycle time, lead time, and cumulative flow diagrams.
- Helps in monitoring performance and identifying areas for improvement.

##### 9. **Priority Indicators**

- Flags or icons to denote high-priority tasks.
- Ensures critical tasks receive attention first.

#### 3.2.2 Standard Columns

- To Do
- In Progress
- Review
- Done

#### 3.2.2 Column Customization

- Add/remove columns
- Set WIP limits
- Define column policies

## 4. Data Management

### 4.1 Supported Data Types

#### 4.1.1 Design Data

- File formats: STEP, IGES, STL, DXF, DWG
- Handling: Version control and revision history
- Access: Role-based permissions

#### 4.1.2 Manufacturing Data

- CNC programs (G-code, M-code)
- Machine instructions
- Production schedules
- Work orders

#### 4.1.3 Quality Control Data

- Inspection reports
- Measurement data
- Quality metrics
- Compliance documentation

### 4.2 Data Flow

#### 4.2.1 Input Sources

- Manual entry
- File uploads
- API integrations
- Automated data collection

#### 4.2.2 Output Formats

- CSV exports
- PDF reports
- API endpoints
- Real-time dashboards

## 5. Integration Capabilities

### 5.1 System Integrations

- ERP systems
- CAD/CAM software
- Quality management systems
- Inventory management systems
- Machine monitoring systems

### 5.2 API Documentation

#### 5.2.1 Available Endpoints

- Task management
- Board configuration
- User management
- Data exchange
- Reporting

## 6. Security and Access Control

### 6.1 Authentication

- User authentication
- Single Sign-On (SSO)
- Multi-factor authentication

### 6.2 Authorization

- Role-based access control
- Permission levels
- Data access restrictions

## 7. Reporting and Analytics

### 7.1 Standard Reports

- Cycle time analysis
- Lead time tracking
- WIP monitoring
- Bottleneck identification
- Resource utilization

### 7.2 Custom Analytics

- Performance metrics
- Productivity analysis
- Quality metrics
- Trend analysis
- Predictive analytics

## 8. Implementation Guidelines

### 8.1 Setup Process

1. Initial configuration
2. User onboarding
3. Data migration
4. Integration setup
5. Training and documentation

### 8.2 Best Practices

- WIP limit enforcement
- Regular board reviews
- Data backup procedures
- Security protocols
- User training requirements

## 9. Support and Maintenance

### 9.1 System Updates

- Version control
- Update procedures
- Rollback protocols

### 9.2 Technical Support

- Support levels
- Contact information
- Issue reporting procedure
- Resolution timeframes

# Features could be added for further development:

manufacturing-specific features could be added to make project management tool fit manufaturing process:

Production-Specific Task Categories:

Design review workflows
Quality control checkpoints
Machine maintenance scheduling
Inventory tracking cards
Production bottleneck alerts

Data Integration Features:

Import/export CAD files (STEP, IGES, STL)
CNC program attachment support
Quality inspection report generation
Integration with common manufacturing software APIs

Enhanced Analytics:

Machine utilization tracking
Production cycle time visualization
Quality metrics dashboard
Resource allocation charts
Bottleneck identification tools

Specialized User Roles:

Design engineer views
Machine operator dashboards
Quality inspector workflows
Maintenance technician schedules

Manufacturing KPIs:

Real-time production status
Defect rate tracking
Machine downtime monitoring
Inventory level alerts
Lead time calculations
