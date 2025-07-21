import clsx from "clsx";
import PremiumModal from "../premium-modal";
import { useState } from "react";
import { RainbowButton } from "../magicui/rainbow-button";

const Restriction = ({ className = "" }) => {
  const [isPremiumModalOpen, setPremiumModalOpen] = useState(false);
  return (
    <div>
      <RainbowButton
        size="sm"
        className="ml-auto h-6 rounded-sm"
        onClick={() => setPremiumModalOpen(true)}
      >
        Premium
      </RainbowButton>
      <PremiumModal
        open={isPremiumModalOpen}
        onOpenChange={setPremiumModalOpen}
      />
    </div>
  );
};
export default Restriction;
