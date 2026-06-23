import { AlertCircle, CheckCircle2, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFormProps = {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  isLoading: boolean;
  anyLoading: boolean;
  message: string;
  error: string;
  authRequiredMessage: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  anyLoading,
  message,
  error,
  authRequiredMessage,
  onSubmit,
}: LoginFormProps) {
  return (
    <form className="space-y-4" id="login-form" onSubmit={onSubmit}>
      <div className="space-y-1.5">
        <Label htmlFor="login-email">
          <Mail className="size-3.5 text-muted-foreground" />
          Email
        </Label>
        <Input
          autoComplete="email"
          disabled={anyLoading}
          id="login-email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
          type="email"
          value={email}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">
            <Lock className="size-3.5 text-muted-foreground" />
            Mật khẩu
          </Label>
          <Link
            className="text-xs text-primary hover:underline"
            href="/forgot-password"
          >
            Quên mật khẩu?
          </Link>
        </div>
        <Input
          autoComplete="current-password"
          disabled={anyLoading}
          id="login-password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
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
      {authRequiredMessage ? (
        <div className="flex items-start gap-2 rounded-lg bg-accent/50 p-3 text-sm text-accent-foreground">
          <Lock className="mt-0.5 size-4 shrink-0" />
          <span>{authRequiredMessage}</span>
        </div>
      ) : null}
      {error ? (
        <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <Button className="h-9 w-full" disabled={anyLoading} type="submit">
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Đang đăng nhập...
          </>
        ) : (
          "Đăng nhập"
        )}
      </Button>
    </form>
  );
}
