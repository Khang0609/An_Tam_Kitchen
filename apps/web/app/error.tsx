"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Global Error Boundary (Issue #14)
 *
 * Next.js App Router convention: exports a default component
 * receiving { error, reset } to handle runtime errors gracefully.
 */
export default function GlobalError({
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
            Đã xảy ra lỗi
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Ứng dụng gặp sự cố không mong muốn. Bạn có thể thử tải lại trang
            hoặc quay lại sau ít phút.
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
          </div>
        </div>
      </div>
    </div>
  );
}
