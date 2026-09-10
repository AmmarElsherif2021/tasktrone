/**
 * THESE ARE UTILITY FUNCTIONS FOR CONVERTING BETWEEN SNAKE_CASE AND CAMELCASE
 * toCamelCase: Converts a DB row's snake_case column names (board_id, model_ref,
 - created_at, ...) to the camelCase keys the domain entities (Task/Board/User)
 - declare. Applied once here so repositories can write plain `SELECT *` /
 `RETURNING *` without hand-aliasing every column.

 - Only transforms top-level keys — JSONB column values (e.g. position3d,
  whose own {x,y,z} keys aren't snake_case anyway) are left untouched.

  * toSnakeCase: Converts a domain entity's camelCase keys to snake_case for DB
  - column names. Applied once here so repositories can write plain `INSERT INTO
   ... (boardId, modelRef, ...) VALUES ...` without hand-aliasing every column.  
 */
export function toCamelCaseRow<T>(row: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(row)) {
    const camelKey = key
      .replace(/^_+/, "")
      .replace(/_+$/, "")
      .replace(/_([a-z0-9])/g, (_match, char: string) => char.toUpperCase());
    //.replace(/_/g, "");
    result[camelKey] = value;
  }
  return result as T;
}

export function toSnakeCaseRow<T>(row: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const snakeKey = key.replace(
      /([A-Z])/g,
      (_match, char: string) => `_${char.toLowerCase()}`,
    );
    result[snakeKey] = value;
  }
  return result as T;
}
