import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AddEventModal from "@/components/coordinate/addEvent/AddEventModal";
import { usePathname, useRouter } from "next/navigation";

const NullState = ({
  global,
  image,
  title,
  text,
  buttonText,
  buttonUrl,
}: {
  global?:string;
  image: string;
  title?: string;
  text?: React.ReactNode;
  buttonText?: string;
  buttonUrl?: string;
}) => {
  const router = useRouter();
  const pathName = usePathname();
  const whrModule = pathName === "/internal/coordinate" ? "coordinate": "";
  return (
    <div className="flex flex-col h-full items-center justify-center overflow-y-auto py-4 w-full">
      <div className="max-w-[90%] md:max-w-[80%] lg:max-w-[70%] flex flex-col items-center gap-3">
        {title && (
          <div className="font-semibold text-center text-xs sm:text-sm md:text-base text-[var(--secondary-text-color)]">
            {title}
          </div>
        )}
        {text && (
          <div className="text-[11px] sm:text-xs md:text-sm text-center text-[var(--tertiary-text-color)]">
            {text}
          </div>
        )}
        {!global && 
        <div className="relative w-full aspect-[4/3] max-w-[160px] mx-auto">
          <Image 
            src={image} 
            alt="zerostate" 
            className="object-contain"
            fill
            sizes="160px"
            priority
          />
        </div>}
        {buttonText && buttonText.length > 0 && (
          <div className="text-center flex flex-col sm:flex-row gap-5 items-center">
            <Button variant={whrModule === "coordinate" ? "outline" : "default"} onClick={()=>router.push(buttonUrl as string)} >{buttonText}</Button>

            {whrModule === "coordinate" &&
              <>
                <Button variant="outline" onClick={()=>window.open("/internal/trackers/savedevents?view=table", "_blank")} >Bookmarked Events</Button>
                <AddEventModal />
              </>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default NullState;
