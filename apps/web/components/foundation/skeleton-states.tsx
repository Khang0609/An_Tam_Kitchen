/**
 * Skeleton States (Issue #15)
 *
 * Thay thế LoadingState (spinner) bằng Skeleton UI cho các Suspense boundary.
 * Mô phỏng layout thật để giảm Cumulative Layout Shift (CLS).
 */

import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-muted", className)}
      role="presentation"
    />
  );
}

// ─── Dashboard Skeleton ────────────────────────────────

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Bone className="h-4 w-20" />
          <Bone className="h-9 w-48 sm:w-64" />
          <Bone className="h-5 w-72 sm:w-96" />
        </div>
        <Bone className="h-12 w-40 rounded-2xl" />
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            className="rounded-3xl border bg-background p-4 shadow-sm"
            key={i}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <Bone className="h-4 w-24" />
                <Bone className="h-8 w-12" />
              </div>
              <Bone className="size-11 shrink-0 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Food List + Sidebar */}
      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <div className="rounded-3xl border bg-background p-5 shadow-sm">
          <div className="space-y-3 mb-5">
            <Bone className="h-4 w-24" />
            <Bone className="h-6 w-56" />
            <Bone className="h-4 w-80" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="rounded-3xl border bg-card p-4" key={i}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 space-y-3 flex-1">
                    <div className="flex gap-2 items-center">
                      <Bone className="h-5 w-36" />
                      <Bone className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <Bone className="h-14 rounded-2xl" key={j} />
                      ))}
                    </div>
                  </div>
                  <Bone className="h-11 w-28 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="rounded-3xl border bg-background p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Bone className="size-11 rounded-2xl" />
            <div className="space-y-2">
              <Bone className="h-3 w-12" />
              <Bone className="h-5 w-24" />
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <Bone className="h-14 rounded-2xl" />
            <Bone className="h-14 rounded-2xl" />
          </div>
          <Bone className="mt-4 h-8 w-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Food Detail Skeleton ──────────────────────────────

export function FoodDetailSkeleton() {
  return (
    <div className="grid gap-5">
      {/* Header Section */}
      <div className="rounded-3xl border bg-background p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-3">
            <Bone className="h-4 w-28" />
            <Bone className="h-9 w-52 sm:w-72" />
          </div>
          <Bone className="h-7 w-28 rounded-full" />
        </div>
        <Bone className="mt-5 h-5 w-full max-w-3xl" />
      </div>

      {/* Detail Grid */}
      <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        {/* Left: Info Section */}
        <div className="rounded-3xl border bg-background p-5 shadow-sm">
          <div className="space-y-3 mb-4">
            <Bone className="h-4 w-24" />
            <Bone className="h-6 w-32" />
            <Bone className="h-4 w-64" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                className="flex min-h-20 items-start gap-3 rounded-2xl border bg-background p-4"
                key={i}
              >
                <Bone className="size-10 shrink-0 rounded-2xl" />
                <div className="min-w-0 space-y-2 flex-1">
                  <Bone className="h-3 w-20" />
                  <Bone className="h-5 w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Status Section */}
        <div className="rounded-3xl border bg-background p-5 shadow-sm">
          <div className="space-y-3 mb-4">
            <Bone className="h-4 w-20" />
            <Bone className="h-6 w-44" />
            <Bone className="h-4 w-56" />
          </div>
          <Bone className="h-24 rounded-2xl" />
          <Bone className="mt-4 h-20 rounded-2xl" />
        </div>
      </div>

      {/* Disclaimer */}
      <Bone className="h-16 rounded-xl" />

      {/* Back Button */}
      <Bone className="h-11 w-52 rounded-2xl" />
    </div>
  );
}

// ─── Food Inventory Panel Skeleton ─────────────────────

export function FoodInventoryPanelSkeleton() {
  return (
    <div className="rounded-lg border border-[#e7ecdf] bg-white p-5">
      <div className="divide-y divide-[#edf1e8]">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
            key={i}
          >
            <div className="space-y-2">
              <Bone className="h-5 w-36" />
              <Bone className="h-4 w-28" />
            </div>
            <Bone className="h-6 w-24 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
