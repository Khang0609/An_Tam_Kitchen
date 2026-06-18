import { useSyncExternalStore } from "react";

function subscribe() {
  if (typeof window !== "undefined") {
    window.addEventListener("popstate", () => {});
  }
  return () => {};
}

function getSnapshot() {
  if (typeof window === "undefined") return "";
  return window.location.search;
}

function getServerSnapshot() {
  return "";
}

export function useLocationSearch() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
