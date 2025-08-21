"use client";
import { MembershipPlan } from "@/data/membershipPlans";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GAEvent } from "@/utils/GAEvent";
import { isEventeli } from "@/config";
import { useProfileServices } from "@/services/profileService";
import { useEffect, useState } from "react";
// import { Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import PaymentSuccessModal from "@/app/components/payment/successModal";
import { useAuthContext } from "@/context";
import FeedbackForm from "@/app/components/payment/feedbackForm";
import { sessionStorage } from "@/services/storageService";

const Subscription = () => {
  const { membershipData, setMembershipData } = useAuthContext();
  const { getMembershipData } = useProfileServices();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { membership, planRenewalDate, endDate } = membershipData || {};
  const membershipPlan = MembershipPlan[membership || 0];
  const platform = isEventeli ? "geo" : "gtm";
  const CONFIG_CACHE_KEY = `whr.${platform}.config.filter`;

  const [isLoading, setIsloading] = useState<boolean>(false);

  const isPremium =
    !!membershipData &&
    membershipData.membership != null &&
    membershipData.membership > MembershipPlan.Freemium;

  const formattedNextRenewalDate =
    membershipPlan === MembershipPlan[0]
      ? "-"
      : planRenewalDate && planRenewalDate !== null
      ? format(planRenewalDate, "dd MMM, yyyy")
      : "-";

  const planEndDate =
    endDate && endDate !== null ? format(endDate, "dd MMM, yyyy") : "";

  const [paymentStatus, setPaymentStatus] = useState<any>(null);
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");

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

  const updateMembershipData = async () => {
    try {
      const data = await getMembershipData();
      if (data) setMembershipData(data);
    } catch (error) {
      console.error("Error fetching user membership data:", error);
    }
  };

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      try {
        setIsloading(true);
        const res = await fetch(`/api/checkout-session/${session_id}`);
        const data = await res.json();
        // console.log("Payment Status:", data);
        if (data) {
          setPaymentStatus(data);
          updateMembershipData();
          if (data?.status === "paid" && data?.updatePlan?.data?.id)  // plan update successfully
            sessionStorage.remove(CONFIG_CACHE_KEY);
        }
      } catch (err) {
        console.error("Error fetching payment status:", err);
      } finally {
        setShowSuccessModal(true);
        setIsloading(false);
      }
    };

    if (session_id) fetchCheckoutSession();
  }, [session_id]);

  return (
    <div className="p-6 pt-0">
      <div className="space-y-4 md:w-4/5">
        <div className="text-muted-foreground text-sm">
          Stay on board for uninterrupted access - your subscription auto-renews
          so you never miss out. Upgrade or{" "}
          {isPremium && planRenewalDate !== null ? (
            <span
              onClick={() => setShowFeedbackModal(true)}
              className="cursor-pointer underline-offset-2 underline"
            >
              cancel
            </span>
          ) : (
            "cancel"
          )}{" "}
          anytime.
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-muted-foreground font-medium col-span-1 md:col-span-1">
            Current Plan
          </div>

          <div className="flex col-span-1 gap-3 flex-wrap">
            {!membershipData || isLoading ? (
              <Skeleton className="h-6 w-36" />
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-muted-foreground font-medium col-span-1">
            Next renewal
          </div>
          <div className="flex col-span-1 items-center gap-1 sm:gap-4 flex-wrap">
            {!membershipData || isLoading ? (
              <Skeleton className="h-6 w-36" />
            ) : isPremium && planRenewalDate === null ? (
              <span className="text-sm font-medium">
                Disabled{" "}
                <span className="text-muted-foreground">
                  (Subscription will end on {planEndDate})
                </span>
              </span>
            ) : (
              <span className="text-sm font-medium">
                {formattedNextRenewalDate}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-muted-foreground font-medium text-sm col-span-2 mt-4">
            For any payment-related queries, please contact us at
            <Link
              href="mailto:payment@whr.ai"
              className="text-primary font-semibold"
            >
              {" "}
              payment@whr.ai
            </Link>
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

      {!isLoading && (
        <PaymentSuccessModal
          open={showSuccessModal}
          onOpenChange={setShowSuccessModal}
          isSuccess={
            paymentStatus?.status === "paid" &&
            paymentStatus?.updatePlan?.data?.id
              ? true
              : false
          }
          membership={membership || 0}
        />
      )}
      {isPremium && (
        <FeedbackForm
          open={showFeedbackModal}
          onOpenChange={setShowFeedbackModal}
        />
      )}
    </div>
  );
};

export default Subscription;
