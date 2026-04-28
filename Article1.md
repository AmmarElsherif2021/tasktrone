# Tasktrone — Architecture & Design: A Developer's Journey
## The Core Features Behind the System
**In this article, I'll walk through the architectural thinking and design process I went through while building Tasktrone — the decisions made, the tradeoffs considered, and the principles that shaped the system.**

---

### 1. Abstraction
*Expose only what's relevant; hide everything else.*

In Tasktrone, a QC Inspector and a Project Manager need completely different views of the same task. Abstraction is enforced at the interface level — each role only sees the fields they need.

```typescript
// The full data model (internal)
interface FullTask {
  id: string;
  title: string;
  status: string;
  assignee: string;
  budgetAllocation: number;
  equipmentRuntimeLogs: number[];
  cycleTimeEvents: EventRecord[];
  // ... and more
}

// Role-specific abstractions
interface InspectorTaskView {
  readonly id: string;
  readonly title: string;
  readonly assignee: string;
  readonly status: string;
  readonly specifications: string[];   // only QC-relevant
}

interface ManagerTaskView {
  readonly id: string;
  readonly title: string;
  readonly budgetAllocation: number;
  readonly aggregatedCycleTime: number; // derived, not raw events
}
```

The service layer responsible for returning data to the frontend implements only the appropriate view. The AI layer or analytics pipeline gets yet another slice — no consumer ever touches `FullTask` directly.

---

### 2. Encapsulation
*Protect internal state and expose behaviour only through a controlled interface.*

The `Project` class guards phase transitions, status updates, and budget changes. No external code can set `currentPhase` directly.

```typescript
type Phase = 'Concept' | 'Design' | 'Production' | 'Quality Control' | 'Completed';

class Project {
  private _currentPhase: Phase = 'Concept';
  private _status: 'active' | 'completed' = 'active';
  private _budget: number;

  // Controlled access
  get currentPhase(): Phase {
    return this._currentPhase;
  }

  get status(): 'active' | 'completed' {
    return this._status;
  }

  get budget(): number {
    return this._budget;
  }

  advancePhase(): void {
    const validNext: Record<Phase, Phase | null> = {
      'Concept': 'Design',
      'Design': 'Production',
      'Production': 'Quality Control',
      'Quality Control': 'Completed',
      'Completed': null
    };

    const next = validNext[this._currentPhase];
    if (!next) throw new Error('Cannot advance from current phase.');

    this._currentPhase = next;
    this.logPhaseChange(next);          // internal audit
    this.notifyMembersOfPhaseChange();  // internal notification
  }

  markCompleted(): void {
    if (this._currentPhase !== 'Quality Control')
      throw new Error('Must pass QC before completion.');
    this._status = 'completed';
    this.finalizeAnalytics();
    this.lockWrites();
  }

  // Encapsulated internal logic
  private logPhaseChange(newPhase: Phase): void { /*...*/ }
  private notifyMembersOfPhaseChange(): void { /*...*/ }
  private finalizeAnalytics(): void { /*...*/ }
  private lockWrites(): void { /*...*/ }
}
```

External code only calls `project.advancePhase()` or `project.markCompleted()`. The class itself enforces business rules, so no layer — AI, job queue, or API — can corrupt the object’s state.

---

### 3. Inheritance
*Derive new classes from an existing base, avoiding duplication.*

A base `Task` provides the common contract, while specific task types extend it with their own fields.

