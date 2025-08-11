"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuthContext } from "@/context";
import { format } from "date-fns";
import { GAEvent } from "@/utils/GAEvent";
import { isEventeli } from "@/config";
import { MembershipPlan } from "@/data/membershipPlans";

const getPlanName = (membershipNumber: number | null): string => {
  if (membershipNumber === null) return "Freemium";
  
  switch (membershipNumber) {
    case MembershipPlan.Freemium:
      return "Freemium";
    case MembershipPlan.Essential:
      return "Essential";
    case MembershipPlan.Scale:
      return "Scale";
    case MembershipPlan.Advance:
      return "Advance";
    case MembershipPlan.Enterprise:
      return "Enterprise";
    default:
      return "Freemium";
  }
};

export default function SubscriptionBanner() {
  const { membershipData } = useAuthContext();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const bannerHeight = isVisible ? 48 : 0;
    document.documentElement.style.setProperty('--banner-height', `${bannerHeight}px`);
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleUpgrade = () => {
    window.open(
      `https://whr.ai/pricing?utm_source=${
        isEventeli ? "geo" : "gtm"
      }&utm_campaign=pricing&utm_medium=web&utm_term=trial_upgrade`,
      "_blank"
    );
    GAEvent(
      "",
      "Plan Upgrade",
      "banner",
      `${isEventeli ? "geo" : "gtm"} | pricing | web | banner_upgrade_cta`
    );
  };

  const handleExploreFeatures = () => {
    window.open(
      `https://whr.ai/pricing?utm_source=${
        isEventeli ? "geo" : "gtm"
      }&utm_campaign=pricing&utm_medium=web&utm_term=trial_explorefeature`,
      "_blank"
    );
    GAEvent(
      "",
      "Explore Features",
      "banner",
      `${isEventeli ? "geo" : "gtm"} | pricing | web | banner_explore_cta`
    );
  };

  if (!isVisible || !membershipData) return null;

  const isTrial = membershipData.isTrial;

  if (!isTrial) return null;

  const getBannerMessage = () => {
    if (isTrial) {
      const planName = getPlanName(membershipData.membership);
      const trialDaysLeft = membershipData.endDate
        ? Math.max(
            0,
            Math.ceil(
              (new Date(membershipData.endDate).getTime() -
                new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )
          )
        : 0;
      
      if (trialDaysLeft > 0) {
        const dayText = trialDaysLeft === 1 ? "Day" : "Days";
        return `🎉 You're on the ${planName} Trial – ${trialDaysLeft} ${dayText} Left! You have full access to all features under the ${planName} plan.`;
      } else {
        return `🎉 You're on the ${planName} Trial! You have full access to all features under the ${planName} plan.`;
      }
    }
    return "";
  };

  return (
    <div className="bg-gray-900 text-white px-4 py-3 flex items-center">
      <button
        onClick={handleDismiss}
        className="text-gray-400 hover:text-white transition-colors"
        aria-label="Dismiss banner"
      >
        <X size={16} />
      </button>

      <div className="flex-1 flex items-center justify-center gap-2">
        <div className="text-sm">{getBannerMessage()}</div>
        <button
          onClick={handleExploreFeatures}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          Explore Features
        </button>
        <button
          onClick={handleUpgrade}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          Upgrade Now →
        </button>
      </div>

      <div className="w-4"></div>
    </div>
  );
}
