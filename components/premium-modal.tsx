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

const slides = [
  {
    id: 1,
    title: "Advanced Filters",
    planName: "Essential",
    planType: "For individuals",
    status: "Active",
    description: "Unleash the Power of Your Business\nwith Essential Plan.",
    features: [
      "All analytics features",
      "Up to 250,000 tracked visits",
      "Normal support",
      "Up to 3 team members",
    ],
  },
  {
    id: 2,
    title: "Premium Analytics",
    planName: "Scale",
    planType: "For teams",
    status: "Recommended",
    description: "Unleash the Power of Your Business\nwith Scale Plan.",
    features: [
      "Advanced analytics & reporting",
      "Up to 1,000,000 tracked visits",
      "Priority support",
      "Up to 10 team members",
    ],
  },
  {
    id: 3,
    title: "Enterprise Features",
    planName: "Advance",
    planType: "For organizations",
    status: "Popular",
    description: "Unleash the Power of Your Business\nwith Advance Plan.",
    features: [
      "All enterprise features",
      "Unlimited tracked visits",
      "24/7 dedicated support",
      "Unlimited team members",
    ],
  },
  {
    id: 4,
    title: "AI-Powered Tools",
    planName: "Enterprise",
    planType: "For power users",
    status: "New",
    description: "Unleash the Power of Your Business\nwith Enterprise Plan.",
    features: [
      "AI-powered insights",
      "Smart recommendations",
      "Automated reporting",
      "Advanced integrations",
    ],
  }
];

export default function PremiumModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full p-0 bg-transparent border-0 shadow-none flex items-center justify-center">
        <div className="relative w-full bg-white rounded-3xl shadow-2xl px-0 py-0 flex flex-col items-center">
          {/* Close Button */}
          {/* <button
            onClick={() => onOpenChange(false)}
            className="absolute top-6 right-6 z-10 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-800 stroke-2" />
          </button> */}

          {/* Header Section */}
          <div className="text-center pt-10 pb-6 px-8">
            {/* Hexagonal Shield Badge */}
            <div className="inline-block mb-4">
              <Image src={lockIcon} alt="lock-icon" />
            </div>

            <div className="mb-3">
              <span className="inline-block bg-black text-white px-4 py-1 text-xs font-semibold rounded-sm shadow-md">
                Premium Feature
              </span>
            </div>

            <p className="text-[#474747] text-sm font-normal mx-auto leading-relaxed">
              Your plan credits has been exhausted. Please upgrade your plan to
              continue
            </p>
          </div>

          {/* Carousel Content */}
          <div className="relative w-full flex items-center justify-center px-12 pb-8">
            {/* Left Arrow */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Card Content */}
            <div className="w-full bg-white rounded-2xl shadow-lg flex flex-row overflow-hidden">
              {/* Left Section - Plan Details */}
              <div className="w-1/2 p-8 flex flex-col justify-between border-r border-gray-100">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    {currentSlideData.title}
                  </h3>
                  <div className="flex items-start gap-3 mb-6">
                    <div
                      className="bg-[#FBFCFF] rounded-xl p-1 h-9 w-9 flex items-center justify-center"
                      style={{
                        boxShadow: "0px 1.32px 10.6px -1.32px #638CF352",
                      }}
                    >
                      <Image src={whrLogo} alt="tick" height={26} width={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500 font-normal">
                          {currentSlideData.planType}
                        </span>
                        <Badge
                          className="text-[var(--success-text-color)] bg-[var(--success-background-color)] rounded-2xl"
                          variant="secondary"
                        >
                          Active
                        </Badge>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                        {currentSlideData.planName}
                      </h2>
                      <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                        {currentSlideData.description}
                      </p>
                    </div>
                  </div>
                </div>
                <Button size="lg" className="max-w-44">
                  Upgrade Plan
                </Button>
              </div>

              {/* Right Section - Features */}
              <div className="w-1/2 p-8 flex flex-col justify-between bg-[#F7F7FC]">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-6">
                    {"What's included"}
                  </h3>
                  <div className="space-y-4">
                    {currentSlideData.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <div className="w-5 h-5 bg-[#4A3AFF] rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white stroke-2" />
                        </div>
                        <span className="text-gray-800 text-sm font-medium">
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
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Dots */}
          <div className="flex items-center justify-center gap-2 mt-2 mb-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors border border-gray-300 ${
                  index === currentSlide
                    ? "bg-gray-800"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
