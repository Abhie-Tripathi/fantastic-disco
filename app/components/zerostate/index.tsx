import React from "react";
import Image from "next/image";
import ZeroStateIcon from "@/public/zero_state.svg";
import Link from "next/link";
import { isEventeli } from "@/config";

const ZeroState = ({ title, text, errorStatusCode }: { title?: string, text?: string, errorStatusCode?: number; }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 [color:var(--primary-color)] font-medium p-6 min-h-[300px] animate-fadeIn">
      {title && (
        <div className="w-full max-w-[400px] text-center text-lg md:text-xl transition-all duration-200 hover:scale-[1.02]">
          {title}
        </div>
      )}
      {text && (
        <div className="w-full max-w-[400px] text-center [color:var(--secondary-text-color)] [font-size:var(--font-size-default)] transition-all duration-200 hover:scale-[1.02]">
          {errorStatusCode && errorStatusCode === 429 ? (
            <div>
              You have reached the maximum limit to view data.{" "}
              <Link
                target="_blank"
                href={`https://whr.ai/pricing?utm_source=${
                  isEventeli ? "geo" : "gtm"
                }&utm_campaign=pricing&utm_medium=web&utm_term=research_upgrade_le`}
                className="text-primary cursor-pointer font-medium"
              >
                Please Upgrade.
              </Link>
            </div>
          ) : (
            text
          )}
        </div>
      )}
      <Image 
        src={ZeroStateIcon} 
        alt="zerostate" 
        width={200} 
        height={160}
        className="w-[180px] h-auto sm:w-[160px] md:w-[180px] lg:w-[200px] transition-transform duration-300 hover:scale-110 mt-4"
      />
    </div>
  );
};

export default ZeroState;