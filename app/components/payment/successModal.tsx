import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CircleCheck, CircleX } from "lucide-react";
import Image from "next/image";
import whrLogo from "/public/HeroLogo.svg";
import { useRouter } from "next/navigation";
import { MembershipPlan } from "@/data/membershipPlans";
import { useEffect } from "react";
import { GAEvent } from "@/utils/GAEvent";
import { isEventeli } from "@/config";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSuccess: boolean;
  membership: number;
};

export const featureList: {
  [item: string]: string[];
} = {
  Essential: [
    "Global Event Search",
    "Global Company Search",
    "Global People Search",
    "Basic Event Tracker",
  ],
  Scale: [
    "Advance Event Search",
    "Advance People Search",
    "Advance Company Search",
    "Advance Trackers",
  ],
  Advance: [
    "Priority Support",
    "Unlimited User-access",
    "Event Relevance Scoring",
    "Embedable Custom Domain",
  ],
  Enterprise: [
    "Eveything in Advance +",
    "Advance Outreach & Conceirge",
    "API Access",
    "Custom Reports & Intel",
  ],
};

const PaymentSuccessModal = ({
  open,
  onOpenChange,
  isSuccess,
  membership,
}: ModalProps) => {
  const membershipPlan = MembershipPlan[membership || 0];

  const features = featureList?.[membershipPlan] || [];

  const router = useRouter();

  const handleRoute = (status: string) => {
    if (status === "paid") router.push("/internal");
    else if (status === "failed") {
      router.push(
        `https://whr.ai/pricing?utm_source=${
          isEventeli ? "geo" : "gtm"
        }&utm_campaign=payment&utm_medium=web&utm_term=payment_failed_retry`
      );
    }
  };

  useEffect(() => {
    if (isSuccess) {
      GAEvent(
        "",
        "Plan Upgrade",
        "Success",
        `${isEventeli ? "geo" : "gtm"} | payment | web | payment_success`
      );
    } else {
      GAEvent(
        "",
        "Plan Upgrade",
        "Failed",
        `${isEventeli ? "geo" : "gtm"} | payment | web | payment_failed`
      );
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-2xl mx-auto p-4 sm:p-6 rounded-xl">
        {!isSuccess ? (
          <div className="flex flex-col items-center text-center space-y-6 py-2">
            <div>
              <div className="bg-[var(--danger-background-color)] rounded-full p-3 sm:p-4">
                <CircleX className="h-10 w-10 sm:h-12 sm:w-12 text-[var(--danger-text-color)]" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-semibold">
                Payment Failed!
              </h3>
              <p className="text-sm text-muted-foreground">
                Your payment was not completed.
              </p>
            </div>

            <div className="w-4/5 text-base text-[var(--danger-text-color)] border-t border-dashed py-4 sm:border-none ">
              Please check your payment details and try again. If the amount has
              been deducted, your plan will be activated within the next 24
              working hours.
            </div>

            <Button size="lg" onClick={() => handleRoute("failed")}>
              Retry Payment
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-5 py-2">
            <div>
              <div className="bg-[var(--success-background-color)] rounded-full p-3 sm:p-4">
                <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-[var(--success-text-color)]" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-semibold">
                Payment Successful!
              </h3>
              <p className="text-sm text-muted-foreground">
                Your payment has been successfully done.
              </p>
            </div>

            {/* Desktop View */}
            <div
              className="hidden rounded-2xl w-[90%] sm:grid grid-cols-2 text-start"
              style={{ boxShadow: "0px 1.59px 9.56px 0px #14142B14" }}
            >
              <div className="col-span-1 p-6 dark:bg-[#1A1A1A] rounded-s-2xl">
                <h4 className="text-sm font-bold mb-4">Current Plan</h4>
                <div className="flex gap-2 items-center my-3">
                  <div
                    className="bg-[#FBFCFF] rounded-xl p-1 h-9 w-9 flex items-center justify-center"
                    style={{ boxShadow: "0px 1.32px 10.6px -1.32px #638CF352" }}
                  >
                    <Image src={whrLogo} alt="tick" height={26} width={24} />
                  </div>

                  <span className="text-xl font-bold">{membershipPlan}</span>

                  <Badge
                    className="text-[var(--success-text-color)] bg-[var(--success-background-color)] rounded-2xl ml-2"
                    variant="secondary"
                  >
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground my-6">
                  Unleash the Power of Your Business with {membershipPlan} Plan.
                </p>

                <Button onClick={() => handleRoute("paid")}>Get started</Button>
              </div>

              {features.length > 0 && (
                <div className="col-span-1 bg-[#F7F7FC] dark:bg-[#292929] p-6 rounded-e-2xl">
                  <h4 className="text-sm font-bold mb-4">
                    What&apos;s included
                  </h4>

                  {features.map((item, index) => (
                    <div
                      key={index}
                      className="text-[#170F49] dark:text-white text-sm flex items-center gap-2 mb-3"
                    >
                      <CircleCheck
                        height={20}
                        width={20}
                        color="#FFFFFF"
                        fill="#4A3AFF"
                      />
                      {item}
                    </div>
                  ))}
                  <span className="text-primary text-sm font-semibold">
                    and more
                  </span>
                </div>
              )}
            </div>

            {/* Mobile View */}
            <div className="sm:hidden border-dashed border-t space-y-4">
              <div className="flex gap-2 items-center mt-4">
                <div
                  className="bg-[#FBFCFF] rounded-xl p-1 h-9 w-9 flex items-center justify-center"
                  style={{ boxShadow: "0px 1.32px 10.6px -1.32px #638CF352" }}
                >
                  <Image src={whrLogo} alt="tick" height={26} width={24} />
                </div>

                <span className="text-lg font-semibold">{membershipPlan}</span>

                <Badge
                  className="text-[var(--success-text-color)] bg-[var(--success-background-color)] rounded-2xl ml-2"
                  variant="secondary"
                >
                  Active
                </Badge>
              </div>

              {features.length > 0 && (
                <>
                  <h4 className="text-sm font-semibold">
                    What&apos;s included
                  </h4>
                  <div className="flex gap-2 flex-col">
                    {features.map((item, index) => (
                      <div
                        key={index}
                        className="text-[#170F49] dark:text-white text-sm flex items-center gap-2"
                      >
                        <CircleCheck
                          height={20}
                          width={20}
                          color="#FFFFFF"
                          fill="#4A3AFF"
                        />
                        {item}
                      </div>
                    ))}
                    <span className="text-primary text-sm font-medium">
                      and more
                    </span>
                  </div>
                </>
              )}

              <Button onClick={() => handleRoute("paid")}>Get started</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessModal;
