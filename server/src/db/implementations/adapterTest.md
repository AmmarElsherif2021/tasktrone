# Jest for Beginners — walking through `PostgresAdapter.spec.ts` from scratch

---

## Part 1 — What is Jest, and what is a "test"?

**Jest** is a test runner. You write files ending in `.spec.ts` or `.test.ts`, and Jest finds them, runs them, and tells you which passed or failed.

A **test** is just: _"do this thing, then check the result matches what I expect."_

```ts
it("adds two numbers", () => {
  expect(1 + 1).toBe(2);
});
```

That's it. Three pieces:

| Piece                   | Meaning                                                           |
| ----------------------- | ----------------------------------------------------------------- |
| `it("description", fn)` | One test case. The string is what shows in the report.            |
| `expect(actual)`        | "Here's what I actually got."                                     |
| `.toBe(expected)`       | "And here's what I expected." Jest fails the test if they differ. |

`it` is also written as `test` — same function, two names.

---

i

## Part 2 — Grouping tests with `describe`

Tests are usually grouped:

```ts
describe("PostgresAdapter", () => {
  it("does X", () => { ... });
  it("does Y", () => { ... });
});
```

`describe` is just a container. Its string becomes the group heading in the output:

```
PostgresAdapter
  ✓ does X
  ✓ does Y
```

It's cosmetic — but it makes failures readable when you have 200 tests.

---

## Part 3 — `beforeEach` — running code before every test

```ts
beforeEach(() => {
  mockPoolQuery.mockReset();
});
```

Whatever's inside `beforeEach` runs **before every `it` in the file**. Its purpose: put things back to a clean state so tests don't leak into each other.

If test A leaves a mess and test B relies on a clean slate, `beforeEach` is how you guarantee the clean slate. Skipping it is one of the most common sources of "why does this test pass alone but fail in a suite?"

(`afterEach`, `beforeAll`, `afterAll` exist too — same idea, different timing.)

---

## Part 4 — The hard part: **mocking**

This is the concept that makes the file look scary. Let's build it up slowly.

### The problem

`PostgresAdapter` talks to a real Postgres database. If your tests hit a real database you get:

- **Slow** tests (network round-trips).
- **Flaky** tests (DB down, port taken, CI has no DB).
- **Messy** tests (you have to clean up data between runs).

For **unit tests**, we don't care whether Postgres works. We care whether _our adapter code_ works. So we **replace the database with a fake**.

That replacement is called a **mock**.

### `jest.fn()` — a fake function

```ts
const mockPoolQuery = jest.fn();
```

`jest.fn()` creates an empty function that:

1. **Records every call** — what arguments it was called with, how many times.
2. **Lets you control what it returns** — you decide the fake return value.
3. **Lets you assert on it** — "was this called? with what?"

You can use it just like a normal function:

```ts
mockPoolQuery("SELECT 1", []);
```

Now you can ask Jest:

```ts
expect(mockPoolQuery).toHaveBeenCalledWith("SELECT 1", []);
```

### Controlling what a mock returns

By default `jest.fn()` returns `undefined`. The adapter does `result.rows.map(...)`, so `undefined.rows` would crash. So we tell the mock what to return:

```ts
mockPoolQuery.mockResolvedValueOnce({ rows: [row] });
```

- `mockResolvedValueOnce(x)` — "the **next** time this is called, return a promise that resolves to `x`."
- `mockResolvedValue(x)` — "**every** time, resolve to `x`."
- `mockReturnValueOnce(x)` / `mockReturnValue(x)` — same but for non-async functions.

The `Once` variants are a **queue**. If you call `mockResolvedValueOnce(a)` then `mockResolvedValueOnce(b)`, the first call returns `a`, the second returns `b`, and the third returns `undefined` (or whatever `mockResolvedValue` set).

That's why the tests use `Once` — they want one specific return value for the one call they're about to make.

### `mockReset()` — clearing the slate

```ts
mockPoolQuery.mockReset();
```

This does two things:

1. Forgets every recorded call.
2. **Empties the `Once` queue.**

Without it: if a test queued two `Once` values but only triggered one, the leftover would fire in the _next_ test. Chaos. `beforeEach` + `mockReset()` prevents that.

---

## Part 5 — Replacing a whole module with `jest.mock`

`jest.fn()` fakes a single function. `jest.mock` fakes an **entire module**.

```ts
jest.mock("pg", () => ({
  Pool: jest.fn().mockImplementation(() => ({
    query: mockPoolQuery,
  })),
}));
```

Read it as: **"Whenever any file in this test does `import ... from 'pg'`, don't give them the real `pg` library. Give them this object instead."**

