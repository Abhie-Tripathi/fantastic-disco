"use client";
import { Button } from "@/components/ui/button";
import { Cross } from "geist-icons";
import { X } from "lucide-react";
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode; // This will accept any React elements passed from the parent
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
      {/* Modal content */}
      <div
        className={cn(
          "fixed top-0 right-0 w-1/2 h-full bg-background z-50 transform transition-all duration-500 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
          className
        )}
      >
        <div className="py-6 h-full">{children}</div>
      </div>
    </>
  );
};

export default Modal;
