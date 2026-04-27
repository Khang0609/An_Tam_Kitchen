"use client";

import { differenceInCalendarDays, format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Clock3,
  Info,
  MapPin,
  NotebookText,
  PackageOpen,
  Tags,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { FoodStatus } from "@repo/types";
import {
  EmptyState,
  FoodStatusBadge,
  LoadingState,
  SectionCard,
} from "@/components/foundation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getFoodById } from "@/lib/api/foods";
import type { FoodItemViewModel } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type FoodDetailViewState = {
  food: FoodItemViewModel | null;
  isLoading: boolean;
  error: string | null;
};

type DetailLineProps = {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
  muted?: boolean;
};

const recommendationByStatus: Record<FoodStatus, string> = {
  fresh:
    "Sản phẩm vẫn đang trong thời gian khuyến nghị. Hãy tiếp tục bảo quản đúng cách.",
  use_soon: "Nên ưu tiên sử dụng sản phẩm này trong thời gian gần.",
  check_before_use:
    "Nên kiểm tra mùi, màu sắc và hướng dẫn trên bao bì trước khi sử dụng.",
  not_recommended:
    "Không khuyến nghị tiếp tục để quá lâu. Hãy cân nhắc loại bỏ nếu có dấu hiệu bất thường.",
};

const disclaimer =
  "Thông tin chỉ mang tính tham khảo. Hãy kiểm tra mùi, màu sắc và hướng dẫn trên bao bì trước khi sử dụng.";

export function FoodDetailView({ foodId }: { foodId: string }) {
  const reduceMotion = useReducedMotion();
  const [state, setState] = useState<FoodDetailViewState>({
    food: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadFood() {
      setState((current) => ({ ...current, isLoading: true, error: null }));

      try {
        const result = await getFoodById(foodId, {
          signal: controller.signal,
        });

        setState({
          food: result.item,
          isLoading: false,
          error: result.error?.message ?? null,
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        setState({
          food: null,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Chưa tải được chi tiết thực phẩm.",
        });
      }
    }

    void loadFood();

    return () => controller.abort();
  }, [foodId]);

  if (state.isLoading) {
    return (
      <DetailShell>
        <LoadingState
          description="Đang tải thông tin chi tiết và trạng thái khuyến nghị."
          title="Đang mở chi tiết thực phẩm"
        />
      </DetailShell>
    );
  }

  if (!state.food) {
    return (
      <DetailShell>
        <EmptyState
          description="Món này không có trong dữ liệu hiện tại. Bạn có thể quay lại dashboard để chọn món khác."
          title="Không tìm thấy thực phẩm"
        />
        <BackToDashboard className="mt-4" />
      </DetailShell>
    );
  }

  const food = state.food;
  const openedLabel = food.openedAt
    ? format(food.openedAt, "dd/MM/yyyy")
    : "Chưa ghi nhận";
  const openedDays = food.openedAt
    ? Math.max(0, differenceInCalendarDays(new Date(), food.openedAt))
    : null;
  const expiryLabel = food.hasExplicitExpiryDate
    ? format(food.expiryDate, "dd/MM/yyyy")
    : "Chưa ghi nhận";

  return (
    <DetailShell>
      {state.error ? (
        <Alert className="border-amber-200 bg-amber-50 text-amber-950">
          <AlertCircle aria-hidden={true} className="size-4" />
          <AlertTitle>Dữ liệu đang dùng bản dự phòng</AlertTitle>
          <AlertDescription className="text-amber-900">
            API thật chưa phản hồi, nên trang đang hiển thị dữ liệu từ mock
            adapter.
          </AlertDescription>
        </Alert>
      ) : null}

      <motion.section
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        className="rounded-3xl border bg-background p-5 shadow-sm sm:p-6"
        initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
              Chi tiết thực phẩm
            </p>
            <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-normal sm:text-4xl">
              {food.displayName}
            </h1>
          </div>
          <FoodStatusBadge className="w-fit max-w-full" status={food.status} />
        </div>

        <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">
          {recommendationByStatus[food.status]}
        </p>
      </motion.section>

      <motion.div
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]"
        initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
        transition={{ delay: 0.05, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <SectionCard
          description="Các mốc chính giúp gia đình xem lại thông tin trước khi sử dụng."
          eyebrow="Thông tin sản phẩm"
          title="Mốc bảo quản"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <DetailLine
              icon={CalendarDays}
              label="Ngày mở nắp"
              value={openedLabel}
            />
            <DetailLine
              icon={Clock3}
              label="Số ngày đã mở"
              value={openedDays === null ? "Chưa ghi nhận" : `${openedDays} ngày`}
            />
            <DetailLine
              icon={MapPin}
              label="Vị trí bảo quản"
              value={food.locationLabel}
            />
            <DetailLine
              icon={Tags}
              label="Nhóm thực phẩm"
              value={food.categoryLabel}
            />
            <DetailLine
              icon={PackageOpen}
              label="Hạn sử dụng trên bao bì"
              value={expiryLabel}
            />
            <DetailLine
              icon={NotebookText}
              label="Ghi chú"
              muted={!food.notes}
              value={food.notes ?? "Chưa có ghi chú"}
            />
          </div>
        </SectionCard>

        <SectionCard
          description="Phần này giải thích nguồn hoặc rule đang tạo ra trạng thái hiện tại."
          eyebrow="Nguồn trạng thái"
          title="Vì sao có trạng thái này?"
        >
          <div className="rounded-2xl border bg-card p-4">
            <p className="text-sm font-semibold text-primary">
              {food.statusSourceLabel}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {food.statusExplanation}
            </p>
          </div>

          <div
            className={cn(
              "mt-4 rounded-2xl border p-4 text-sm leading-6",
              food.status === "not_recommended"
                ? "border-rose-200 bg-rose-50 text-rose-950"
                : "border-amber-200 bg-amber-50 text-amber-950"
            )}
          >
            <p className="font-semibold">Khuyến nghị theo trạng thái</p>
            <p className="mt-2">{recommendationByStatus[food.status]}</p>
          </div>
        </SectionCard>
      </motion.div>

      <Alert className="border-sky-200 bg-sky-50 text-sky-950">
        <Info aria-hidden={true} className="size-4" />
        <AlertTitle>Lưu ý khi sử dụng</AlertTitle>
        <AlertDescription className="text-sky-900">
          {disclaimer}
        </AlertDescription>
      </Alert>

      <BackToDashboard />
    </DetailShell>
  );
}

function DetailShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-5 px-4 py-6 sm:px-6 sm:py-12 lg:px-8">
      {children}
    </div>
  );
}

function DetailLine({ icon: Icon, label, value, muted }: DetailLineProps) {
  return (
    <div className="flex min-h-20 items-start gap-3 rounded-2xl border bg-background p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <Icon aria-hidden={true} className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "mt-2 block break-words text-base font-semibold leading-6",
            muted ? "text-muted-foreground" : "text-foreground"
          )}
        >
          {value}
        </span>
      </span>
    </div>
  );
}

function BackToDashboard({ className }: { className?: string }) {
  return (
    <Button
      asChild
      className={cn("h-11 w-full justify-center rounded-2xl sm:w-fit", className)}
      variant="outline"
    >
      <Link href="/#digital-fridge">
        <ArrowLeft aria-hidden={true} className="size-4" />
        Quay lại dashboard
      </Link>
    </Button>
  );
}
