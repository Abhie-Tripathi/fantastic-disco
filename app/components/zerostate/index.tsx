import React from "react";
import Image from "next/image";
import ZeroStateIcon from "@/public/zero_state.svg";
import Link from "next/link";
import { isEventeli } from "@/config";
import { GAEvent } from "@/utils/GAEvent";
import { useAuthContext } from "@/context";
import { MembershipPlan } from "@/data/membershipPlans";

const ZeroState = ({ title, text, errorStatusCode, isGlobal }: { title?: string, text?: string, errorStatusCode?: number; isGlobal?:boolean }) => {
  const { membershipData } = useAuthContext();
  const isPremium =
    !!membershipData && membershipData.membership != null && membershipData.membership > MembershipPlan.Freemium;
    
  const handleUpgradeClick = () => {
    GAEvent("", "Plan Upgrade", "Research", `${isEventeli ? "geo" : "gtm"} | pricing | web | research_upgrade_le`);
  }
  return (
    <div className={`flex flex-col items-center justify-center gap-4 [color:var(--primary-color)] font-medium p-6 ${isGlobal?"min-h-[180px]":"min-h-[300px]"} animate-fadeIn`}>
      {title && (
        <div className="w-full max-w-[600px] text-center text-lg md:text-xl transition-all duration-200 hover:scale-[1.02]">
          {title}
        </div>
      )}
      {text && (
        <div className="w-full max-w-[600px] text-center [color:var(--secondary-text-color)] [font-size:var(--font-size-default)] transition-all duration-200 hover:scale-[1.02]">
          {errorStatusCode && errorStatusCode === 429 ? (
          isPremium ? (
            <div>
              You’ve exhausted your Advanced Searches and daily basic search limit.<br/> Basic limit will reset tomorrow at 10:00 AM IST or{" "}
              <Link
                target="_blank"
                href={`https://whr.ai/pricing?utm_source=${
                  isEventeli ? "geo" : "gtm"
                }&utm_campaign=pricing&utm_medium=web&utm_term=research_upgrade_le`}
                className="text-primary cursor-pointer font-semibold underline"
                onClick={handleUpgradeClick}
              >
                upgrade
              </Link>{" "}
              to increase the advance searches.
            </div>
          ) : (
            <div>
              Your search limit has been reached.<br/>
              <Link
                target="_blank"
                href={`https://whr.ai/pricing?utm_source=${
                  isEventeli ? "geo" : "gtm"
                }&utm_campaign=pricing&utm_medium=web&utm_term=research_upgrade_le`}
                className="text-primary cursor-pointer font-medium underline"
                onClick={handleUpgradeClick}
              >
              Upgrade 
              </Link>{" "}
              to a higher‑tier plan to access the features you need.
            </div>
          )
        ) : (
          text
        )}
        </div>
      )}
      {!isGlobal &&
      <Image 
        src={ZeroStateIcon} 
        alt="zerostate" 
        width={200} 
        height={160}
        className="w-[180px] h-auto sm:w-[160px] md:w-[180px] lg:w-[200px] transition-transform duration-300 hover:scale-110 mt-4"
      />}
    </div>
  );
};

export default ZeroState;