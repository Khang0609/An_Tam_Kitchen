import type { Metadata } from "next";
import { AppHeader } from "@/components/foundation";
import { FoodDetailView } from "@/components/food/food-detail-view";

export const metadata: Metadata = {
  title: "Chi tiết thực phẩm | Bếp An Tâm",
  description:
    "Xem chi tiết trạng thái, mốc bảo quản và khuyến nghị tham khảo cho một thực phẩm.",
};

export default async function FoodDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-dvh bg-card text-foreground">
      <AppHeader />
      <main>
        <FoodDetailView foodId={id} />
      </main>
    </div>
  );
}
