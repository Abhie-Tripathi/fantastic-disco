"use client";
import { MembershipData } from "@/types/user";
import { MembershipPlan } from "@/data/membershipPlans";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GAEvent } from "@/utils/GAEvent";
import { isEventeli } from "@/config";
import { useProfileServices } from "@/services/profileService";
import { useEffect, useState } from "react";
import { Mail } from "lucide-react";

const Subscription = () => {
  const { getMembershipData } = useProfileServices();
  const [membershipData, setMembershipData] = useState<MembershipData>();

  const { membership, endDate } = membershipData || {};
  const membershipPlan = MembershipPlan[membership || 0];

  const formattedMembershipEndDate =
    membershipPlan === MembershipPlan[0]
      ? "-"
      : endDate && endDate !== null
      ? format(endDate, "dd MMM, yyyy")
      : "-";

  const handleUpgradeClick = () => {
    window.open(
      `https://whr.ai/pricing?utm_source=${
        isEventeli ? "geo" : "gtm"
      }&utm_campaign=pricing&utm_medium=web&utm_term=settings_upgrade_plan`,
      "_blank"
    );
    GAEvent(
      "",
      "Plan Upgrade",
      "Settings",
      `${isEventeli ? "geo" : "gtm"} | pricing | web | settings_upgrade_plan`
    );
  };

  const fetchMembershipData = async () => {
    try {
      const data = await getMembershipData();
      if (data) setMembershipData(data);
    } catch (error) {
      console.error("Error fetching user membership data:", error);
    }
  };

  useEffect(() => {
    fetchMembershipData();
  }, []);

  return (
    <div className="p-6 pt-0">
      <div className="space-y-4 md:w-4/5">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-muted-foreground font-medium col-span-1 md:col-span-1">
            Current Plan
          </div>

          <div className="flex col-span-1 gap-3 flex-wrap">
            <div>
              <span className="font-medium">{membershipPlan}</span>
              <Badge
                className="text-[var(--success-text-color)] bg-[var(--success-background-color)] border-[var(--success-text-color)] ml-2"
                variant="outline"
              >
                Active
              </Badge>
              {/* <Badge
                className="text-[var(--danger-text-color)] bg-[var(--danger-background-color)] border-[var(--danger-text-color)] ml-2"
                variant="outline"
              >
                Deactivated
              </Badge> */}
            </div>
            {membershipPlan && membershipPlan === MembershipPlan[0] && (
              <div className="col-span-1 lg:ml-5">
                <Button size="sm" onClick={handleUpgradeClick}>
                  Upgrade Plan
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 items-center">
          <div className="text-muted-foreground font-medium col-span-1">Next renewal</div>
          <div className="flex col-span-1">
            <span className="text-sm font-medium">
              {formattedMembershipEndDate}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-muted-foreground font-medium text-sm col-span-2 mt-4">For any payment-related queries, please contact us at 
            <span className="text-primary" > be@whr.ai</span>
            </div>
          {/* <div className="flex col-span-1">
            <Link
              className="text-primary text-sm font-semibold flex items-center gap-1"
              href="mailto:be@whr.ai"
            >
              <Mail className="h-4 w-4" />
              be@whr.ai
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
