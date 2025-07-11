"use client";
import React from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import onboardingImage from "/public/onboarding_bg.svg";

export default function BackgroundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  return (
    <div
      className="sm:border border-[#E6E6E6] bg-[#FAFAFF] z-10 sm:shadow-md rounded-[30px] w-full max-w-5xl p-4 pt-0 h-full md:min-h-[80vh] flex justify-center items-center relative overflow-hidden"
      style={{
        backgroundImage: isMobile ? undefined : `url(${onboardingImage.src})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center calc(100% + 70px)",
        backgroundSize: "60% auto",
      }}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
