import { useSyncExternalStore } from "react";

const AUTH_HINT_KEY = "antam.authenticated";
const AUTH_USER_HINT_KEY = "antam.user";
const AUTH_HINT_CHANGE_EVENT = "antam-auth-hint-change";
let cachedAuthUserRaw: string | null = null;
let cachedAuthUserHint: AuthUserHint | null = null;

export type AuthUserHint = {
  id?: string;
  name?: string;
  email?: string;
};

function canUseLocalStorage() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

export function setAuthHint(user?: AuthUserHint | null) {
  if (!canUseLocalStorage()) return;

  try {
    window.localStorage.setItem(AUTH_HINT_KEY, "true");
    const normalizedUser = normalizeAuthUserHint(user);
    if (normalizedUser) {
      window.localStorage.setItem(
        AUTH_USER_HINT_KEY,
        JSON.stringify(normalizedUser)
      );
    }
    notifyAuthHintChange();
  } catch {
    // localStorage is only a UX hint; ignore unavailable storage.
  }
}

export function clearAuthHint() {
  if (!canUseLocalStorage()) return;

  try {
    window.localStorage.removeItem(AUTH_HINT_KEY);
    window.localStorage.removeItem(AUTH_USER_HINT_KEY);
    notifyAuthHintChange();
  } catch {
    // localStorage is only a UX hint; ignore unavailable storage.
  }
}

export function hasAuthHint() {
  if (!canUseLocalStorage()) return false;

  try {
    return window.localStorage.getItem(AUTH_HINT_KEY) === "true";
  } catch {
    return false;
  }
}

export function getAuthUserHint(): AuthUserHint | null {
  if (!canUseLocalStorage()) return null;

  try {
    const rawUser = window.localStorage.getItem(AUTH_USER_HINT_KEY);
    if (!rawUser) return null;
    if (rawUser === cachedAuthUserRaw) return cachedAuthUserHint;

    cachedAuthUserRaw = rawUser;
    cachedAuthUserHint = normalizeAuthUserHint(JSON.parse(rawUser));
    return cachedAuthUserHint;
  } catch {
    cachedAuthUserRaw = null;
    cachedAuthUserHint = null;
    return null;
  }
}

export function getSafeNextPath(next: string | null) {
  if (!next) return null;

  const candidate = next.trim();

  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return null;
  }

  try {
    const url = new URL(candidate, window.location.origin);

    if (url.origin !== window.location.origin) {
      return null;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export function getAuthRequiredHref(targetPath: string) {
  const candidate = targetPath.trim();
  const nextPath =
    candidate.startsWith("/") && !candidate.startsWith("//") ? candidate : "/";

  return `/login?next=${encodeURIComponent(nextPath)}&reason=auth-required`;
}

export function useAuthHint() {
  return useSyncExternalStore(
    subscribeToAuthHint,
    hasAuthHint,
    getServerAuthHintSnapshot
  );
}

export function useAuthUserHint() {
  return useSyncExternalStore(
    subscribeToAuthHint,
    getAuthUserHint,
    getServerAuthUserSnapshot
  );
}

function subscribeToAuthHint(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(AUTH_HINT_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(AUTH_HINT_CHANGE_EVENT, onStoreChange);
  };
}

function getServerAuthHintSnapshot() {
  return false;
}

function getServerAuthUserSnapshot() {
  return null;
}

function notifyAuthHintChange() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(AUTH_HINT_CHANGE_EVENT));
}

function normalizeAuthUserHint(user: unknown): AuthUserHint | null {
  if (!user || typeof user !== "object") return null;

  const record = user as Record<string, unknown>;
  const normalizedUser: AuthUserHint = {};

  if (typeof record.id === "string" && record.id.trim()) {
    normalizedUser.id = record.id.trim();
  }

  if (typeof record.name === "string" && record.name.trim()) {
    normalizedUser.name = record.name.trim();
  }

  if (typeof record.email === "string" && record.email.trim()) {
    normalizedUser.email = record.email.trim();
  }

  return Object.keys(normalizedUser).length > 0 ? normalizedUser : null;
}
