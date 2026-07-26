Let me analyze the **best design pattern** for your specific situation:

---

## 🎯 **Your Constraints**

1. **Local-first development** (PostgreSQL locally)
2. **Ready to migrate** (to Supabase, AWS RDS, etc. later)
3. **Rapid prototyping** (weeks 1-4)
4. **Team coordination** (Project Manager needs clear ownership)
5. **Eventually: Multi-tenancy, RBAC, Jobs** (Phase 1.1-1.4)

---

## 🏆 **Best Pattern: Repository + Adapter (Hybrid)**

This is **NOT just adapter**, and **NOT just repository**. It's both, layered strategically.

```
Route
  ↓
Service (business logic)
  ↓
Repository (query building + caching)
  ↓
Adapter (driver agnostic)
  ↓
PostgreSQL | Supabase | AWS
```

**Why this wins:**

| Pattern | Pro | Con | Your Case |
|---------|-----|-----|-----------|
| **Adapter only** | Simple, swappable | Business logic creeps into routes | ❌ Won't scale to Phase 1.1 |
| **Repository only** | Separates queries | Tightly coupled to driver | ❌ Hard to migrate later |
| **Repository + Adapter** | Best of both | Slightly more boilerplate | ✅ Perfect fit |

---

## 📐 **The Pattern: 3-Tier**

### **Layer 1: Adapter (Database Agnostic)**

```typescript
// src/db/adapter.ts
export interface DBAdapter {
  query<T>(sql: string, params?: any[]): Promise<T[]>;
  queryOne<T>(sql: string, params?: any[]): Promise<T | null>;
  transaction<T>(cb: (db: DBAdapter) => Promise<T>): Promise<T>;
}
```

**Why:** Contracts only. Zero implementation details.

---

### **Layer 2: Repository (Query Building)**

```typescript
// src/db/repositories/TaskRepository.ts
import { DBAdapter } from '../adapter';

export class TaskRepository {
  constructor(private db: DBAdapter) {}

  // Query logic isolated here
  async findByOrg(orgId: string) {
    return this.db.query(
      `SELECT * FROM tasks WHERE organization_id = $1 ORDER BY created_at DESC`,
      [orgId]
    );
  }

  async findById(id: string) {
    return this.db.queryOne(
      `SELECT * FROM tasks WHERE id = $1`,
      [id]
    );
  }

  async create(orgId: string, title: string, boardId: string) {
    return this.db.queryOne(
      `INSERT INTO tasks (organization_id, title, board_id) 
       VALUES ($1, $2, $3) RETURNING *`,
      [orgId, title, boardId]
    );
  }

  async updateStatus(id: string, status: string) {
    return this.db.queryOne(
      `UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
  }
}
```

**Why:**
- Queries in one place (testable, reusable)
- Receives adapter via constructor (swappable)
- No business logic here (pure data access)

---

### **Layer 3: Service (Business Logic)**

```typescript
// src/services/TaskService.ts
import { TaskRepository } from '../db/repositories/TaskRepository';
import { ValidationError, NotFoundError } from '../utils/errors';

export class TaskService {
  constructor(private taskRepo: TaskRepository) {}

  async createTask(orgId: string, userId: string, data: any) {
    // Validation (business rule)
    if (!data.title?.trim()) {
      throw new ValidationError('Title required');
    }

    if (data.title.length > 255) {
      throw new ValidationError('Title too long');
    }

    // Create
    const task = await this.taskRepo.create(orgId, data.title, data.boardId);
    return task;
  }

  async moveTask(orgId: string, taskId: string, newStatus: string) {
    // Check task exists
    const task = await this.taskRepo.findById(taskId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // Check status transition is valid (business rule)
    const validTransitions = {
      todo: ['in_progress'],
      in_progress: ['review', 'todo'],
      review: ['done', 'in_progress'],
      done: [],
    };

    if (!validTransitions[task.status]?.includes(newStatus)) {
      throw new ValidationError(`Cannot move from ${task.status} to ${newStatus}`);
    }

    // Update
    return this.taskRepo.updateStatus(taskId, newStatus);
  }
}
```

**Why:**
- Business logic isolated
- Knows nothing about HTTP or database drivers
- Testable without database (mock repo)

---

### **Layer 4: Route (HTTP Glue)**

```typescript
// src/api/routes/tasks.ts
import { Router } from 'express';
import { TaskService } from '../../services/TaskService';
import { taskRepo } from '../../db/repositories';
import { AppError } from '../../utils/errors';

const taskService = new TaskService(taskRepo);
const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const tasks = await taskService.findByOrg(req.user.organizationId);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const task = await taskService.createTask(
      req.user.organizationId,
      req.user.id,
      req.body
    );
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

export default router;
```

**Why:**
- Route only handles HTTP (params, response format)
- Delegates to service
- No database queries here

---

## 🎲 **Why This Beats Alternatives**

### **Option A: Adapter Only (No Repository)**
```typescript
// ❌ What you DON'T want
async createTask(db: DBAdapter, orgId: string, title: string) {
  // Queries scattered in routes or services
  return db.queryOne('INSERT INTO tasks...');
}

// Problem: If you add pagination logic, you repeat it everywhere
// Problem: Migration to Supabase means updating all query strings
```

### **Option B: Repository Only (No Adapter)**
```typescript
// ❌ What you DON'T want
export class TaskRepository {
  async createTask() {
    // Tightly coupled to pg driver
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: '...' });
    return pool.query('INSERT INTO tasks...');
  }
}

// Problem: Swapping to Supabase means rewriting repository
// Problem: Hard to test (requires real PostgreSQL)
```

### **Option C: Repository + Adapter (✅ Your Pattern)**
```typescript
export class TaskRepository {
  constructor(private db: DBAdapter) {} // Receives abstraction
  
