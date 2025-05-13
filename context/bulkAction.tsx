"use client";

import { useTrackerServices } from "@/services/trackerServices";
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
interface BulkActionContextType {
  isBulkActionActive: boolean;
  selectedIds: Set<string>;
  selectedData: any[];
  setSelectedData: Dispatch<any>;
  setSelectedIds: Dispatch<SetStateAction<Set<string>>>;
  setIsBulkActionActive: Dispatch<SetStateAction<boolean>>;
}

// Props interface for the provider component
interface Props {
  children: React.ReactNode;
}

// Create the context with a default value.
// We use a fallback function for `setIsBulkActionActive` to prevent runtime errors
// if the context is accidentally used outside the provider.
const BulkActionContext = createContext<BulkActionContextType | null>({
  isBulkActionActive: false,
  selectedIds: new Set<string>(),
  selectedData: [],
  setSelectedData: () => {},
  setSelectedIds: () => {},
  setIsBulkActionActive: () => {},
});

/**
 * BulkActionProvider
 * This provider wraps parts of the app where bulk action state (e.g., selecting multiple companies or people)
 * needs to be shared and controlled.
 */
export function BulkActionProvider({ children }: Props) {
  // Internal state to track if bulk action mode is enabled
  const [isBulkActionActive, setIsBulkActionActive] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedData, setSelectedData] = useState<any[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    setIsBulkActionActive(false);
    setSelectedIds(new Set());
  }, [pathname]);

  return (
    <BulkActionContext.Provider
      value={{
        isBulkActionActive,
        selectedIds,
        selectedData,
        setSelectedData,
        setSelectedIds,
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
export function useBulkAction() {
  const context = useContext(BulkActionContext);
  if (!context) {
    throw new Error("useBulkAction must be used inside BulkActionProvider");
  }
  return context;
}
