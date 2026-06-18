"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromAuthResponse, login } from "@/lib/api/auth";
import { getSafeNextPath, setAuthHint } from "@/lib/auth-session";
import { useLocationSearch } from "@/hooks/use-location-search";

export function useLogin() {
  const router = useRouter();
  const locationSearch = useLocationSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const searchParams = new URLSearchParams(locationSearch);
  const safeNext = getSafeNextPath(searchParams.get("next"));
  const authRequiredMessage =
    searchParams.get("reason") === "auth-required"
      ? "Bạn cần đăng nhập để sử dụng tính năng này."
      : "";

  async function handleLogin(
    loginEmail: string,
    loginPassword: string,
    isGuest = false
  ) {
    setMessage("");
    setError("");

    if (isGuest) {
      setIsGuestLoading(true);
    } else {
      setIsLoading(true);
    }

    try {
      const loginPayload = await login(loginEmail, loginPassword);
      setAuthHint(
        getUserFromAuthResponse(loginPayload) ??
          (isGuest
            ? { email: loginEmail, name: "Tài khoản khách", isGuest: true }
            : { email: loginEmail })
      );
      setMessage("Đăng nhập thành công! Đang chuyển tiếp...");
      setTimeout(() => {
        router.push(safeNext ?? "/");
      }, 1000);
    } catch (err) {
      if (isGuest) {
        setError(
          "Tài khoản khách chưa được bật trên backend. Vui lòng chạy seed guest hoặc thử lại sau."
        );
      } else {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Đăng nhập thất bại. Vui lòng kiểm tra lại email/mật khẩu.";
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
      setIsGuestLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleLogin(email, password);
  }

  async function handleGuestLogin() {
    setMessage("");
    setError("");
    setIsGuestLoading(true);

    try {
      const loginPayload = await import("@/lib/api/auth").then((m) => m.guestLogin());
      setAuthHint(
        getUserFromAuthResponse(loginPayload) ?? { name: "Tài khoản khách", isGuest: true }
      );
      setMessage("Vào tài khoản khách thành công! Đang chuyển tiếp...");
      setTimeout(() => {
        router.push(safeNext ?? "/");
      }, 1000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Đăng nhập khách thất bại.";
      setError(errorMessage);
    } finally {
      setIsGuestLoading(false);
    }
  }

  const anyLoading = isLoading || isGuestLoading;

  return {
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
  };
}
