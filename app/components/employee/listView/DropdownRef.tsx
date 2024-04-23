import React, { useState, useEffect, useRef } from 'react';

interface DropdownHook{
    isOpen:boolean;
    toggleDropdown:()=>void;
    dropdownRef: React.RefObject<HTMLDivElement>;
    setIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
    
}
const DropdownRef = ():DropdownHook => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event:MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    
  };

  return { isOpen, toggleDropdown, dropdownRef, setIsOpen};
};

export default DropdownRef;

