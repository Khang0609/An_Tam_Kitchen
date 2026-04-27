"use client";

import { differenceInCalendarDays, format } from "date-fns";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  Clock3,
  ClipboardCheck,
  MapPin,
  Plus,
  Refrigerator,
  SearchCheck,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import type { FoodStatus } from "@repo/types";
import {
  EmptyState,
  ErrorState,
  FoodStatusBadge,
  getFoodStatusLabel,
  LoadingState,
  SectionCard,
} from "@/components/foundation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFoods } from "@/hooks/use-foods";
import type { FoodItemViewModel } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type FilterValue = "all" | "use_soon" | "check" | "safe";

const filterOptions: Array<{ value: FilterValue; label: string }> = [
  { value: "all", label: "Tất cả" },
  { value: "use_soon", label: "Nên dùng sớm" },
  { value: "check", label: "Cần kiểm tra" },
  { value: "safe", label: "Trong mốc khuyến nghị" },
];

const statusPriority: Record<FoodStatus, number> = {
  not_recommended: 0,
  check_before_use: 1,
  use_soon: 2,
  fresh: 3,
};

export function DigitalFridgeDashboard() {
  const { foods, isLoading, error, usingMockFallback, refresh } = useFoods();
  const [filter, setFilter] = useState<FilterValue>("all");
  const reduceMotion = useReducedMotion();

  const sortedFoods = useMemo(() => {
    return [...foods].sort((a, b) => {
      const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
      if (priorityDiff !== 0) return priorityDiff;
      return a.expiryDate.getTime() - b.expiryDate.getTime();
    });
  }, [foods]);

  const visibleFoods = useMemo(() => {
    return sortedFoods.filter((food) => {
      if (filter === "all") return true;
      if (filter === "safe") return food.status === "fresh";
      if (filter === "check") {
        return (
          food.status === "check_before_use" ||
          food.status === "not_recommended"
        );
      }
      return food.status === "use_soon";
    });
  }, [filter, sortedFoods]);

  const stats = useMemo(() => {
    return {
      total: foods.length,
      useSoon: foods.filter((food) => food.status === "use_soon").length,
      check: foods.filter((food) => food.status === "check_before_use").length,
      safe: foods.filter((food) => food.status === "fresh").length,
      priority: foods.filter((food) => food.status !== "fresh").length,
    };
  }, [foods]);

  const priorityFoods = useMemo(
    () => sortedFoods.filter((food) => food.status !== "fresh"),
    [sortedFoods]
  );

  if (isLoading) {
    return (
      <section className="scroll-mt-20 bg-card py-12 sm:py-16" id="digital-fridge">
        <DashboardShell>
          <LoadingState
            description="Đang tải danh sách thực phẩm và trạng thái khuyến nghị."
            title="Đang mở tủ lạnh số"
          />
        </DashboardShell>
      </section>
    );
  }

  if (error && foods.length === 0) {
    return (
      <section className="scroll-mt-20 bg-card py-12 sm:py-16" id="digital-fridge">
        <DashboardShell>
          <ErrorState
            description="Không tải được dữ liệu từ API hoặc mock adapter."
            onRetry={refresh}
            title="Chưa tải được tủ lạnh số"
          />
        </DashboardShell>
      </section>
    );
  }

  return (
    <section className="scroll-mt-20 bg-card py-12 sm:py-16" id="digital-fridge">
      <DashboardShell>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
              Dashboard
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal sm:text-4xl">
              Tủ lạnh số
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              Theo dõi thực phẩm đã mở nắp và biết món nào nên dùng trước.
            </p>
          </div>
          <Button asChild className="h-12 rounded-2xl px-5 text-base">
            <Link href="/foods/new">
              <Plus aria-hidden={true} className="size-4" />
              Thêm thực phẩm
            </Link>
          </Button>
        </div>

        {usingMockFallback ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
            Backend chưa có endpoint inventory, dashboard đang dùng mock adapter
            tách riêng từ service layer.
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
            API thật chưa phản hồi, Bếp An Tâm đang hiển thị dữ liệu mẫu để demo.
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Refrigerator}
            label="Tổng số món"
            value={stats.total}
          />
          <StatCard
            icon={Sparkles}
            label="Nên dùng sớm"
            tone="amber"
            value={stats.useSoon}
          />
          <StatCard
            icon={SearchCheck}
            label="Cần kiểm tra kỹ"
            tone="orange"
            value={stats.check}
          />
          <StatCard
            icon={ClipboardCheck}
            label="Còn trong thời gian khuyến nghị"
            tone="emerald"
            value={stats.safe}
          />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_20rem]">
          <SectionCard
            action={
              <Tabs
                className="w-full sm:w-auto"
                onValueChange={(value) => setFilter(value as FilterValue)}
                value={filter}
              >
                <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-2xl p-1 sm:w-auto">
                  {filterOptions.map((option) => (
                    <TabsTrigger
                      className="min-h-10 flex-none rounded-xl px-3"
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            }
            description="Danh sách được sắp xếp theo mức ưu tiên: không nên để quá lâu, cần kiểm tra, nên dùng sớm, rồi còn ổn."
            eyebrow="Danh sách ưu tiên"
            title="Món nên xem trước hôm nay"
          >
            {foods.length === 0 ? (
              <EmptyState
                description="Khi bạn thêm thực phẩm, các món sẽ xuất hiện trong tủ lạnh số."
                title="Tủ lạnh số đang trống"
              />
            ) : visibleFoods.length === 0 ? (
              <EmptyState
                description="Không có món nào trong bộ lọc hiện tại."
                title="Không có món phù hợp"
              />
            ) : (
              <div className="grid gap-4">
                {visibleFoods.map((food, index) => (
                  <FoodCard
                    food={food}
                    index={index}
                    key={food.id}
                    reduceMotion={reduceMotion}
                  />
                ))}
              </div>
            )}
          </SectionCard>

          <ReminderPreview
            priorityCount={stats.priority}
            priorityFood={priorityFoods[0]}
          />
        </div>
      </DashboardShell>
    </section>
  );
}

function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: number;
  tone?: "default" | "amber" | "orange" | "emerald";
}) {
  const toneClassName = {
    default: "bg-accent text-accent-foreground",
    amber: "bg-amber-50 text-amber-900",
    orange: "bg-orange-50 text-orange-900",
    emerald: "bg-emerald-50 text-emerald-900",
  }[tone];

  return (
    <div className="rounded-3xl border bg-background p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
        </div>
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-2xl",
            toneClassName
          )}
        >
          <Icon aria-hidden={true} className="size-5" />
        </span>
      </div>
    </div>
  );
}

