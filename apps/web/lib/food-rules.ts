import { differenceInCalendarDays } from "date-fns";
import type { FoodStatus, Product } from "@repo/types";

type FoodStatusInput = {
  status?: FoodStatus | null;
  openedAt?: Date | null;
  expiryDate: Date;
  product?: Pick<Product, "daysAfterOpen"> | null;
};

export function resolveFoodStatus(
  input: FoodStatusInput,
  now = new Date()
): FoodStatus {
  if (input.status) return input.status;

  // TODO: Move this temporary rule engine behind the backend contract once the
  // API returns InventoryItem.status for food records.
  const daysUntilExpiry = differenceInCalendarDays(input.expiryDate, now);
  if (daysUntilExpiry < 0) return "not_recommended";
  if (daysUntilExpiry <= 1) return "use_soon";

  if (input.openedAt && input.product?.daysAfterOpen !== undefined) {
    const daysOpen = differenceInCalendarDays(now, input.openedAt);
    const daysLeftAfterOpen = input.product.daysAfterOpen - daysOpen;

    if (daysLeftAfterOpen < 0) return "not_recommended";
    if (daysLeftAfterOpen <= 1) return "use_soon";
    if (daysLeftAfterOpen <= 3) return "check_before_use";
  }

  if (daysUntilExpiry <= 3) return "check_before_use";

  return "fresh";
}
