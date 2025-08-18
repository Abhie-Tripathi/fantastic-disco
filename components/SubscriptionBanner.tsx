"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuthContext } from "@/context";
import { format } from "date-fns";
import { GAEvent } from "@/utils/GAEvent";
import { isEventeli } from "@/config";
import { MembershipPlan } from "@/data/membershipPlans";
import { Button } from "@/components/ui/button";

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
    const updateBannerHeight = () => {
      // Use different heights for mobile vs desktop
      const isMobile = window.innerWidth < 640; // sm breakpoint
      const bannerHeight = isVisible ? (isMobile ? 120 : 80) : 0;
      document.documentElement.style.setProperty('--banner-height', `${bannerHeight}px`);
    };

    updateBannerHeight();
    
    // Listen for window resize to update height
    window.addEventListener('resize', updateBannerHeight);
    return () => window.removeEventListener('resize', updateBannerHeight);
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
    <div className="bg-gray-900 dark:bg-gray-800 text-white px-2 sm:px-4 py-3 flex items-center">
      <div className="w-2 sm:w-4"></div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <div className="text-xs sm:text-sm text-center sm:text-left leading-relaxed">
          {getBannerMessage()}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExploreFeatures}
            className="text-xs sm:text-sm font-medium transition-colors text-gray-900 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Explore Features
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleUpgrade}
            className="text-xs sm:text-sm font-medium transition-colors text-gray-900 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Upgrade Now →
          </Button>
        </div>
      </div>
      
      <button
        onClick={handleDismiss}
        className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-200 transition-colors ml-2 flex-shrink-0"
        aria-label="Dismiss banner"
      >
        <X size={16} className="sm:w-4 sm:h-4 w-3.5 h-3.5" />
      </button>
    </div>
  );
}
