import { cn } from "@/lib/utils";
import { LockClosedSmall } from "geist-icons";

const Restriction = ({ className }: { className?: string }) => {
  return (
    <LockClosedSmall
      color="var(--secondary-text-color)"
      height="25px"
      width="25px"
      className={(cn("w-8 h-8"), className)}
    />
  );
};
export default Restriction;
