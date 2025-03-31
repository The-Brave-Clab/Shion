import type { Updater } from "@tanstack/vue-table";
import type { Ref } from "vue";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function valueUpdater<T extends Updater<any>>(
  updaterOrValue: T,
  ref: Ref
) {
  ref.value =
    typeof updaterOrValue === "function"
      ? updaterOrValue(ref.value)
      : updaterOrValue;
}

export function withBaseUrl(url: string) {
  const baseUrl = import.meta.env.VITE_BASE_URL || "";
  return baseUrl + url;
}

export function singleValue<T>(value: T | T[]): T {
  return Array.isArray(value) ? value[0] : value;
}

export function arrayValue<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
