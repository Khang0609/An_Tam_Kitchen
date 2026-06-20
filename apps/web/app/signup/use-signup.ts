"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromAuthResponse, signup } from "@/lib/api/auth";
import { setAuthHint } from "@/lib/auth-session";

export function useSignup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const signupPayload = await signup(name, email, password);
      const signedUpUser = getUserFromAuthResponse(signupPayload);

      if (signedUpUser) {
        setAuthHint({ name, email, ...signedUpUser });
        setMessage("Đăng ký thành công! Đang chuyển về trang chủ...");
        setTimeout(() => {
          router.push("/");
        }, 1500);
        return;
      }

      setMessage("Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Đăng ký thất bại. Vui lòng thử lại.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return {
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
  };
}
