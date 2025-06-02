import React from "react";
import Image from "next/image";
import ZeroStateIcon from "/public/zero_state.svg";

const CustomTrackerNullState = () => {
  return (
    <div className="flex items-center justify-center flex-col gap-2 w-full">
      
      <div className="font-bold text-center">Hello! Here’s your quick-start guide:</div>
      <div className={`w-full text-[#666666] text-sm text-center`}>
        <span className="font-bold">Apply Filters- </span>
      <span className={`w-full text-center text-[#666666] text-sm`}>Explore the basic filters to quickly refine your results by category, date, and location.</span>
      
        </div>
        <div className={`w-full text-[#666666] text-sm text-center`}>
        <span className="font-bold">Explore analytics- </span>
      <span className={`w-full text-center text-[#666666] text-sm`}>Unlock advanced filters and drill down into your data.</span>
      
        </div>
        <Image src={ZeroStateIcon} alt="zerostate" width={200} height={160} />
    </div>
  );
};

export default CustomTrackerNullState;