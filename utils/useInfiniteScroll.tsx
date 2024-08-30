import { useEffect } from "react";

const useInfiniteScroll = (divRef: any, callback: any) => {

  useEffect(() => {
    const handleScroll = () => {
      const currentDiv = divRef.current;
      if (currentDiv) {
        const { scrollTop, scrollHeight, clientHeight } = currentDiv;
        if (scrollTop + clientHeight >= scrollHeight - 2) {
          callback();
        }
      }
    };

    const currentDiv = divRef.current;
    if (currentDiv) {
      currentDiv.addEventListener("scroll", handleScroll);
    }

    return () => {
      const currentDiv = divRef.current;
      if (currentDiv) {
        currentDiv.removeEventListener("scroll", handleScroll);
      }
    };
  }, [callback]);
};

export default useInfiniteScroll;