function FoodCard({
  food,
  index,
  reduceMotion,
}: {
  food: FoodItemViewModel;
  index: number;
  reduceMotion: boolean | null;
}) {
  const openedLabel = food.openedAt
    ? format(food.openedAt, "dd/MM/yyyy")
    : "Chưa mở nắp";
  const openedDays = food.openedAt
    ? Math.max(0, differenceInCalendarDays(new Date(), food.openedAt))
    : null;

  return (
    <motion.article
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      className="rounded-3xl border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
      transition={{
        delay: Math.min(index * 0.04, 0.16),
        duration: 0.24,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <h3 className="text-lg font-semibold leading-tight">
              {food.displayName}
            </h3>
            <FoodStatusBadge className="w-fit" status={food.status} />
          </div>
          <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <InfoLine
              icon={CalendarDays}
              label="Ngày mở nắp"
              value={openedLabel}
            />
            <InfoLine
              icon={Clock3}
              label="Số ngày đã mở"
              value={openedDays === null ? "Chưa ghi nhận" : `${openedDays} ngày`}
            />
            <InfoLine
              icon={MapPin}
              label="Vị trí bảo quản"
              value={food.locationLabel}
            />
            <InfoLine
              icon={AlertCircle}
              label="Ghi chú"
              value={food.notes ?? "Chưa có ghi chú"}
            />
          </div>
        </div>

        <Button asChild className="h-11 rounded-2xl lg:mt-0" variant="outline">
          <Link href={`/foods/${food.id}`}>
            Xem chi tiết
            <ArrowRight aria-hidden={true} className="size-4" />
          </Link>
        </Button>
      </div>
    </motion.article>
  );
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-2xl bg-background px-3 py-2">
      <Icon aria-hidden={true} className="mt-0.5 size-4 shrink-0 text-primary" />
      <span className="min-w-0">
        <span className="block text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <span className="block truncate font-medium text-foreground">
          {value}
        </span>
      </span>
    </div>
  );
}

function ReminderPreview({
  priorityCount,
  priorityFood,
}: {
  priorityCount: number;
  priorityFood?: FoodItemViewModel;
}) {
  const priorityText = priorityFood
    ? `${priorityFood.displayName} — ${getFoodStatusLabel(priorityFood.status)}`
    : "Hiện chưa có món nào cần ưu tiên trong danh sách.";

  return (
    <aside className="rounded-3xl border bg-background p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Sparkles aria-hidden={true} className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-primary">Nhắc nhở</p>
          <h3 className="font-heading text-lg font-semibold">
            Gợi ý hôm nay
          </h3>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm font-medium">{priorityText}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm font-medium">
            {priorityCount > 0
              ? `Bạn có ${priorityCount} món nên xem trước hôm nay`
              : "Các món còn lại đang ở trạng thái ít cần chú ý hơn"}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        Đây là preview giả lập để demo luồng nhắc nhở, chưa gọi endpoint reminder
        thật.
      </p>
    </aside>
  );
}
