"use client";

import { Leaf } from "lucide-react";
import Link from "next/link";
import { AppHeader } from "@/components/foundation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLogin } from "./use-login";
import { LoginForm } from "./components/login-form";
import { GuestLogin } from "./components/guest-login";

export default function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    isGuestLoading,
    anyLoading,
    message,
    error,
    authRequiredMessage,
    handleSubmit,
    handleGuestLogin,
  } = useLogin();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
              <Leaf aria-hidden="true" className="size-7" />
            </span>
            <div>
              <h1 className="font-heading text-2xl font-semibold text-foreground">
                Chào mừng trở lại!
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Đăng nhập để quản lý tủ lạnh của bạn
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Đăng nhập</CardTitle>
              <CardDescription>
                Sử dụng email và mật khẩu của bạn
              </CardDescription>
            </CardHeader>

            <CardContent>
              <LoginForm
                anyLoading={anyLoading}
                authRequiredMessage={authRequiredMessage}
                email={email}
                error={error}
                isLoading={isLoading}
                message={message}
                onSubmit={handleSubmit}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
              />
            </CardContent>

            <CardFooter className="flex-col gap-3">
              <div className="flex w-full items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">hoặc</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <GuestLogin
                anyLoading={anyLoading}
                isGuestLoading={isGuestLoading}
                onClick={handleGuestLogin}
              />
            </CardFooter>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link
              className="font-medium text-primary hover:underline"
              href="/signup"
            >
              Đăng ký miễn phí
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
