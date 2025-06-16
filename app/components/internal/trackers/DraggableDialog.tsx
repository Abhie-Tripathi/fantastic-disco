import { useState, useRef, useEffect, ReactNode } from 'react';

type DraggableDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  initialPosition?: { x: number; y: number };
  width?: string;
  height?: string;
  className?: string;
};

export const DraggableDialog = ({
  open,
  onOpenChange,
  children,
  initialPosition = { x: 0, y: 0 },
  width = '20rem',
  height = '40vh',
  className = ''
}: DraggableDialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || !dialogRef.current) return;
    
    setIsDragging(true);
    const rect = dialogRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!open) return null;

  return (
    <div 
      ref={dialogRef}
      className={`fixed z-[11] rounded-[1.875rem] overflow-hidden cursor-move ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width,
        height,
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};