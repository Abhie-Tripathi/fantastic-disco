"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Lock,
  Check,
  ChevronRight,
  ChevronLeft,
  Star,
  Zap,
  Crown,
} from "lucide-react";
import Image from "next/image";
import lockIcon from "@/public/lock-icon.svg";
import whrLogo from "/public/HeroLogo.svg";
import { featureList } from "@/app/components/payment/successModal";
import { useAuthContext } from "@/context";
import { MembershipData } from "@/types/user";
import { MembershipPlan } from "@/data/membershipPlans";
import { isEventeli } from "@/config";

export default function PremiumModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const {membershipData} = useAuthContext()

  const slides = [
    {
      id: 1,
      // title: "Advanced Filters",
      planName: "Essential",
      // planType: "For individuals",
      status: "Active",
      description: "Unleash the Power of Your Business\nwith Essential Plan.",
      features: featureList.Essential,
      planValue: MembershipPlan.Essential,
    },
    {
      id: 2,
      // title: "Premium Analytics",
      planName: "Scale",
      // planType: "For teams",
      status: "Recommended",
      description: "Unleash the Power of Your Business\nwith Scale Plan.",
      features: featureList.Scale,
      planValue: MembershipPlan.Scale,
    },
    {
      id: 3,
      // title: "Enterprise Features",
      planName: "Advance",
      // planType: "For organizations",
      status: "Popular",
      description: "Unleash the Power of Your Business\nwith Advance Plan.",
      features: featureList.Advance,
      planValue: MembershipPlan.Advance,
    },
    {
      id: 4,
      // title: "AI-Powered Tools",
      planName: "Enterprise",
      // planType: "For power users",
      status: "New",
      description: "Unleash the Power of Your Business\nwith Enterprise Plan.",
      features: featureList.Enterprise,
      planValue: MembershipPlan.Enterprise,
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  const handleUpgradeClick = () => {
    window.open(
      `https://whr.ai/pricing?utm_source=${isEventeli ? "geo" : "gtm"}&utm_campaign=pricing&utm_medium=web&utm_term=navbar_upgrade_plan`,
      "_blank"
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full p-0 bg-transparent border-0 shadow-none flex items-center justify-center max-h-[90vh] overflow-hidden">
        <div className="relative w-full bg-background dark:bg-[#1A1A1A] rounded-3xl shadow-2xl px-0 py-0 flex flex-col items-center max-h-full overflow-hidden">
          {/* Header Section */}
          <div className="text-center pt-6 sm:pt-10 pb-4 sm:pb-6 px-4 sm:px-8">
            <div className="inline-block mb-3 sm:mb-4">
              <Image src={lockIcon} alt="lock-icon" className="w-8 h-8 sm:w-auto sm:h-auto" />
            </div>

            <div className="mb-2 sm:mb-3">
              <span className="inline-block bg-black dark:bg-white dark:text-black text-white px-3 sm:px-4 py-1 text-xs font-semibold rounded-sm shadow-md">
                Premium Feature
              </span>
            </div>

            {/* <p className="text-[#474747] dark:text-muted-foreground text-xs sm:text-sm font-normal mx-auto leading-relaxed px-2">
              Your plan credits has been exhausted. Please upgrade your plan to
              continue
            </p> */}
          </div>

          {/* Carousel Content */}
          <div className="relative w-full flex items-center justify-center px-4 sm:px-12 pb-6 sm:pb-8 flex-1 overflow-hidden">
            {/* Left Arrow */}
            <button
              onClick={prevSlide}
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 bg-white dark:bg-[#232323] shadow-md rounded-full hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-white" />
            </button>

            {/* Card Content */}
            <div className="w-full bg-white dark:bg-[#232323] rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden max-h-full">
              {/* Left Section - Plan Details */}
              <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-between md:border-r border-gray-100 dark:border-[#333]">
                <div>
                  {/* <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                    {currentSlideData.title}
                  </h3> */}
                  <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div
                      className="bg-[#FBFCFF] dark:bg-[#292929] rounded-xl p-1 h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center flex-shrink-0"
                      style={{
                        boxShadow: "0px 1.32px 10.6px -1.32px #638CF352",
                      }}
                    >
                      <Image src={whrLogo} alt="tick" height={20} width={18} className="sm:h-[26px] sm:w-[24px]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs text-gray-500 dark:text-gray-300 font-normal">
                          {currentSlideData.planType}
                        </span>
                       
                      </div> */}
                      <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                        {currentSlideData.planName}
                      </h2>
                      {membershipData && membershipData.membership === currentSlideData.planValue && (
                          <Badge
                            className="text-[var(--success-text-color)] bg-[var(--success-background-color)] rounded-2xl text-xs"
                            variant="secondary"
                          >
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-500 dark:text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                        {currentSlideData.description}
                      </p>
                    </div>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="w-full sm:max-w-44 mt-4 md:mt-0"
                  onClick={handleUpgradeClick}
                >
                  Upgrade Plan
                </Button>
              </div>

              {/* Right Section - Features */}
              <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-between bg-[#F7F7FC] dark:bg-[#292929] overflow-y-auto">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                    {"What's included"}
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {currentSlideData.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-2 sm:gap-3"
                      >
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#4A3AFF] rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white stroke-2" />
                        </div>
                        <span className="text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-medium leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={nextSlide}
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 bg-white dark:bg-[#232323] shadow-md rounded-full hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-white" />
            </button>
          </div>

          {/* Navigation Dots */}
          <div className="flex items-center justify-center gap-2 mt-2 mb-6 sm:mb-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors border border-gray-300 dark:border-gray-600 ${
                  index === currentSlide
                    ? "bg-gray-800 dark:bg-white"
                    : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}