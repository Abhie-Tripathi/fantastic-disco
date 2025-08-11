"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface TransitionContextType {
  inTransition: boolean;
  setInTransition: (value: boolean) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [inTransition, setInTransition] = useState(false);

  return (
    <TransitionContext.Provider value={{ inTransition, setInTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
} 