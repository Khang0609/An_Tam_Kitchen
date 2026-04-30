import { useSyncExternalStore } from "react";

const AUTH_HINT_KEY = "antam.authenticated";
const AUTH_HINT_CHANGE_EVENT = "antam-auth-hint-change";

function canUseLocalStorage() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

export function setAuthHint() {
  if (!canUseLocalStorage()) return;

  try {
    window.localStorage.setItem(AUTH_HINT_KEY, "true");
    notifyAuthHintChange();
  } catch {
    // localStorage is only a UX hint; ignore unavailable storage.
  }
}

export function clearAuthHint() {
  if (!canUseLocalStorage()) return;

  try {
    window.localStorage.removeItem(AUTH_HINT_KEY);
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

function notifyAuthHintChange() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(AUTH_HINT_CHANGE_EVENT));
}
