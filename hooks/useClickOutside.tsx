import React, { useEffect, useRef } from "react";

const useClickOutside = (
  menuNode: React.MutableRefObject<HTMLElement | null>,
  handler: () => void
) => {
  useEffect(() => {
    const eventHandler = (event: any) => {
      if (!menuNode?.current?.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", eventHandler);

    return () => {
      document.removeEventListener("mousedown", eventHandler);
    };
  }, [handler, menuNode]);

  return;
};

export default useClickOutside;