/*
BOM Item in this context: a BOMItem is one line entry in a Product's Bill of Materials — a required component/material tied to a Product,
 with a quantity and unit cost. It's not cosmetic data: 
 ProductService's phase-gate logic (issue #41) requires a Product's BOMItems to 
 be non-empty before it can pass certain production/validation gates, 
 and computes Σ(quantity × unit_cost) against the Product's target_budget, 
 throwing a BudgetExceededError if it's over. 
 So a BOM Item is both a completeness-gate and a cost-control unit
 as a product moves through Kanban stages.
*/

export interface BomItem {
  id: string;
  productId: string; // UUID - FK to Product
  partNumber: string; // e.g: "PN12345", max length constraint
  name: string; // e.g: "Component Name", max length constraint
  quantity: number; // Non-negative integer
  unitCost?: number; // Optional - non-negative decimal
  totalPrice?: number; // Optional - calculated as quantity * unitPrice
  createdAt: Date; // Required, immutable
  updatedAt: Date; // Required, auto-updated
}
