"use client";

import { useSyncExternalStore, useMemo } from "react";

/**
 * Hook thay thế cho useReducedMotion.
 * Sử dụng useSyncExternalStore - Cách chuẩn nhất của React để kết nối với Browser API.
 * Giúp tránh hoàn toàn lỗi "cascading renders" và lỗi Hydration của Next.js.
 */
export function useReducedMotion() {
  // Tạo mediaQuery object cố định
  const mediaQuery = useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.matchMedia("(prefers-reduced-motion: reduce)");
  }, []);

  // Đăng ký lắng nghe sự thay đổi
  const subscribe = (callback: () => void) => {
    if (!mediaQuery) return () => {};
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  };

  // Lấy giá trị hiện tại trên Client
  const getSnapshot = () => {
    return mediaQuery ? mediaQuery.matches : false;
  };

  // Giá trị mặc định trên Server (để tránh lỗi Hydration)
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
