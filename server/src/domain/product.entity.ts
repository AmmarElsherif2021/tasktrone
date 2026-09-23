// Product entity in the system owned by board
export const PRODUCT_STAGES = [
  "draft",
  "concept",
  "detailed-design",
  "internal-review",
  "floor-feedback",
  "revision",
  "design-released",
] as const;
export type ProductStage = (typeof PRODUCT_STAGES)[number];
export interface CreateProductInput {
  boardId: string;
  name: string;
  skuName: string;
  description?: string;
  currentStage?: ProductStage;
  active_3d_model_url?: string | null;
  targetBudget?: number;
  ownerId?: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  currentStage?: ProductStage;
  active_3d_model_url?: string | null;
  targetBudget?: number;
  ownerId?: string;
  version?: number;
}
export interface Product {
  id: string;
  boardId: string; // UUID
  name: string; // e.g: "Product Name", max length constraint
  skuName: string; // e.g: "SKU12345", max length constraint
  description?: string; // Optional- max length constraint
  currentStage: ProductStage;
  active_3d_model_url?: string | null; // Nullable - must be valid URL
  targetBudget?: number; // Optional- non-negative decimal
  ownerId?: string; // Optional FK to User/Team
  version?: number; // Optional - version for concurrency control
  archivedAt?: Date | null; // Nullable timestamp for soft delete/archive
  createdAt: Date; // Required, immutable
  updatedAt: Date; // Required, auto-updated
}