The object we're providing says:

- `Pool` is a fake class (a `jest.fn()`).
- Whenever someone does `new Pool(...)`, return `{ query: mockPoolQuery }`.

So when `PostgresAdapter` runs:

```ts
this.pool = new Pool({ connectionString: config });
```

It _thinks_ it made a real Postgres pool. In reality it made `{ query: mockPoolQuery }`. No sockets, no network, no Postgres.

### Why `mockImplementation`?

```ts
jest.fn().mockImplementation(() => ({ query: mockPoolQuery }));
```

`mockImplementation` says: _"when this mock function is called, run this code and return whatever it returns."_ Here, when `Pool` is called with `new`, return an object with a single `query` property pointing at our shared mock.

### Why is the variable named `mockPoolQuery`?

Jest's rule: **inside a `jest.mock` factory, you can only reference variables whose names start with `mock`.** It's a quirky safety rule so Jest can guarantee the mock is set up before the factory runs.

```ts
const poolQuery = jest.fn(); // ❌ Jest throws
const mockPoolQuery = jest.fn(); // ✅ allowed
```

### Why is the import _after_ the mock?

```ts
jest.mock("pg", () => ({ ... }));           // line 5

import { PostgresAdapter } from "./PostgresAdapter";  // line 10
```

Even though `import` statements normally come first, Jest **hoists `jest.mock` above all imports** automatically. So by the time `PostgresAdapter` is loaded (and it imports `pg`), the mock is already in place. The comment in the file is there to reassure the reader of this.

**Translation:** the order you _see_ is a lie; Jest reorders it so the mock wins. The comment just tells you not to "fix" the import order.

---

## Part 6 — The four tests, one at a time

Now that we have vocabulary, the tests read plainly.

### Test 1 — "does `query` rename snake_case to camelCase?"

```ts
it("query() maps a snake_case row to its camelCase shape", async () => {
  const row = makeTaskRow({
    boardId: "b1",
    modelRef: "ref-1",
    createdAt: new Date("2024-01-01T00:00:00Z"),
  });
  mockPoolQuery.mockResolvedValueOnce({ rows: [row] });
  const adapter = new PostgresAdapter("postgres://unused");

  const [result] = await adapter.query<Record<string, unknown>>(
    "SELECT * FROM tasks",
  );

  expect(result.boardId).toBe(row.board_id);
  expect(result.modelRef).toBe(row.model_ref);
  expect(result.createdAt).toBe(row.created_at);
});
```

Line by line:

1. **`makeTaskRow({...})`** — a helper from a test-factories file. It builds a fake DB row (with snake_case keys like `board_id`). We use a factory instead of typing the row literally so every test gets the same shape.
2. **`mockPoolQuery.mockResolvedValueOnce({ rows: [row] })`** — tells the fake `pool.query` to return `{ rows: [row] }` the next time it's called. That's what real `pg` returns, so the adapter's `.rows` access works.
3. **`new PostgresAdapter("postgres://unused")`** — create the thing under test. The string is never really used because `Pool` is mocked, so its value doesn't matter.
4. **`await adapter.query("SELECT * FROM tasks")`** — call the method. It internally calls `pool.query` (the mock) and maps the rows.
5. **`const [result] = ...`** — array destructuring: grab the first element of the returned array.
6. **The three `expect`s** — assert that the _returned_ keys are camelCase and the values match the snake_case originals.

What the test is checking: **the adapter renames keys.** That's it. Not that Postgres works — just that if Postgres returned `board_id`, the adapter gives back `boardId`.

### Test 2 — "does `query` forward SQL and params untouched?"

```ts
mockPoolQuery.mockResolvedValueOnce({ rows: [] });
await adapter.query("SELECT * FROM tasks WHERE id = $1", ["1"]);

expect(mockPoolQuery).toHaveBeenCalledWith(
  "SELECT * FROM tasks WHERE id = $1",
  ["1"],
);
```

- We don't care about the result this time, so we resolve with an empty rows array.
- The assertion asks: **"when `pool.query` was called, did it get exactly this SQL and these params?"** — the adapter is a pass-through and must not rewrite the SQL or interpolate values into it.
- `$1` is Postgres's placeholder syntax; the value `"1"` is passed separately so it's safe from SQL injection.

The test is checking: **the adapter doesn't tamper with the query.** No hidden `LIMIT`, no string-building.

### Test 3 — "does `queryOne` return the first row?"

```ts
const first = makeBoardRow({ organizationId: "org1" });
const second = makeBoardRow({ organizationId: "org2" });
mockPoolQuery.mockResolvedValueOnce({ rows: [first, second] });

const result = await adapter.queryOne("SELECT * FROM boards");

expect(result?.organizationId).toBe(first.organization_id);
```

