"use client";
import React, { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import onboardingImage from "/public/onboarding_bg.svg";

export default function BackgroundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current && !isMobile) {
      divRef.current.style.backgroundImage = `url(${onboardingImage.src})`;
    }
  }, [isMobile]);

  return (
    <div
      ref={divRef}
      className="sm:border border-[#E6E6E6] bg-[#FAFAFF] z-10 sm:shadow-md rounded-[30px] w-full max-w-5xl p-4 pt-0 h-full md:min-h-[80vh] flex justify-center items-center relative overflow-hidden"
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center calc(100% + 70px)",
        backgroundSize: "60% auto",
      }}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
