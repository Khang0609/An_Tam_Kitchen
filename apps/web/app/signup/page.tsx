import Link from "next/link";
import { AuthLayout } from "@/components/foundation";
import { SignupCard } from "./signup-card";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Tạo tài khoản mới"
      description="Bắt đầu quản lý tủ lạnh thông minh cùng Bếp An Tâm"
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link
            className="font-medium text-primary hover:underline"
            href="/login"
          >
            Đăng nhập ngay
          </Link>
        </p>
      }
    >
      <SignupCard />
    </AuthLayout>
  );
}
