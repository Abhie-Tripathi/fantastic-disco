import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CircleCheck, CircleX } from "lucide-react";
import Image from "next/image";
import whrLogo from "/public/HeroLogo.svg";
import { useRouter } from "next/navigation";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSuccess: boolean;
  plan: string;
};

const PaymentSuccessModal = ({ open, onOpenChange, isSuccess, plan }: ModalProps) => {
  const featureList = [
    "Global Event Search",
    "Global Company Search",
    "Global People Search",
    "Event Pipeline Management",
  ];

  const router = useRouter();

  const handleRoute = (status: string) => {
    if (status === "paid") router.push("/internal");
    if (status === "failed") router.push("https://whr.ai/pricing");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-2xl mx-auto p-4 sm:p-6 rounded-xl">
        {!isSuccess ? (
          <div className="flex flex-col items-center text-center space-y-6 py-2">
            <div>
              <div className="bg-red-50 rounded-full p-3 sm:p-4">
                <CircleX className="h-10 w-10 sm:h-12 sm:w-12 text-red-600" />
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

            <div className="w-4/5 text-base text-red-500 border-t border-dashed py-4 sm:border-none ">
              Please check your payment details and try again. If you need
              assistance, feel free to reach out to our support team
            </div>

            <Button size="lg" onClick={() => handleRoute("failed")}>
              Retry Payment
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-5 py-2">
            <div>
              <div className="bg-green-50 rounded-full p-3 sm:p-4">
                <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
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
              <div className="col-span-1 p-6">
                <h4 className="text-sm font-bold mb-4">Current Plan</h4>
                <div className="flex gap-2 items-center my-3">
                  <div
                    className="bg-[#FBFCFF] rounded-xl p-1 h-9 w-9 flex items-center justify-center"
                    style={{ boxShadow: "0px 1.32px 10.6px -1.32px #638CF352" }}
                  >
                    <Image src={whrLogo} alt="tick" height={26} width={24} />
                  </div>

                  <span className="text-xl font-bold">{plan}</span>

                  <Badge
                    className="text-[var(--success-text-color)] bg-[var(--success-background-color)] rounded-2xl ml-2"
                    variant="secondary"
                  >
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground my-6">
                  Unleash the Power of Your Business with {plan} Plan.
                </p>

                <Button onClick={() => handleRoute("paid")}>Get started</Button>
              </div>

              <div className="col-span-1 bg-[#F7F7FC] p-6 rounded-e-2xl">
                <h4 className="text-sm font-bold mb-4">What's included</h4>

                {featureList.map((item) => (
                  <div className="text-[#170F49] text-sm flex items-center gap-2 mb-3">
                    <CircleCheck
                      height={20}
                      width={20}
                      color="#FFFFFF"
                      fill="#4A3AFF"
                    />
                    {item}
                  </div>
                ))}
                <Button onClick={() => window.open("https://whr.ai/pricing", "_blank")} size="sm" variant="link" >View more {"->"}</Button>
              </div>
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

                <span className="text-lg font-semibold">{plan}</span>

                <Badge
                  className="text-[var(--success-text-color)] bg-[var(--success-background-color)] rounded-2xl ml-2"
                  variant="secondary"
                >
                  Active
                </Badge>
              </div>

              <h4 className="text-sm font-semibold">What's included</h4>

              <div className="flex gap-2 flex-col">
                {featureList.map((item) => (
                  <div className="text-[#170F49] text-sm flex items-center gap-2">
                    <CircleCheck
                      height={20}
                      width={20}
                      color="#FFFFFF"
                      fill="#4A3AFF"
                    />
                    {item}
                  </div>
                ))}
              </div>

              <Button onClick={() => handleRoute("paid")}>Get started</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessModal;
