import React from "react";
import Image from "next/image";
import TrackerPublic from "@/public/trackerPublic.jpg";

const Events = () => {
  return (
    <div className="relative h-screen w-full">
        <Image
          src={TrackerPublic}
          alt="Image with blurred background"
          width={100%}
          height={100%}
        />
    </div>
  );
};

export default Events;
