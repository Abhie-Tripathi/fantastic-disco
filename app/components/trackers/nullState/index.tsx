import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const NullState = ({ image, title, text, buttonText, buttonUrl }: { image:string, title?: string, text?:string, buttonText?:string, buttonUrl?:string }) => {
  
  return (
    <div className="flex flex-col h-[100%] items-center justify-center gap-2">
      {/* <Image src={image} alt="zerostate"/> */}
      
      <div className="font-semibold text-center text-sm text-[var(--secondary-text-color)]">{title}</div>
      <div className="text-xs text-center text-[var(--tertiary-text-color)]">{text}</div>
      <Image src={image} alt="zerostate"/>
      {buttonText && buttonText.length>0 && 
      <Link href={`${buttonUrl}`}>
      <Button className="text-white w-auto">
            {buttonText}
      </Button>
      </Link>
       }
    </div>
  );
};

export default NullState;