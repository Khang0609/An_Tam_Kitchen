import Link from "next/link";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppHeaderProps = {
  className?: string;
};

const navItems = [
  { href: "/#digital-fridge", label: "Tủ lạnh" },
  { href: "/#add-food", label: "Cách hoạt động" },
  { href: "/#features", label: "Tính năng" },
];

export function AppHeader({ className }: AppHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75",
        className
      )}
    >
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          className="inline-flex items-center gap-3 rounded-lg text-foreground outline-none transition hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
          href="/"
        >
          <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Leaf aria-hidden="true" className="size-5" />
          </span>
          <span className="grid leading-tight">
            <span className="font-heading text-base font-semibold">
              Bếp An Tâm
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Quản lý thực phẩm đã mở nắp
            </span>
          </span>
        </Link>

        <nav
          aria-label="Điều hướng chính"
          className="hidden items-center gap-1 md:flex"
        >
          {navItems.map((item) => (
            <Button asChild key={item.href} size="sm" variant="ghost">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/login">Đăng nhập</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Đăng ký</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
