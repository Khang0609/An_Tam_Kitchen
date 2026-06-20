"use client";

import { AlertCircle, CheckCircle2, Loader2, Lock, Mail, User } from "lucide-react";
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
import { useSignup } from "./use-signup";

export function SignupCard() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    message,
    error,
    handleSubmit,
  } = useSignup();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Đăng ký</CardTitle>
        <CardDescription>
          Điền thông tin bên dưới để tạo tài khoản
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="space-y-4"
          id="signup-form"
          onSubmit={handleSubmit}
        >
          <div className="space-y-1.5">
            <Label htmlFor="signup-name">
              <User className="size-3.5 text-muted-foreground" />
              Họ tên
            </Label>
            <Input
              autoComplete="name"
              disabled={isLoading}
              id="signup-name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
              required
              type="text"
              value={name}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-email">
              <Mail className="size-3.5 text-muted-foreground" />
              Email
            </Label>
            <Input
              autoComplete="email"
              disabled={isLoading}
              id="signup-email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              type="email"
              value={email}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signup-password">
              <Lock className="size-3.5 text-muted-foreground" />
              Mật khẩu
            </Label>
            <Input
              autoComplete="new-password"
              disabled={isLoading}
              id="signup-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 8 ký tự"
              required
              type="password"
              value={password}
            />
          </div>

          {message ? (
            <div className="flex items-start gap-2 rounded-lg bg-accent/50 p-3 text-sm text-accent-foreground">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              <span>{message}</span>
            </div>
          ) : null}
          {error ? (
            <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <Button className="h-9 w-full" disabled={isLoading} type="submit">
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Đang tạo tài khoản...
              </>
            ) : (
              "Đăng ký"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
