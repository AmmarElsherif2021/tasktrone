/*
WIPBatch in this context: a WIPBatch is a trackable quantity of a single Product moving through
the shop floor together — the operational counterpart to Product.currentStage. Where a Product's
currentStage marks its position in the overall NPI lifecycle (Design -> Development ->
Manufacturing -> Quality -> Shipping).
*/

export const CURRENT_STATIONS = [
  "Machining",
  "Welding",
  "Assembly",
  "Inspection",
  "Packaging",
  "Shipped",
] as const;
export type CurrentStation = (typeof CURRENT_STATIONS)[number];

export interface WipBatch {
  id: string;
  productId: string; // UUID - FK to Product
  batchNumber: string; // e.g: "BATCH-0001", max length constraint
  quantity: number; // Non-negative integer - units carried in this batch
  currentStation: CurrentStation;
  startedAt: Date; // Required - when the batch entered the floor
  completedAt?: Date | null; // Nullable - set when the batch reaches "Shipped"
  createdAt: Date; // Required, immutable
  updatedAt: Date; // Required, auto-updated
}
