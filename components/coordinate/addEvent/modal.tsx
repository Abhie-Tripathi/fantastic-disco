"use client";
import { Button } from "@/components/ui/button";
import { Cross } from "geist-icons";
import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode; // This will accept any React elements passed from the parent
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
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
        className={`fixed top-0 right-0 w-1/2 h-full bg-background z-50 transform transition-all duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {isOpen &&
          <div className="left-[-32px] absolute">
            <Button
                className="p-2 rounded-[2px] h-8"
                variant="outline"
                onClick={onClose}
              >
                <Cross width="14px" height="14px" color="var(--tertiary-text-color)" />
              </Button>
          </div>
        }
        <div className="p-6 h-full">
          {/* Render the children content passed from the parent */}
          {/* <div>{children}</div> */}
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
