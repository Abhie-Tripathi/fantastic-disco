// Modal.tsx

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
        className={`fixed top-0 right-0 w-2/3 h-full bg-background z-50 transform transition-all duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full">
          <h2 className="text-lg font-semibold leading-none tracking-tight mb-4">Add Event</h2>
          {/* Render the children content passed from the parent */}
          {/* <div>{children}</div> */}
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
