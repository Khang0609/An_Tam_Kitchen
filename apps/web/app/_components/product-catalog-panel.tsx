"use client";

import { Package, Search } from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import type { Product } from "@repo/types";
import { EmptyState, SectionCard } from "@/components/foundation";
import { Input } from "@/components/ui/input";
import { useProductList } from "@/hooks/queries/use-product-list";
import { cn } from "@/lib/utils";

/**
 * ProductCatalogPanel (Issue #16)
 *
 * Component sử dụng hook `useProductList()` để hiển thị danh sách
 * sản phẩm catalog. Bọc bởi Suspense với skeleton fallback.
 */
export function ProductCatalogPanel() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogContent />
    </Suspense>
  );
}

function CatalogContent() {
  const { data: products } = useProductList();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.company.toLowerCase().includes(q)
    );
  }, [products, search]);

  return (
    <SectionCard
      eyebrow="Sản phẩm"
      title="Danh mục sản phẩm"
      description="Tìm kiếm và duyệt sản phẩm trong hệ thống."
    >
      <div className="relative mb-4">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          className="h-11 rounded-2xl pl-9"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm sản phẩm theo tên hoặc công ty..."
          type="search"
          value={search}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          description={
            search
              ? "Không tìm thấy sản phẩm phù hợp với từ khóa."
              : "Chưa có sản phẩm nào trong danh mục."
          }
          title={search ? "Không có kết quả" : "Danh mục trống"}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-2xl border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <Package aria-hidden="true" className="size-4" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {product.name}
          </h3>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {product.company}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium",
            product.isGlobal
              ? "bg-sky-50 text-sky-800"
              : "bg-violet-50 text-violet-800"
          )}
        >
          {product.isGlobal ? "Hệ thống" : "Riêng tư"}
        </span>
      </div>
    </article>
  );
}

function CatalogSkeleton() {
  return (
    <div className="rounded-3xl border bg-background p-5 shadow-sm">
      <div className="space-y-3 mb-5">
        <div className="animate-pulse rounded-2xl bg-muted h-4 w-20" />
        <div className="animate-pulse rounded-2xl bg-muted h-6 w-40" />
        <div className="animate-pulse rounded-2xl bg-muted h-4 w-64" />
      </div>
      <div className="animate-pulse rounded-2xl bg-muted h-11 mb-4" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="rounded-2xl border bg-card p-4" key={i}>
            <div className="flex items-start gap-3">
              <div className="animate-pulse rounded-2xl bg-muted size-10 shrink-0" />
              <div className="min-w-0 space-y-2 flex-1">
                <div className="animate-pulse rounded-2xl bg-muted h-4 w-28" />
                <div className="animate-pulse rounded-2xl bg-muted h-3 w-20" />
              </div>
            </div>
            <div className="mt-3">
              <div className="animate-pulse rounded-full bg-muted h-5 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
