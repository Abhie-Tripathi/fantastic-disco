import React from "react";
import Image from "next/image";
import ZeroStateIcon from "/public/zero_state.svg";

const ZeroState = ({ title, text }: { title?: string; text?: string }) => {
  return (
    <div className="flex items-center justify-center flex-col gap-2">
      <Image src={ZeroStateIcon} alt="zerostate" width={200} height={160} />
      <div className="w-[400px] text-[#666666] text-sm text-center">
        {title}
      </div>
      <div className="text-center w-[400px] text-[#666666] text-sm">{text}</div>
    </div>
  );
};

export default ZeroState;
