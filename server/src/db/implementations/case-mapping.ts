/**
 * Converts a Postgres row's snake_case column names (board_id, model_ref,
 * created_at, ...) to the camelCase keys the domain entities (Task/Board/User)
 * declare. Applied once here so repositories can write plain `SELECT *` /
 * `RETURNING *` without hand-aliasing every column.
 *
 * Only transforms top-level keys — JSONB column values (e.g. position3d,
 * whose own {x,y,z} keys aren't snake_case anyway) are left untouched.
 */
export function toCamelCaseRow<T>(row: Record<string, unknown>): T {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(row)) {
    const camelKey = key.replace(/_([a-z0-9])/g, (_match, char: string) => char.toUpperCase())
    result[camelKey] = value
  }
  return result as T
}
