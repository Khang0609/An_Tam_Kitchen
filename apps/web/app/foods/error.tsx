"use client";

import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Error Boundary cho route /foods/* (Issue #14)
 *
 * Hiển thị thông báo lỗi thân thiện liên quan đến thực phẩm,
 * có nút Retry và quay lại dashboard.
 */
export default function FoodsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto w-full max-w-lg rounded-3xl border bg-background p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-900">
            <AlertTriangle aria-hidden="true" className="size-6" />
          </span>

          <h1 className="mt-5 text-xl font-semibold text-foreground sm:text-2xl">
            Không tải được thông tin thực phẩm
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Đã xảy ra lỗi khi tải dữ liệu thực phẩm. Bạn có thể thử lại hoặc
            quay lại tủ lạnh số.
          </p>

          {process.env.NODE_ENV === "development" && error?.message ? (
            <pre className="mt-4 max-h-32 w-full overflow-auto rounded-2xl bg-muted p-3 text-left text-xs text-muted-foreground">
              {error.message}
            </pre>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              className="h-11 rounded-2xl px-5"
              onClick={reset}
              type="button"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              Thử lại
            </Button>

            <Button
              asChild
              className="h-11 rounded-2xl"
              variant="outline"
            >
              <Link href="/#digital-fridge">
                <ArrowLeft aria-hidden="true" className="size-4" />
                Quay lại dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
