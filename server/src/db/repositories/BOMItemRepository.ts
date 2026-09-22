import { DBAdapter } from "../adapter";
import { BomItem } from "../../domain/bom-item.entity";
import { toSnakeCaseRow } from "../implementations/case-mapping";
// productId: string; // UUID - FK to Product
//   partNumber: string; // e.g: "PN12345", max length constraint
//   name: string; // e.g: "Component Name", max length constraint
//   quantity: number; // Non-negative integer
//   unitCost?: number; // Optional - non-negative decimal
//   totalPrice?: number; // Optional - calculated as quantity * unitPrice
//   createdAt: Date; // Required, immutable
//   updatedAt: Date; // Required, auto-updated
export interface CreateBOMItemInput {
  productId: string;
  partNumber: string;
  name: string;
  quantity: number;
  unitCost?: number;
}

export interface UpdateBOMItemInput {
  name?: string;
  quantity?: number;
  unitCost?: number;
}

export class BOMItemRepository {
  constructor(private readonly db: DBAdapter) {}

  async create(input: CreateBOMItemInput): Promise<BomItem> {
    const row = await this.db.queryOne<BomItem>(
      `INSERT INTO bom_items (product_id, part_number, name, quantity, unit_cost)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        input.productId,
        input.partNumber,
        input.name,
        input.quantity,
        input.unitCost ?? 0,
      ],
    );
    if (!row) throw new Error("Failed to create task");
    return row;
  }

  async findById(id: string): Promise<BomItem | null> {
    return this.db.queryOne<BomItem>("SELECT * FROM bom_items WHERE id = $1", [
      id,
    ]);
  }

  async findByProduct(productId: string): Promise<BomItem[]> {
    return this.db.query<BomItem>(
      "SELECT * FROM bom_items WHERE product_id = $1 ORDER BY created_at DESC",
      [productId],
    );
  }

  async update(
    id: string,
    changes: UpdateBOMItemInput,
  ): Promise<BomItem | null> {
    const snakeChanges = toSnakeCaseRow<Record<string, unknown>>(
      changes as Record<string, unknown>,
    );

    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    for (const [column, value] of Object.entries(snakeChanges)) {
      if (value === undefined) continue;
      fields.push(`${column} = $${i++}`);
      values.push(value);
    }

    // no-op read so callers get the current row.
    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push("updated_at = NOW()");
    values.push(id);

    return this.db.queryOne<BomItem>(
      `UPDATE bom_items SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
      values,
    );
  }
  async delete(id: string): Promise<BomItem | null> {
    return this.db.queryOne<BomItem>(
      `DELETE FROM bom_items WHERE id = $1 RETURNING *`,
      [id],
    );
  }
}
