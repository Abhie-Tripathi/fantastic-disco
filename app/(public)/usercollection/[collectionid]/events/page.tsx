import React from "react";
import Image from "next/image";
import TrackerPublic from "@/public/trackerPublic.jpg";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Events = () => {
    const redirectUrl = encodeURIComponent("/preset?presetId=d5c3068e-488f-4d13-9dbb-0f80580914a0&limit=1&offset=1&type=T_PRODUCT_KEYWORDS");

  return (
    <div className="relative h-screen w-full">
      <Image
        src={TrackerPublic}
        alt="TrackerPublic"
        fill
        className="object-cover"
        priority 
      />
      <Link 
      href={`/signup?redirect=${redirectUrl}`}
      className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
      <Button>Sign In</Button>
      </Link>
    </div>
  );
};

export default Events;
