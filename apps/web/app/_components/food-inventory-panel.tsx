"use client";

import { FoodStatusBadge, LoadingState } from "@/components/foundation";
import { useFoods } from "@/hooks/use-foods";

export function FoodInventoryPanel() {
  const { foods, isLoading, error, usingMockFallback, refresh } = useFoods();

  if (isLoading) {
    return <LoadingState description="Đang tải danh sách thực phẩm." />;
  }

  return (
    <div className="rounded-lg border border-[#e7ecdf] bg-white p-5 text-[#1d271f]">
      {error ? (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Chưa tải được dữ liệu từ API thật. Đang dùng dữ liệu mẫu tách riêng.
        </div>
      ) : null}

      {usingMockFallback ? (
        <div className="mb-4 rounded-md border border-[#dfe9d0] bg-[#f7faf2] px-4 py-3 text-sm text-[#526055]">
          Dữ liệu hiện tại là mock fallback cho tới khi backend có endpoint
          inventory.
        </div>
      ) : null}

      <div className="max-h-[500px] overflow-y-auto pr-2 divide-y divide-[#edf1e8] custom-scrollbar">
        {foods.map((food) => (
          <div
            className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
            key={food.id}
          >
            <div>
              <p className="text-lg font-semibold">{food.displayName}</p>
              <p className="mt-1 text-sm text-[#657062]">
                {food.locationLabel}
                {food.quantity ? ` · ${food.quantity}` : ""}
              </p>
            </div>
            <FoodStatusBadge status={food.status} />
          </div>
        ))}
      </div>

      <button
        className="mt-4 inline-flex h-10 items-center justify-center rounded-md border border-[#cdbf9f] bg-white px-4 text-sm font-semibold text-[#23402d] transition hover:border-[#9eb585] hover:bg-[#f7f0df]"
        onClick={refresh}
        type="button"
      >
        Tải lại
      </button>
    </div>
  );
}
