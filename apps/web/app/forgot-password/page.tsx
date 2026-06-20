import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/foundation";
import { ForgotPasswordCard } from "./forgot-password-card";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Quên mật khẩu?"
      description="Nhập email để nhận hướng dẫn đặt lại mật khẩu"
      footer={
        <p className="text-center text-sm text-muted-foreground">
          <Link
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            href="/login"
          >
            <ArrowLeft className="size-3.5" />
            Quay lại đăng nhập
          </Link>
        </p>
      }
    >
      <ForgotPasswordCard />
    </AuthLayout>
  );
}
