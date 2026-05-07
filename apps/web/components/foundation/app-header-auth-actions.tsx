"use client";

import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/api/auth";
import {
  clearAuthHint,
  useAuthHint,
  useAuthUserHint,
} from "@/lib/auth-session";

export function AppHeaderAuthActions() {
  const router = useRouter();
  const hasSessionHint = useAuthHint();
  const userHint = useAuthUserHint();

  if (!hasSessionHint) {
    return (
      <>
        <Button asChild size="sm" variant="outline">
          <Link href="/login">Đăng nhập</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/signup">Đăng ký</Link>
        </Button>
      </>
    );
  }

  const displayName = userHint?.name ?? userHint?.email ?? "Người dùng";

  async function handleLogout() {
    try {
      await logout();
    } finally {
      clearAuthHint();
      router.push("/");
      router.refresh();
    }
  }

  return (
    <>
      <span className="inline-flex h-9 max-w-48 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-foreground">
        <UserRound aria-hidden={true} className="size-4 shrink-0 text-primary" />
        <span className="hidden text-muted-foreground sm:inline">Xin chào,</span>
        <span className="truncate font-medium">{displayName}</span>
      </span>
      <Button
        aria-label="Đăng xuất"
        onClick={handleLogout}
        size="icon-sm"
        title="Đăng xuất"
        type="button"
        variant="outline"
      >
        <LogOut aria-hidden={true} className="size-4" />
      </Button>
    </>
  );
}
