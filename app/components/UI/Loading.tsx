import React from "react";
import Image from "next/image";
import loadingPacman from "@/public/loadingPacman.gif";

interface LoadingProps {
  className?: string;
}

const Loading = ({ className }: LoadingProps) => {
  return (
    <div className={`flex items-center justify-center w-full h-full ${className}`}>
      <Image 
        src={loadingPacman}
        alt="Loading..."
        width={150}
        height={150}
      />
    </div>
  );
};

export default Loading;