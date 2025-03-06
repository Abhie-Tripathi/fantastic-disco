"use client";

import { useFilterContext } from "@/context/filterContext";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useState } from "react";

export function useFilterState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const getFilterValue = useCallback(
    (key: string) => searchParams.get(key) || "",
    [searchParams]
  );

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (key !== "offset") {
        params.delete("offset"); // Remove 'skip' when any other filter changes
      }
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const deleteFilter = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      if (key !== "offset") {
        params.delete("offset"); // Remove 'skip' when any other filter is deleted
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const deleteMultipleFilters = useCallback(
    (keys: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      keys.forEach((key) => {
        params.delete(key);
      });
      if (!keys.includes("offset")) {
        params.delete("offset"); // Remove 'skip' if it's not in the list of keys to delete
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const replaceFilter = useCallback(
    (oldKey: string, newKey: string, newValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(oldKey);
      if (newValue) {
        params.set(newKey, newValue);
      }
      if (oldKey !== "offset" && newKey !== "offset") {
        params.delete("offset"); // Remove 'skip' when replacing any other filter
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const setMultipleFilters = useCallback(
    (filters: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      let offsetChanged = false;
      Object.entries(filters).forEach(([key, value]) => {
        if (key === "offset") offsetChanged = true;
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      if (!offsetChanged) {
        params.delete("offset"); // Remove 'skip' if it wasn't explicitly set
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const navigateWithParams = useCallback(
    (newPathname: string) => {
      const currentParams = searchParams.toString();
      router.push(`${newPathname}${currentParams ? `?${currentParams}` : ""}`);
    },
    [searchParams, router]
  );

  return {
    searchParams,
    getFilterValue,
    setFilter,
    deleteFilter,
    deleteMultipleFilters,
    replaceFilter,
    setMultipleFilters,
    navigateWithParams,
  };
}
