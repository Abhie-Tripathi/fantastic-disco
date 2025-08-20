import React from "react";
import Image from "next/image";
import ZeroStateIcon from "@/public/zero_state.svg";
import Link from "next/link";
import { isEventeli } from "@/config";
import { GAEvent } from "@/utils/GAEvent";
import { useAuthContext } from "@/context";
import { MembershipPlan } from "@/data/membershipPlans";
import { usePathname } from "next/navigation";

const ZeroState = ({
  title,
  text,
  errorStatusCode,
  isGlobal,
  issues,
}: {
  title?: string;
  text?: string;
  errorStatusCode?: number;
  isGlobal?: boolean;
  issues?: any[];
}) => {
  const { membershipData } = useAuthContext();
  const pathname = usePathname();
  const isPremium =
    !!membershipData &&
    membershipData.membership != null &&
    membershipData.membership > MembershipPlan.Freemium;

  const getTokenBasedMessage = () => {
    if (!issues || issues.length === 0) return null;
    
    const tokenInfo = issues[0];
    const { advanceToken, basicToken } = tokenInfo;
    
    if (!advanceToken && !basicToken) {
      if (!isPremium) {
        return "Your search limit has been reached. Upgrade to a higher‑tier plan to access the features you need.";
      }
      return "You've hit today's search limit. Basic search resets at 10:00 AM IST, or upgrade to get advance tokens now";
    }
    
    if (!advanceToken && basicToken) {
      return "Advance tokens are consumed. You're now on a daily basic search. Upgrade for more tokens or keep using basic search.";
    }
    
    if (advanceToken && !basicToken) {
      return "You've exhausted basic daily limit. Basic limit will reset tomorrow or continue with the advanced searches.";
    }
    
    return null;
  };

  const handleUpgradeClick = () => {
    GAEvent(
      "",
      "Plan Upgrade",
      "Research",
      `${isEventeli ? "geo" : "gtm"} | pricing | web | research_upgrade_le`
    );
  };
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 [color:var(--primary-color)] font-medium p-6 ${
        isGlobal ? "min-h-[180px]" : "min-h-[300px]"
      } animate-fadeIn`}
    >
      {title && (
        <div className="w-full max-w-[400px] text-center text-lg md:text-xl transition-all duration-200 hover:scale-[1.02]">
          {title}
        </div>
      )}
      {text && (
        <div
          className={`w-full flex justify-center max-w-[600px] text-center [color:var(--secondary-text-color)] [font-size:var(--font-size-default)] transition-all duration-200 hover:scale-[1.02]`}
        >
          {errorStatusCode == 400 ? (
            pathname.split("/").includes("trackers") ? (
              <div>There was an issue with your request.</div>
            ) : (
              <div>
                There was an issue with your request.{" "}
                <Link
                  href="/internal/search/events"
                  className="text-primary cursor-pointer font-medium underline"
                >
                  Click here
                </Link>{" "}
                to reset and try again.
              </div>
            )
          ) : errorStatusCode && errorStatusCode === 429 ? (
            (() => {
              const tokenMessage = getTokenBasedMessage();
              if (tokenMessage) {
                return (
                  <div>
                    {tokenMessage.includes("upgrade") ? (
                      <>
                        {tokenMessage === "You've hit today's search limit. Basic search resets at 10:00 AM IST, or upgrade to get advance tokens now" ? (
                          <>
                            You've hit today's search limit.
                            <br />
                            Basic search resets at 10:00 AM IST, or{" "}
                            <Link
                              target="_blank"
                              href={`https://whr.ai/pricing?utm_source=${
                                isEventeli ? "geo" : "gtm"
                              }&utm_campaign=pricing&utm_medium=web&utm_term=research_upgrade_le`}
                              className="text-primary cursor-pointer font-medium underline"
                              onClick={handleUpgradeClick}
                            >
                              upgrade
                            </Link>{" "}
                            to get advance tokens now
                          </>
                        ) : (
                          <>
                            {tokenMessage.split("upgrade")[0]}
                            <Link
                              target="_blank"
                              href={`https://whr.ai/pricing?utm_source=${
                                isEventeli ? "geo" : "gtm"
                              }&utm_campaign=pricing&utm_medium=web&utm_term=research_upgrade_le`}
                              className="text-primary cursor-pointer font-medium underline"
                              onClick={handleUpgradeClick}
                            >
                              upgrade
                            </Link>
                            {tokenMessage.split("upgrade")[1]}
                          </>
                        )}
                      </>
                    ) : (
                      tokenMessage
                    )}
                  </div>
                );
              }
              
              return isPremium ? (
                <div>
                  You&apos;ve exhausted your search limit.
                  <br />
                  Limit will reset tomorrow at 10:00 AM IST.
                </div>
              ) : (
                <div>
                  Your search limit has been reached.
                  <br />
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
              );
            })()
          ) : (
            <div className="max-w-[400px]">{text}</div>
          )}
        </div>
      )}
      {!isGlobal && (
        <Image
          src={ZeroStateIcon}
          alt="zerostate"
          width={200}
          height={160}
          className="w-[180px] h-auto sm:w-[160px] md:w-[180px] lg:w-[200px] transition-transform duration-300 hover:scale-110 mt-4"
        />
      )}
    </div>
  );
};

export default ZeroState;