  async createTask(orgId: string, title: string) {
    return this.db.queryOne('INSERT INTO tasks...');
  }
}

// Benefit: Query logic stays in repo
// Benefit: Adapter swappable → migration easy
// Benefit: Tests can pass mock adapter
```

---

## 🏗️ **Concrete Structure for Your Project**

```
src/
├── db/
│   ├── adapter.ts                    # Interface
│   ├── implementations/
│   │   ├── postgres.ts               # Concrete impl
│   │   └── supabase.ts               # Future impl
│   ├── repositories/
│   │   ├── TaskRepository.ts         # Query building
│   │   ├── BoardRepository.ts
│   │   ├── UserRepository.ts
│   │   └── index.ts                  # Export all repos
│   └── index.ts                      # Singleton setup
│
├── services/
│   ├── TaskService.ts                # Business logic
│   ├── BoardService.ts
│   └── index.ts                      # Export all services
│
├── api/
│   └── routes/
│       ├── tasks.ts                  # HTTP glue
│       ├── boards.ts
│       └── index.ts
│
└── middleware/
    └── errorHandler.ts
```

---

## 💾 **Minimal Implementation (All Three Layers)**

### **1. Adapter**
```typescript
// src/db/adapter.ts
export interface DBAdapter {
  query<T>(sql: string, params?: any[]): Promise<T[]>;
  queryOne<T>(sql: string, params?: any[]): Promise<T | null>;
}
```

### **2. Implementation**
```typescript
// src/db/implementations/postgres.ts
import { Pool } from 'pg';
import { DBAdapter } from '../adapter';

export class PostgresAdapter implements DBAdapter {
  private pool: Pool;

  constructor(url: string) {
    this.pool = new Pool({ connectionString: url });
  }

  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    const res = await this.pool.query(sql, params);
    return res.rows;
  }

  async queryOne<T>(sql: string, params: any[] = []): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows[0] || null;
  }
}
```

### **3. Repository**
```typescript
// src/db/repositories/TaskRepository.ts
import { DBAdapter } from '../adapter';

export class TaskRepository {
  constructor(private db: DBAdapter) {}

  async findByOrg(orgId: string) {
    return this.db.query(
      'SELECT * FROM tasks WHERE organization_id = $1',
      [orgId]
    );
  }

  async create(orgId: string, title: string, boardId: string) {
    return this.db.queryOne(
      'INSERT INTO tasks (organization_id, title, board_id) VALUES ($1, $2, $3) RETURNING *',
      [orgId, title, boardId]
    );
  }
}
```

### **4. Service**
```typescript
// src/services/TaskService.ts
import { TaskRepository } from '../db/repositories/TaskRepository';

export class TaskService {
  constructor(private taskRepo: TaskRepository) {}

  async createTask(orgId: string, title: string, boardId: string) {
    if (!title?.trim()) throw new Error('Title required');
    return this.taskRepo.create(orgId, title, boardId);
  }
}
```

### **5. Route**
```typescript
// src/api/routes/tasks.ts
import { Router } from 'express';
import { TaskService } from '../../services/TaskService';

const taskService = new TaskService(new TaskRepository(db));
const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const task = await taskService.createTask(
      req.user.organizationId,
      req.body.title,
      req.body.boardId
    );
    res.json(task);
  } catch (err) {
    next(err);
  }
});
```

---

## 🧪 **Testing Benefits**

```typescript
// Test the service WITHOUT database
describe('TaskService', () => {
  it('should validate title', async () => {
    const mockRepo = {
      create: jest.fn(),
    };
    const service = new TaskService(mockRepo as any);

    expect(() => service.createTask('org-1', '', 'board-1')).toThrow();
    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});

// Test the repository WITH mock adapter
describe('TaskRepository', () => {
  it('should query tasks', async () => {
    const mockAdapter = {
      query: jest.fn().mockResolvedValue([{ id: '1', title: 'Test' }]),
    };
    const repo = new TaskRepository(mockAdapter as any);

    const tasks = await repo.findByOrg('org-1');
    expect(tasks).toHaveLength(1);
  });
});
```

---

## 🔄 **Migration Path (No Code Changes)**

**Week 1-4:** Use PostgreSQL adapter
```typescript
const db = new PostgresAdapter(process.env.DATABASE_URL);
```

**Week 9:** Switch to Supabase adapter (create new file only)
```typescript
const db = new SupabaseAdapter(supabaseUrl, supabaseKey);
```

**Routes/Services/Repos unchanged.** ✅

---

## 📊 **Decision Matrix: Why This Pattern**

| Requirement | Adapter Only | Repository Only | Repository + Adapter |
|-------------|--------------|-----------------|----------------------|
| Local-first dev | ✅ | ✅ | ✅ |
| Easy migration | ✅ | ❌ | ✅ |
| Testable services | ❌ | ✅ | ✅ |
| Testable queries | ❌ | ✅ | ✅ |
| Reusable queries | ❌ | ✅ | ✅ |
| Scales to Phase 1.1 | ❌ | ✅ | ✅ |
| Scales to Phase 1.4 (jobs) | ❌ | ❌ | ✅ |

---

## ✅ **Recommendation**

**Use: Repository + Adapter Pattern**

**Start with:**
1. `DBAdapter` interface (week 1, day 1)
2. `PostgresAdapter` implementation
3. `TaskRepository` (first repo)
4. `TaskService` (first service)
5. One route to prove it works

**By week 4:** You have 5-6 repos, 5-6 services, clean layering.

**Week 9+:** Plug in Supabase adapter. Everything else works unchanged.

---