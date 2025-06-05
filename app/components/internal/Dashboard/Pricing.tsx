import React from "react";
import PricingImage from "/public/internal/dashboard/PricingImage.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MembershipData } from "@/types/user";
import { MembershipPlan } from "@/data/membershipPlans";
import { format } from "date-fns";
import Link from "next/link";
import { isEventeli } from "@/config";
import { GAEvent } from "@/utils/GAEvent";

interface Props {
  membershipData: MembershipData | undefined;
}

const Pricing = ({ membershipData }: Props) => {
  const router = useRouter();
  const { membership, endDate } = membershipData || {};
  const membershipPlan = MembershipPlan[membership || 0];
  const formattedMembershipEndDate = format(
    new Date("2026-01-01T00:00:00.000Z"),
    "dd MMM, yyyy"
  );

  const handleUpgradeClick = () => {
    GAEvent("", "Plan Upgrade", "Dashboard", `${isEventeli ? "geo" : "gtm"} | pricing | web | dashboard_upgrade_plan`);
  }

  return (
    <div className="max-w-[320px] h-fit rounded-[12px] border border-[var(--border-color)] p-4">
      <div className="text-[var(--primary-color)] font-[var(--font-weight-semibold)] text-xs">
        Subscription & Plans
      </div>
      <div className="border-t-[1px] border-[var(--border-color)] mt-2"></div>
      <div className="mt-2 bg-[var(--info-background-color)] rounded-xl p-4 flex flex-col h-[205px] items-center justify-center">
        <Image width={55} height={55} src={PricingImage} alt="img" />
        <div className="text-lg font-medium text-[#0072F5] mt-3 text-center">
          {membershipPlan || "Our subscription functionality is coming soon!"}
        </div>
        {!membershipPlan && (
          <div className="text-xs text-[#0072F5] text-center mt-3">
            {" "}
            For now, reach out to us to explore how Event Intelligence can
            empower your events with unlimited access and features
          </div>
        )}
        {membershipPlan && (
          <div className="w-full mt-auto">
            {membershipPlan === MembershipPlan[0] ? (
              <Link
                className="py-2 text-sm w-full mx-auto border border-primary text-primary bg-background flex items-center justify-center rounded-md font-medium"
                target="_blank"
                href={`https://whr.ai/pricing?utm_source=${
                  isEventeli ? "geo" : "gtm"
                }&utm_campaign=pricing&utm_medium=web&utm_term=research_upgrade_le`}
                onClick={handleUpgradeClick}
              >Upgrade Plan</Link>
            ) : (
              <div className="flex justify-between w-full">
                <p className="text-sm text-[var(--secondary-text-color)] font-semibold">
                  Subscription Ends
                </p>
                <p className="text-sm text-[var( --primary-text-color)] font-semibold">
                  {formattedMembershipEndDate}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;
