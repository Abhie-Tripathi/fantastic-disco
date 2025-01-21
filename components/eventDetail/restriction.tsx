import { cn } from "@/lib/utils";
import LockRestriction from "/public/lock_restriction.svg";
import Image from "next/image";

const Restriction = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "z-100 p-2 rounded-md bg-transparent w-fit",
        className
      )}
    >
      <Image
        src={LockRestriction}
        className="w-4 h-4 aspect-square "
        alt="Lock"
      />
    </div>
  );
};
export default Restriction;
