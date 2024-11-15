import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
const NullState = ({ image, title, text, buttonText, buttonUrl }: { image:string, title?: string, text?:string, buttonText?:string, buttonUrl?:string }) => {
  console.log(image);
  
  return (
    <div className="flex flex-col h-[100%] items-center justify-center gap-2">
      <Image src={image} alt="zerostate" width={200} height={160}/>
      
      <div className="font-semibold text-center text-sm text-[var(--secondary-text-color)]">{title}</div>
      <div className="text-xs text-center text-[var(--tertiary-text-color)]">{text}</div>
      <Button className="text-white w-auto">
            {buttonText}
      </Button>
    </div>
  );
};

export default NullState;