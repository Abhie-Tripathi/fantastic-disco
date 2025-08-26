"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

// Define the shape of the context value.
// It holds a boolean indicating if bulk action mode is active
// and a function to update this state.
interface BulkActionContextType<T = any> {
  isBulkActionActive: boolean;
  selectedData: Record<string, T>;
  setSelectedData: Dispatch<SetStateAction<Record<string, T>>>;
  setIsBulkActionActive: Dispatch<SetStateAction<boolean>>;
}

// Props interface for the provider component
interface Props<T> {
  children: React.ReactNode;
}

// Create the context with a default value.
// We use a fallback function for `setIsBulkActionActive` to prevent runtime errors
// if the context is accidentally used outside the provider.
const BulkActionContext = createContext<BulkActionContextType | null>({
  isBulkActionActive: false,
  selectedData: {},
  setSelectedData: () => {},
  setIsBulkActionActive: () => {},
});

/**
 * BulkActionProvider
 * This provider wraps parts of the app where bulk action state (e.g., selecting multiple companies or people)
 * needs to be shared and controlled.
 */
export function BulkActionProvider<T = any>({ children }: Props<T>) {
  // Internal state to track if bulk action mode is enabled
  const [isBulkActionActive, setIsBulkActionActive] = useState(false);
  const [selectedData, setSelectedData] = useState<Record<string, T>>({});
  const pathname = usePathname();

  useEffect(() => {
    setIsBulkActionActive(false);
    setSelectedData({});
  }, [pathname]);

  return (
    <BulkActionContext.Provider
      value={{
        isBulkActionActive,
        selectedData,
        setSelectedData,
        setIsBulkActionActive,
      }}
    >
      {children}
    </BulkActionContext.Provider>
  );
}

/**
 * useBulkAction
 * Custom hook to access the bulk action state and toggle function.
 * Ensures the hook is used only within a component wrapped by BulkActionProvider.
 */
export function useBulkAction<T>() {
  const context = useContext(
    BulkActionContext
  ) as BulkActionContextType<T> | null;
  if (!context) {
    throw new Error("useBulkAction must be used inside BulkActionProvider");
  }
  return context;
}
