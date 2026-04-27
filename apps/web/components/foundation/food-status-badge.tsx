import { CircleCheck, Clock3, SearchCheck, ShieldAlert } from "lucide-react";
import type { ComponentType } from "react";
import type { FoodStatus } from "@repo/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type FoodUiStatus = "safe" | "use_soon" | "check" | "avoid";

type FoodStatusBadgeProps = {
  status: FoodUiStatus | FoodStatus;
  className?: string;
};

const statusConfig: Record<
  FoodUiStatus,
  {
    label: string;
    className: string;
    icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  }
> = {
  safe: {
    label: "Còn trong thời gian khuyến nghị",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
    icon: CircleCheck,
  },
  use_soon: {
    label: "Nên dùng sớm",
    className: "border-amber-200 bg-amber-50 text-amber-800",
    icon: Clock3,
  },
  check: {
    label: "Nên kiểm tra kỹ",
    className: "border-orange-200 bg-orange-50 text-orange-800",
    icon: SearchCheck,
  },
  avoid: {
    label: "Không nên để quá lâu",
    className: "border-rose-200 bg-rose-50 text-rose-800",
    icon: ShieldAlert,
  },
};

export function FoodStatusBadge({
  status,
  className,
}: FoodStatusBadgeProps) {
  const normalizedStatus = normalizeFoodStatus(status);
  const config = statusConfig[normalizedStatus];
  const Icon = config.icon;

  return (
    <Badge
      className={cn(
        "h-auto gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold leading-5",
        config.className,
        className
      )}
      variant="outline"
    >
      <Icon aria-hidden={true} className="size-3.5" />
      {config.label}
    </Badge>
  );
}

export function getFoodStatusLabel(status: FoodUiStatus | FoodStatus) {
  return statusConfig[normalizeFoodStatus(status)].label;
}

function normalizeFoodStatus(status: FoodUiStatus | FoodStatus): FoodUiStatus {
  if (status === "fresh") return "safe";
  if (status === "check_before_use") return "check";
  if (status === "not_recommended") return "avoid";
  return status;
}
