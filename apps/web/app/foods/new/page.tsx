import type { Metadata } from "next";
import { CalendarDays, ClipboardCheck, Plus } from "lucide-react";
import { AppHeader } from "@/components/foundation";
import { AddFoodForm } from "@/components/food/add-food-form";

export const metadata: Metadata = {
  title: "Thêm thực phẩm | Bếp An Tâm",
  description:
    "Thêm thực phẩm đã mở nắp vào tủ lạnh số của Bếp An Tâm.",
};

export default function NewFoodPage() {
  return (
    <div className="min-h-dvh bg-card text-foreground">
      <AppHeader />

      <main className="py-6 sm:py-12">
        <div className="mx-auto grid max-w-5xl gap-5 px-4 sm:gap-6 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <section className="lg:pt-3">
            <p className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm font-medium text-primary shadow-sm">
              <Plus aria-hidden={true} className="size-4" />
              Thêm thực phẩm
            </p>
            <h1 className="mt-5 text-2xl font-semibold leading-tight tracking-normal sm:text-4xl">
              Ghi nhanh món vừa mở nắp
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Chỉ cần vài thông tin chính để Bếp An Tâm đưa món vào tủ lạnh số
              và nhắc bạn xem lại đúng lúc hơn.
            </p>

            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border bg-background p-4 shadow-sm">
                <CalendarDays
                  aria-hidden={true}
                  className="mb-3 size-5 text-primary"
                />
                <p className="font-semibold">Ngày mở nắp là thông tin chính</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Mốc này giúp sắp xếp món nên xem trước trong dashboard.
                </p>
              </div>
              <div className="rounded-2xl border bg-background p-4 shadow-sm">
                <ClipboardCheck
                  aria-hidden={true}
                  className="mb-3 size-5 text-primary"
                />
                <p className="font-semibold">Khuyến nghị chỉ là tham chiếu</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Khi dùng thực phẩm, bạn vẫn nên kiểm tra bao bì và cảm quan
                  thực tế.
                </p>
              </div>
            </div>
          </section>

          <AddFoodForm />
        </div>
      </main>
    </div>
  );
}
