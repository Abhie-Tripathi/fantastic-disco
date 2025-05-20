import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NullState = ({
  image,
  title,
  text,
  buttonText,
  buttonUrl,
}: {
  image: string;
  title?: string;
  text?: string;
  buttonText?: string;
  buttonUrl?: string;
}) => {
  return (
    <div className="flex flex-col h-full min-h-[300px] items-center justify-center gap-4 p-4 md:p-6 lg:p-8">
      <div className="max-w-[90%] md:max-w-[80%] lg:max-w-[70%] space-y-3">
        {title && (
          <div className="font-semibold text-center text-sm sm:text-base lg:text-lg text-[var(--secondary-text-color)]">
            {title}
          </div>
        )}
        {text && (
          <div className="text-xs sm:text-sm text-center text-[var(--tertiary-text-color)]">
            {text}
          </div>
        )}
        <div className="relative w-full aspect-square max-w-[200px] mx-auto">
          <Image 
            src={image} 
            alt="zerostate" 
            className="object-contain"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        {buttonText && buttonText.length > 0 && (
          <div className="text-center pt-4">
            <Link href={`${buttonUrl}`}>
              <Button className="text-white w-auto px-6 py-2 text-sm sm:text-base">
                {buttonText}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NullState;