- We give the mock **two** rows.
- `queryOne` is supposed to return _one_ row (or null).
- The assertion confirms it returned the **first** one, and the second was discarded.

The `?.` is optional chaining — it means "if `result` is not null, read `organizationId`; otherwise, don't crash." Since `queryOne` can return `null`, we protect the assertion.

The test is checking: **first row wins.** (The test does not check whether the DB was asked for just one row — the adapter doesn't add `LIMIT`, so the DB sends both and the adapter throws away the second.)

### Test 4 — "does `queryOne` return null when there are no rows?"

```ts
mockPoolQuery.mockResolvedValueOnce({ rows: [] });

const result = await adapter.queryOne("SELECT * FROM boards WHERE id = $1", [
  "missing",
]);

expect(result).toBeNull();
```

- Empty result from the mock.
- `queryOne` must return `null`, **not** throw.

The test is checking: **"not found" is `null`, not an error.** Your `BoardRepository.findById` relies on this so it can return `Board | null`.

---

## Part 7 — The "shape" of a Jest test file

Almost every Jest file looks like this:

```ts
// 1. Mocks (jest.mock calls for external modules)
jest.mock("pg", () => ({ ... }));

// 2. Imports of the code under test
import { PostgresAdapter } from "./PostgresAdapter";

// 3. A group
describe("PostgresAdapter", () => {
  // 4. Before-each cleanup
  beforeEach(() => {
    mockPoolQuery.mockReset();
  });

  // 5. One test per behavior
  it("does X", async () => {
    // arrange — set up inputs, mock return values
    // act     — call the thing under test
    // assert  — expect(...)
  });
});
```

The "arrange / act / assert" trio is the standard pattern. You can see it clearly in Test 1:

- **Arrange:** build a row, queue the mock return, create the adapter.
- **Act:** `await adapter.query(...)`.
- **Assert:** the three `expect`s.

---

## Part 8 — Cheat sheet you can keep

| Jest thing                              | Plain English                                                                    |
| --------------------------------------- | -------------------------------------------------------------------------------- |
| `describe("name", fn)`                  | Group related tests.                                                             |
| `it("name", fn)` / `test("name", fn)`   | One test case.                                                                   |
| `beforeEach(fn)`                        | Run `fn` before every test in the file/group.                                    |
| `expect(actual).toBe(expected)`         | Compare with `===`.                                                              |
| `expect(actual).toEqual(expected)`      | Deep-equal comparison (for objects/arrays).                                      |
| `expect(fn).toHaveBeenCalledWith(a, b)` | Assert a mock was called with these arguments.                                   |
| `expect(x).toBeNull()`                  | Assert `x === null`.                                                             |
| `async` / `await` in a test             | Required when the code under test is async. Jest waits for the returned promise. |
| `jest.fn()`                             | A fake function that records its calls.                                          |
| `mock.mockResolvedValueOnce(x)`         | Next call returns a promise resolving to `x`.                                    |
| `mock.mockReturnValue(x)`               | Every call returns `x` (sync).                                                   |
| `mock.mockReset()`                      | Clear recorded calls and the `Once` queue.                                       |
| `jest.mock("module", factory)`          | Replace an entire module with a fake.                                            |
| Variables inside a `jest.mock` factory  | Must start with `mock`.                                                          |

---

## Part 9 — What the file _doesn't_ test (still beginner-friendly)

The four tests are all about `query` and `queryOne` — the "read" methods. The `transaction()` method (the one that says `BEGIN`, `COMMIT`, `ROLLBACK`) is **not tested at all**. And it can't be, with the current mock, because the mock only provides `query`. `transaction` also needs `connect`, which the mock doesn't have.

So if you were to extend this file, the next thing you'd add is:

```ts
const mockConnect = jest.fn();
const mockClientQuery = jest.fn();
const mockRelease = jest.fn();

jest.mock("pg", () => ({
  Pool: jest.fn().mockImplementation(() => ({
    query: mockPoolQuery,
    connect: mockConnect,
  })),
}));
```

…then have `mockConnect` resolve to `{ query: mockClientQuery, release: mockRelease }` and assert that `transaction` sends `BEGIN`, runs your callback, sends `COMMIT`, and calls `release`.

---

## One-sentence summary for a beginner

> A Jest test file **replaces the outside world with fakes** (via `jest.mock` and `jest.fn`), **calls your code**, and **checks that it produced the right thing** — and this file does exactly that for the read path of `PostgresAdapter`, leaving the transaction path untested.