```typescript
class Task {
  constructor(
    public readonly id: string,
    public title: string,
    public status: string,
    public assignee: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  process(): void {
    console.log('Default task processing...');
  }
}

class QualityCheckTask extends Task {
  public inspectionCriteria: string[];
  public sampleSize: number;

  constructor(id: string, title: string, assignee: string, criteria: string[], sample: number) {
    super(id, title, 'pending', assignee, new Date(), new Date());
    this.inspectionCriteria = criteria;
    this.sampleSize = sample;
  }

  // Override with QC-specific behaviour
  override process(): void {
    console.log(`Running quality check on sample of ${this.sampleSize}`);
    // ...
  }
}

class MaintenanceTask extends Task {
  public equipmentId: string;
  public scheduledDate: Date;

  constructor(id: string, title: string, assignee: string, equipmentId: string, scheduled: Date) {
    super(id, title, 'pending', assignee, new Date(), new Date());
    this.equipmentId = equipmentId;
    this.scheduledDate = scheduled;
  }

  override process(): void {
    console.log(`Dispatching maintenance for equipment ${this.equipmentId}`);
    // ...
  }
}
```

The same pattern applies to `Project` and `Board` sharing organisational logic in a common base class — membership checks, phase scoping, etc.

---

### 4. Polymorphism
*Different concrete types can be treated uniformly through a shared interface or base class.*

A job processor can handle any task without conditionals on the concrete type. It simply calls `task.process()`.

```typescript
function handleTask(task: Task): void {
  // No need to know whether it's QualityCheckTask or MaintenanceTask
  task.process();
}

const qcTask = new QualityCheckTask('1', 'Inspect batch', 'alice', ['color','weight'], 10);
const maintTask = new MaintenanceTask('2', 'Lubricate press', 'bob', 'PRESS-01', new Date());

handleTask(qcTask);   // Runs QualityCheckTask.process()
handleTask(maintTask); // Runs MaintenanceTask.process()

// Scaling: a new task category, LogisticsTask, also extends Task.
// handleTask works with it immediately.
```

The AI layer, the ETL pipeline, and the job queue all consume `Task` — never branching on `instanceof`. Polymorphism keeps them decoupled from future task types.

---

### Relations Between Objects (with TypeScript examples)

**Dependency** – A change in B may break A.  
*The analytics module depends on the `Task` structure.*
```typescript
// analytics.ts
import { Task } from './Task'; // direct dependency

export function computeCycleTime(task: Task): number {
  // relies on Task's updatedAt and createdAt
  return task.updatedAt.getTime() - task.createdAt.getTime();
}
```

**Association** – One object knows about another, no ownership.  
*The `Board` holds a reference to its parent `Project`.*
```typescript
class Board {
  constructor(public name: string, public project: Project) {}
}
```

**Aggregation** – A whole consists of parts, but parts live independently.  
*`Project` aggregates `User` as members.*
```typescript
class User {
  constructor(public id: string, public name: string) {}
}

class Project {
  public members: User[] = [];  // users exist outside Project

  addMember(user: User): void {
    this.members.push(user);
  }
}
```

**Composition** – Strong ownership; parts cannot exist without the whole.  
*`Task` composes `SubTask` and `TaskHistory`.*
```typescript
class Task {
  public subtasks: SubTask[] = [];
  private historyEntries: TaskHistoryEntry[] = [];

  addSubtask(title: string): void {
    this.subtasks.push(new SubTask(title, this)); // SubTask is owned
  }

  removeSubtask(subtask: SubTask): void {
    this.subtasks = this.subtasks.filter(s => s !== subtask);
    // When a subtask is removed, it's gone — no independent lifecycle
  }
}

class SubTask {
  constructor(public title: string, private parent: Task) {}
}
```

**Implementation** – A class fulfils a contract defined by an interface.  
*Any service implementing `INotifiable` can be plugged into the notification system.*
```typescript
interface INotifiable {
  notify(message: string): void;
}

class EmailNotifier implements INotifiable {
  notify(message: string): void {
    // send email
  }
}

class SlackNotifier implements INotifiable {
  notify(message: string): void {
    // post to Slack
  }
}

function broadcast(message: string, notifier: INotifiable) {
  notifier.notify(message);
}
```

**Inheritance** – Both interface and implementation reuse.  
*As shown earlier, `QualityCheckTask` **is a** `Task` and can be substituted wherever `Task` is expected.*

```typescript
function assignTaskToUser(task: Task, user: User) {
  // works for any subclass of Task
}
```