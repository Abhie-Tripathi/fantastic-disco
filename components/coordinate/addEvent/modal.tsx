"use client";
import { Button } from "@/components/ui/button";
import { Cross } from "geist-icons";
import { X } from "lucide-react";
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
        className={`fixed top-0 right-0 w-full sm:w-2/3 lg:w-1/2 2xl:w-1/3 h-full bg-background z-50 transform transition-all duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* {isOpen &&
          <div className="left-0 sm:left-[-24px] absolute">
            <Button
                className="p-1 rounded-[2px] h-6"
                variant="outline"
                onClick={onClose}
              >
                <Cross width="14px" height="14px" color="var(--tertiary-text-color)" />
              </Button>
          </div>
        } */}
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
