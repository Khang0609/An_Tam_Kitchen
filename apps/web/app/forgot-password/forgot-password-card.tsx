"use client";

import { Info, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPassword } from "./use-forgot-password";

export function ForgotPasswordCard() {
  const {
    email,
    setEmail,
    isSubmitting,
    submitted,
    setSubmitted,
    handleSubmit,
  } = useForgotPassword();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Đặt lại mật khẩu</CardTitle>
        <CardDescription>
          Đây là placeholder giao diện trong lúc chờ backend
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!submitted ? (
          <form
            className="space-y-4"
            id="forgot-password-form"
            onSubmit={handleSubmit}
          >
            <div className="space-y-1.5">
              <Label htmlFor="forgot-email">
                <Mail className="size-3.5 text-muted-foreground" />
                Email đã đăng ký
              </Label>
              <Input
                autoComplete="email"
                disabled={isSubmitting}
                id="forgot-email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                type="email"
                value={email}
              />
            </div>

            <Button
              className="h-9 w-full"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi yêu cầu"
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-2 rounded-lg bg-accent/50 p-3 text-sm text-accent-foreground">
              <Info className="mt-0.5 size-4 shrink-0" />
              <span>
                Tính năng quên mật khẩu đang được chuẩn bị. Khi backend có
                API gửi email, form này sẽ được kết nối.
              </span>
            </div>

            <Button
              className="h-9 w-full"
              onClick={() => setSubmitted(false)}
              type="button"
              variant="outline"
            >
              Thử lại với email khác
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
